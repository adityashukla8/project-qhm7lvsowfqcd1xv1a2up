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

    const { patient_id } = await req.json();
    
    if (!patient_id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Patient ID is required' 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Here you would implement the actual trial matching logic
    // For now, we'll return a success response to indicate the matching process started
    console.log('Starting trial matching for patient:', patient_id);
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Trial matching completed',
      patient_id: patient_id
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Error in matchTrials:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});