// sync_app_write_data.ts (corrected and simplified)
import { Client, Databases, Query } from 'npm:appwrite@15.0.0';
import { createSuperdevClient } from 'npm:@superdevhq/client@0.1.51';

const superdev = createSuperdevClient({ 
  appId: Deno.env.get('SUPERDEV_APP_ID'), 
});

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    superdev.auth.setToken(token);

    // ENV variables
    const projectId = Deno.env.get('APPWRITE_PROJECT_ID');
    const apiKey = Deno.env.get('APPWRITE_API_KEY');
    const patientCollectionId = Deno.env.get('APPWRITE_COLLECTION_ID');
    const possibleEndpointsRaw = Deno.env.get('APPWRITE_API_ENDPOINT');
    const endpoints = possibleEndpointsRaw?.split(',') || ['https://nyc.cloud.appwrite.io/v1'];

    if (!projectId || !apiKey || !patientCollectionId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required environment variables',
        debug: { projectId, apiKey, patientCollectionId }
      }), { status: 500 });
    }

    let client: Client;
    let databases: Databases;
    let workingEndpoint: string | null = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
        databases = new Databases(client);
        await databases.list();
        workingEndpoint = endpoint;
        break;
      } catch (err) {
        console.log(`Failed at ${endpoint}:`, err.message);
      }
    }

    if (!workingEndpoint) {
      return new Response(JSON.stringify({
        success: false,
        error: 'All endpoint attempts failed',
        tried: endpoints
      }), { status: 500 });
    }

    let databaseId = Deno.env.get('APPWRITE_DATABASE_ID');
    if (!databaseId) {
      const dbs = await databases.list();
      if (!dbs.databases.length) {
        return new Response(JSON.stringify({ error: 'No databases found' }), { status: 500 });
      }
      databaseId = dbs.databases[0].$id;
    }

    const { collection } = await req.json();
    const syncResults = { patients: 0 };

    if (!collection || collection === 'patients') {
      const docs = await databases.listDocuments(databaseId, patientCollectionId, [Query.limit(100)]);
      for (const doc of docs.documents) {
        const patient = {
          patient_id: doc.patient_id || doc.$id,
          patient_name: doc.patient_name || doc.name || 'Unknown',
          condition: doc.condition || '',
          chemotherapy: [].concat(doc.chemotherapy || []),
          radiotherapy: [].concat(doc.radiotherapy || []),
          age: doc.age || 0,
          gender: [].concat(doc.gender || []),
          country: doc.country || '',
          metastasis: [].concat(doc.metastasis || []),
          histology: doc.histology || '',
          biomarker: doc.biomarker || '',
          ecog_score: doc.ecog_score || 0,
          condition_recurrence: [].concat(doc.condition_recurrence || []),
          status: doc.status || 'pending',
          matched: doc.matched || false,
          matched_trials_count: doc.matched_trials_count || 0
        };

        const existing = await superdev.entities.Patient.filter({ patient_id: patient.patient_id });
        if (!existing.length) {
          await superdev.entities.Patient.create(patient);
        } else {
          await superdev.entities.Patient.update(existing[0].id, patient);
        }
        syncResults.patients++;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Sync completed',
      results: syncResults,
      usedEndpoint: workingEndpoint,
      db: databaseId
    }), { status: 200 });

  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Unknown failure',
      debug: { stack: err.stack }
    }), { status: 500 });
  }
});
