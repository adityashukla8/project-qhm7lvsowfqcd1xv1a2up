Deno.serve(async (req) => {
  try {
    console.log('Fetching trials from external API...');
    
    const baseUrl = 'https://clinicaltrials-multiagent-502131642989.asia-south1.run.app';
    
    const response = await fetch(`${baseUrl}/all_trials`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const trials = await response.json();
    console.log('Successfully fetched trials:', trials.length || 'unknown count');
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: trials 
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
    });
  } catch (error) {
    console.error('Error fetching trials:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Unknown error occurred'
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    });
  }
});