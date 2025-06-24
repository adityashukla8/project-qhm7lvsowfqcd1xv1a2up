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
    
    const user = await superdev.auth.me();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { workflow_id } = await req.json();
    
    if (!workflow_id) {
      return new Response(JSON.stringify({ 
        error: 'Missing required parameter: workflow_id' 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Call your Python agentic workflow API to get status
    const pythonApiUrl = Deno.env.get("PYTHON_WORKFLOW_API_URL");
    const pythonApiKey = Deno.env.get("PYTHON_WORKFLOW_API_KEY");
    
    if (!pythonApiUrl) {
      return new Response(JSON.stringify({ 
        error: 'Python workflow API URL not configured' 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const statusResponse = await fetch(`${pythonApiUrl}/workflow-status/${workflow_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${pythonApiKey}`,
      }
    });

    if (!statusResponse.ok) {
      throw new Error(`Python API error: ${statusResponse.status}`);
    }

    const statusResult = await statusResponse.json();

    return new Response(JSON.stringify({
      success: true,
      workflow_id: workflow_id,
      status: statusResult.status,
      progress: statusResult.progress || 0,
      current_step: statusResult.current_step || '',
      results: statusResult.results || null
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Status check error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});