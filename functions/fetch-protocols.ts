Deno.serve(async (req) => {
  try {
    const baseUrl = 'https://clinicaltrials-multiagent-502131642989.asia-south1.run.app/search-protocols/all';
    
    console.log('Fetching protocols from:', baseUrl);
    
    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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