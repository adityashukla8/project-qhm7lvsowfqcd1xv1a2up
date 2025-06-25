Deno.serve(async (req) => {
  try {
    console.log("fetchTrials function called");
    
    // Call the correct API endpoint
    const response = await fetch('https://api.example.com/all_trials', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      data: data
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error in fetchTrials:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});