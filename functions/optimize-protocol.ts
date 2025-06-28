Deno.serve(async (req) => {
  try {
    const { trial_id } = await req.json();
    
    if (!trial_id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'trial_id is required' 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log('Optimizing protocol for trial:', trial_id);
    
    const response = await fetch('https://clinicaltrials-multiagent-502131642989.asia-south1.run.app/optimize-protocol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trial_id }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Protocol optimization response:', data);

    return new Response(JSON.stringify({ 
      success: true, 
      data 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error optimizing protocol:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});