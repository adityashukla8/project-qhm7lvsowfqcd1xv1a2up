Deno.serve(async (req) => {
  try {
    const baseUrl = 'https://clinicaltrials-multiagent-502131642989.asia-south1.run.app/search-protocols';
    
    console.log('Fetching all protocol optimizations...');
    console.log('API URL:', baseUrl);
    
    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `HTTP error! status: ${response.status}` 
      }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log('Protocols API response:', data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error fetching protocols:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});