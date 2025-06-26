import { createSuperdevClient } from 'npm:@superdevhq/client@0.1.51';

const superdev = createSuperdevClient({ 
  appId: Deno.env.get('SUPERDEV_APP_ID'), 
});

Deno.serve(async (req) => {
  try {
    // Get authorization header from request
    // const authHeader = req.headers.get('Authorization');
    // if (!authHeader) {
    //   return new Response('Unauthorized', { status: 401 });
    // }
    
    // // Extract token and set it for superdev client
    // const token = authHeader.split(' ')[1];
    // superdev.auth.setToken(token);
    
    // // Verify user is authenticated
    // const user = await superdev.auth.me();
    // if (!user) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    const { patientId } = await req.json();
    
    const apiKey = Deno.env.get("APPWRITE_API_KEY");
    const projectId = Deno.env.get("APPWRITE_PROJECT_ID");
    const endpoint = Deno.env.get("APPWRITE_API_ENDPOINT");
    const databaseId = Deno.env.get("APPWRITE_DATABASE_ID");
    const collectionId = Deno.env.get("APPWRITE_COLLECTION_ID");

    if (!apiKey || !projectId || !endpoint || !databaseId || !collectionId) {
      console.error('Missing Appwrite configuration');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing Appwrite configuration' 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const baseUrl = `${endpoint}/databases/${databaseId}/collections/${collectionId}/documents`;
    
    if (patientId) {
      // Search for specific patient
      const searchUrl = `${baseUrl}?queries[]=equal("patient_id","${patientId}")`;
      console.log('Fetching patient with ID:', patientId);
      console.log('Search URL:', searchUrl);
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'X-Appwrite-Project': projectId,
          'X-Appwrite-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Appwrite API error:', response.status, response.statusText);
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Appwrite API error: ${response.status}` 
        }), {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        });
      }

      const data = await response.json();
      console.log('Appwrite response:', data);
      
      if (data.documents && data.documents.length > 0) {
        const patient = data.documents[0];
        return new Response(JSON.stringify({ 
          success: true, 
          patient: patient 
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } else {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Patient not found' 
        }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
    } else {
      // Get all patients
      console.log('Fetching all patients');
      
      const response = await fetch(baseUrl, {
        method: 'GET',
        headers: {
          'X-Appwrite-Project': projectId,
          'X-Appwrite-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Appwrite API error:', response.status, response.statusText);
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Appwrite API error: ${response.status}` 
        }), {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        });
      }

      const data = await response.json();
      console.log('Appwrite response for all patients:', data);
      
      return new Response(JSON.stringify({ 
        success: true, 
        patients: data.documents || [] 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error('Error in fetchPatients:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});