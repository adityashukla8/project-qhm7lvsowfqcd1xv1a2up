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

    // Initialize AppWrite client
    const client = new Client();
    
    const endpoint = Deno.env.get('APPWRITE_ENDPOINT') || 'https://cloud.appwrite.io/v1';
    const projectId = Deno.env.get('APPWRITE_PROJECT_ID');
    const apiKey = Deno.env.get('APPWRITE_API_KEY');
    const databaseId = Deno.env.get('APPWRITE_DATABASE_ID') || 'patient_info';
    const patientCollectionId = Deno.env.get('APPWRITE_COLLECTION_ID');
    
    if (!projectId || !apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required environment variables: APPWRITE_PROJECT_ID or APPWRITE_API_KEY'
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    client
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    // Set API key for server-side operations
    // client.headers['X-Appwrite-Key'] = apiKey;

    const databases = new Databases(client);

    const { collection } = await req.json();

    let syncResults = {
      patients: 0,
      trials: 0,
      matches: 0,
      summaries: 0,
      metrics: 0
    };

    // Sync Patients from your specific collection
    if (!collection || collection === 'patient_info_collection') {
      try {
        console.log(`Fetching patients from collection: ${patientCollectionId}`);
        
        const patientsResult = await databases.listDocuments(
          databaseId,
          patientCollectionId,
          [Query.limit(100)] // Fetch up to 100 patients at a time
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
          details: error.stack
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Sync Trials (keeping existing logic but with better error handling)
    if (!collection || collection === 'trial_info') {
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

          // Check if trial already exists
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

    // Sync Trial Matches (keeping existing logic but with better error handling)
    if (!collection || collection === 'match_info') {
      try {
        const matchesResult = await databases.listDocuments(
          databaseId,
          'match_info',
          [Query.limit(100)]
        );

        for (const doc of matchesResult.documents) {
          const matchData = {
            match_id: doc.match_id || doc.$id,
            patient_id: doc.patient_id || '',
            trial_id: doc.trial_id || '',
            match_criteria: doc.match_criteria || '',
            reason: doc.reason || '',
            match_requirements: doc.match_requirements || '',
            confidence_score: doc.confidence_score || 0
          };

          // Check if match already exists
          const existingMatches = await superdev.entities.TrialMatch.filter({ 
            patient_id: matchData.patient_id,
            trial_id: matchData.trial_id 
          });
          
          if (existingMatches.length === 0) {
            await superdev.entities.TrialMatch.create(matchData);
            syncResults.matches++;
          }
        }
      } catch (error) {
        console.log('No match collection found or error syncing matches:', error.message);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Data sync completed successfully',
      results: syncResults,
      collectionUsed: patientCollectionId
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Sync error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error',
      details: error.stack
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});