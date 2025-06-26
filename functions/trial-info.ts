import { createSuperdevClient } from 'npm:@superdevhq/client@0.1.51';

const superdev = createSuperdevClient({ 
  appId: Deno.env.get('SUPERDEV_APP_ID'), 
});

Deno.serve(async (req) => {
  try {
    // Get authorization header from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    // Extract token and set it for superdev client
    const token = authHeader.split(' ')[1];
    superdev.auth.setToken(token);
    
    // Verify user is authenticated
    const user = await superdev.auth.me();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { patient_id, trial_id } = await req.json();
    
    const apiKey = Deno.env.get("APPWRITE_API_KEY");
    const projectId = Deno.env.get("APPWRITE_PROJECT_ID");
    const endpoint = Deno.env.get("APPWRITE_API_ENDPOINT");
    const databaseId = Deno.env.get("APPWRITE_DATABASE_ID");
    const matchCollectionId = Deno.env.get("APPWRITE_MATCH_COLLECTION_ID");
    const trialsCollectionId = Deno.env.get("APPWRITE_TRIALS_INFO_COLLECTION_ID");

    if (!apiKey || !projectId || !endpoint || !databaseId) {
      console.error('Missing Appwrite configuration');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing Appwrite configuration' 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (patient_id) {
      // Get trial matches for a specific patient
      const matchUrl = `${endpoint}/databases/${databaseId}/collections/${matchCollectionId}/documents?queries[]=equal("patient_id","${patient_id}")`;
      
      console.log('Fetching trial matches for patient:', patient_id);
      
      const matchResponse = await fetch(matchUrl, {
        method: 'GET',
        headers: {
          'X-Appwrite-Project': projectId,
          'X-Appwrite-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!matchResponse.ok) {
        console.error('Appwrite API error for matches:', matchResponse.status);
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Appwrite API error: ${matchResponse.status}` 
        }), {
          status: matchResponse.status,
          headers: { "Content-Type": "application/json" }
        });
      }

      const matchData = await matchResponse.json();
      console.log('Match data:', matchData);
      
      if (matchData.documents && matchData.documents.length > 0) {
        // Get detailed trial information for each match
        const trialPromises = matchData.documents.map(async (match) => {
          const trialUrl = `${endpoint}/databases/${databaseId}/collections/${trialsCollectionId}/documents?queries[]=equal("trial_id","${match.trial_id}")`;
          
          const trialResponse = await fetch(trialUrl, {
            method: 'GET',
            headers: {
              'X-Appwrite-Project': projectId,
              'X-Appwrite-Key': apiKey,
              'Content-Type': 'application/json'
            }
          });

          if (trialResponse.ok) {
            const trialData = await trialResponse.json();
            if (trialData.documents && trialData.documents.length > 0) {
              const trial = trialData.documents[0];
              return {
                trial_id: match.trial_id,
                match_criteria: match.match_criteria || 'match',
                reason: match.reason || 'Criteria matched',
                match_requirements: match.match_requirements || 'Standard eligibility criteria met',
                title: trial.title || 'Untitled Trial',
                phase: trial.phase || 'Unknown',
                condition: trial.condition || 'Not specified',
                status: trial.status || 'Unknown',
                location: trial.location || 'Not specified',
                eligibility: trial.eligibility || 'Not available',
                source_url: trial.source_url || ''
              };
            }
          }
          return null;
        });

        const trials = (await Promise.all(trialPromises)).filter(trial => trial !== null);
        
        return new Response(JSON.stringify({ 
          success: true, 
          trials: trials
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } else {
        return new Response(JSON.stringify({ 
          success: true, 
          trials: []
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    } else if (trial_id) {
      // Get specific trial information
      const trialUrl = `${endpoint}/databases/${databaseId}/collections/${trialsCollectionId}/documents?queries[]=equal("trial_id","${trial_id}")`;
      
      console.log('Fetching trial info for:', trial_id);
      
      const response = await fetch(trialUrl, {
        method: 'GET',
        headers: {
          'X-Appwrite-Project': projectId,
          'X-Appwrite-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Appwrite API error:', response.status);
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Appwrite API error: ${response.status}` 
        }), {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        });
      }

      const data = await response.json();
      
      if (data.documents && data.documents.length > 0) {
        return new Response(JSON.stringify({ 
          success: true, 
          trial_info: data.documents[0]
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } else {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Trial not found' 
        }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Either patient_id or trial_id is required' 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error('Error in trialInfo:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});