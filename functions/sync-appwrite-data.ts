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

    // Get environment variables
    const projectId = Deno.env.get('APPWRITE_PROJECT_ID');
    const apiKey = Deno.env.get('APPWRITE_API_KEY');
    const patientCollectionId = Deno.env.get('APPWRITE_COLLECTION_ID') || '6856f1370028a19d776b';
    
    // Try different possible endpoints
    const possibleEndpoints = [
      Deno.env.get('APPWRITE_ENDPOINT'),
      'https://cloud.appwrite.io/v1',
      'https://appwrite.io/v1',
      'https://eu-central-1.appwrite.global/v1',
      'https://us-east-1.appwrite.global/v1',
      'https://ap-south-1.appwrite.global/v1'
    ].filter(Boolean);

    if (!projectId || !apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required environment variables: APPWRITE_PROJECT_ID or APPWRITE_API_KEY',
        debug: {
          hasProjectId: !!projectId,
          hasApiKey: !!apiKey,
          patientCollectionId
        }
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log('Attempting to connect to AppWrite with:', {
      projectId,
      patientCollectionId,
      endpoints: possibleEndpoints
    });

    const { collection } = await req.json();
    let client;
    let databases;
    let workingEndpoint;

    // Try each endpoint until one works
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        
        client = new Client();
        client
          .setEndpoint(endpoint)
          .setProject(projectId);

        // Set API key for server-side operations
        client.headers['X-Appwrite-Key'] = apiKey;
        
        databases = new Databases(client);
        
        // Test the connection by trying to list databases
        await databases.list();
        workingEndpoint = endpoint;
        console.log(`Successfully connected to: ${endpoint}`);
        break;
      } catch (error) {
        console.log(`Failed to connect to ${endpoint}:`, error.message);
        continue;
      }
    }

    if (!workingEndpoint) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Could not connect to any AppWrite endpoint. Please check your project region and endpoint configuration.',
        debug: {
          projectId,
          triedEndpoints: possibleEndpoints,
          suggestion: 'Make sure your APPWRITE_ENDPOINT environment variable matches your project region'
        }
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    let syncResults = {
      patients: 0,
      trials: 0,
      matches: 0,
      summaries: 0,
      metrics: 0
    };

    // Try to determine the database ID by listing databases
    let databaseId = Deno.env.get('APPWRITE_DATABASE_ID');
    
    if (!databaseId) {
      try {
        const databasesList = await databases.list();
        if (databasesList.databases.length > 0) {
          databaseId = databasesList.databases[0].$id;
          console.log(`Using database: ${databaseId}`);
        } else {
          throw new Error('No databases found in the project');
        }
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Could not determine database ID. Please set APPWRITE_DATABASE_ID environment variable.',
          debug: {
            error: error.message,
            suggestion: 'Check your AppWrite console for the correct database ID'
          }
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Sync Patients from your specific collection
    if (!collection || collection === 'patients') {
      try {
        console.log(`Fetching patients from database: ${databaseId}, collection: ${patientCollectionId}`);
        
        const patientsResult = await databases.listDocuments(
          databaseId,
          patientCollectionId,
          [Query.limit(100)]
        );

        console.log(`Found ${patientsResult.documents.length} patients in AppWrite`);

        for (const doc of patientsResult.documents) {
          console.log('Processing patient:', doc.patient_id || doc.$id);
          
          const patientData = {
            patient_id: doc.patient_id || doc.$id,
            patient_name: doc.patient_name || doc.name || 'Unknown',
            condition: doc.condition || '',
            chemotherapy: Array.isArray(doc.chemotherapy) ? doc.chemotherapy : (doc.chemotherapy ? [doc.chemotherapy] : []),
            radiotherapy: Array.isArray(doc.radiotherapy) ? doc.radiotherapy : (doc.radiotherapy ? [doc.radiotherapy] : []),
            age: doc.age || 0,
            gender: Array.isArray(doc.gender) ? doc.gender : (doc.gender ? [doc.gender] : []),
            country: doc.country || '',
            metastasis: Array.isArray(doc.metastasis) ? doc.metastasis : (doc.metastasis ? [doc.metastasis] : []),
            histology: doc.histology || '',
            biomarker: doc.biomarker || '',
            ecog_score: doc.ecog_score || 0,
            condition_recurrence: Array.isArray(doc.condition_recurrence) ? doc.condition_recurrence : (doc.condition_recurrence ? [doc.condition_recurrence] : []),
            status: doc.status || 'pending',
            matched: doc.matched || false,
            matched_trials_count: doc.matched_trials_count || 0
          };

          // Check if patient already exists
          const existingPatients = await superdev.entities.Patient.filter({ 
            patient_id: patientData.patient_id 
          });
          
          if (existingPatients.length === 0) {
            await superdev.entities.Patient.create(patientData);
            console.log('Created new patient:', patientData.patient_id);
          } else {
            await superdev.entities.Patient.update(existingPatients[0].id, patientData);
            console.log('Updated existing patient:', patientData.patient_id);
          }
          syncResults.patients++;
        }
      } catch (error) {
        console.error('Error syncing patients:', error);
        return new Response(JSON.stringify({
          success: false,
          error: `Failed to sync patients: ${error.message}`,
          debug: {
            endpoint: workingEndpoint,
            databaseId,
            patientCollectionId,
            errorType: error.type || 'Unknown',
            suggestion: error.message.includes('Collection') ? 
              'Check if the collection ID is correct in your AppWrite console' :
              'Verify your database and collection permissions'
          }
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Sync other collections with similar error handling...
    if (!collection || collection === 'trials') {
      try {
        const trialsResult = await databases.listDocuments(
          databaseId,
          'trial_info',
          [Query.limit(100)]
        );

        for (const doc of trialsResult.documents) {
          const trialData = {
            trial_id: doc.trial_id || doc.$id,
            title: doc.title || '',
            official_title: doc.official_title || '',
            phase: doc.phase || '',
            condition: doc.condition || '',
            status: doc.status || '',
            location: doc.location || '',
            source_url: doc.source_url || '',
            eligibility: doc.eligibility || '',
            known_side_effects: doc.known_side_effects || '',
            dsmc_presence: doc.dsmc_presence || '',
            enrollment_info: doc.enrollment_info || '',
            objective_summary: doc.objective_summary || '',
            external_notes: doc.external_notes || '',
            sponsor_info: doc.sponsor_info || '',
            patient_experiences: doc.patient_experiences || '',
            statistical_plan: doc.statistical_plan || '',
            intervention_arms: doc.intervention_arms || '',
            sample_size: doc.sample_size || '',
            pre_req_for_participation: doc.pre_req_for_participation || '',
            sponsor_contact: doc.sponsor_contact || '',
            location_and_site_details: doc.location_and_site_details || '',
            monitoring_frequency: doc.monitoring_frequency || '',
            safety_documents: doc.safety_documents || '',
            sites: doc.sites || '',
            patient_faq_summary: doc.patient_faq_summary || '',
            citations: doc.citations || '',
            matched_patients_count: doc.matched_patients_count || 0
          };

          const existingTrials = await superdev.entities.Trial.filter({ 
            trial_id: trialData.trial_id 
          });
          
          if (existingTrials.length === 0) {
            await superdev.entities.Trial.create(trialData);
          } else {
            await superdev.entities.Trial.update(existingTrials[0].id, trialData);
          }
          syncResults.trials++;
        }
      } catch (error) {
        console.log('No trial collection found or error syncing trials:', error.message);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Data sync completed successfully',
      results: syncResults,
      debug: {
        endpoint: workingEndpoint,
        databaseId,
        patientCollectionId
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Sync error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error',
      debug: {
        errorType: error.type || 'Unknown',
        stack: error.stack
      }
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});