Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { trial_id } = body;
    
    if (!trial_id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'trial_id is required' 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const baseUrl = `https://clinicaltrials-multiagent-502131642989.asia-south1.run.app/search-protocols/${trial_id}`;
    
    console.log('Fetching protocol detail for:', trial_id);
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
    console.log('Protocol detail API response:', data);

    // The API already returns the data in the expected format with success and data fields
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error fetching protocol detail:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});