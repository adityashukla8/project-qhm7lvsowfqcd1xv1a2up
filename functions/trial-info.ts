Deno.serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const { patient_id } = body;
    const baseUrl = "https://clinicaltrials-multiagent-502131642989.asia-south1.run.app";
    
    console.log('Getting trial info for patient:', { patient_id });
    
    if (!patient_id || !patient_id.trim()) {
      return new Response(JSON.stringify({
        success: false,
        error: "Patient ID is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Call the /trial_info endpoint
    console.log(`Calling /trial_info endpoint for patient: ${patient_id}`);
    const response = await fetch(`${baseUrl}/trial_info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ patient_id: patient_id.trim() })
    });
    
    if (!response.ok) {
      console.error(`Failed to get trial info: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      return new Response(JSON.stringify({
        success: false,
        error: `Failed to get trial info: ${response.status} ${response.statusText}`,
        details: errorText
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const trialResults = await response.json();
    console.log('Trial info results received:', trialResults);
    
    // Ensure we return the trials in the expected format
    return new Response(JSON.stringify({
      success: true,
      trials: trialResults.trials || trialResults || []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error('Error in trial-info function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});