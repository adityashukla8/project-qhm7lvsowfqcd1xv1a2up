Deno.serve(async (req) => {
  try {
    console.log('Fetching trials from /all_trials endpoint...');
    
    const baseUrl = 'https://clinicaltrials-multiagent-502131642989.asia-south1.run.app';
    const endpoint = '/all_trials';
    const fullUrl = `${baseUrl}${endpoint}`;
    
    console.log('Making request to:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('API Response status:', response.status);
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const trials = await response.json();
    console.log('Successfully fetched trials count:', Array.isArray(trials) ? trials.length : 'Not an array');
    
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
    console.error('Error in fetch-trials function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: `API request failed: ${error.message}`
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    });
  }
});