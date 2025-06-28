Deno.serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const { patient_id } = body;
    const baseUrl = "https://clinicaltrials-multiagent-502131642989.asia-south1.run.app";
    
    console.log('Starting match trials for patient:', { patient_id });
    
    if (!patient_id || !patient_id.trim()) {
      return new Response(JSON.stringify({
        success: false,
        error: "Patient ID is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Call the /matchtrials endpoint
    console.log(`Calling /matchtrials endpoint for patient: ${patient_id}`);
    const response = await fetch(`${baseUrl}/matchtrials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ patient_id: patient_id.trim() })
    });
    
    if (!response.ok) {
      console.error(`Failed to match trials: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      return new Response(JSON.stringify({
        success: false,
        error: `Failed to match trials: ${response.status} ${response.statusText}`,
        details: errorText
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const matchResults = await response.json();
    console.log('Match trials results received:', matchResults);
    
    return new Response(JSON.stringify({
      success: true,
      message: "Trials matched successfully",
      data: matchResults
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error('Error in match-trials function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});