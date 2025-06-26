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

    const apiKey = Deno.env.get("APPWRITE_API_KEY");
    const projectId = Deno.env.get("APPWRITE_PROJECT_ID");
    const endpoint = Deno.env.get("APPWRITE_API_ENDPOINT");
    const databaseId = Deno.env.get("APPWRITE_DATABASE_ID");
    const trialsCollectionId = Deno.env.get("APPWRITE_TRIALS_INFO_COLLECTION_ID");

    if (!apiKey || !projectId || !endpoint || !databaseId || !trialsCollectionId) {
      console.error('Missing Appwrite configuration for trials');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing Appwrite configuration for trials' 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const baseUrl = `${endpoint}/databases/${databaseId}/collections/${trialsCollectionId}/documents`;
    
    console.log('Fetching all trials from:', baseUrl);
    
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
    console.log('Appwrite response for trials:', data);
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        trials: data.documents || []
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Error in fetchTrials:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});