Deno.serve(async (req) => {
  try {
    const baseUrl = 'https://clinicaltrials-multiagent-502131642989.asia-south1.run.app';
    
    const response = await fetch(`${baseUrl}/all_trials`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const trials = await response.json();
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: trials 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error fetching trials:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});