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

    const { trial_id } = await req.json();

    if (!trial_id) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Trial ID is required" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const trials = await superdev.entities.Trial.filter({ trial_id: trial_id });
    
    if (trials.length > 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        trial_info: trials[0] 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Trial not found" 
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error('Error fetching trial info:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});