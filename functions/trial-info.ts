Deno.serve(async (req) => {
  try {
    const { patient_id } = await req.json()
    
    if (!patient_id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Patient ID is required' 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    console.log('Calling trial_info API for patient:', patient_id)
    
    // Call your external trial_info API
    const response = await fetch('https://clinicaltrials-multiagent-502131642989.asia-south1.run.app/trial_info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ patient_id })
    })
    
    console.log('Trial_info API Response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`Trial_info API request failed: ${response.status} ${response.statusText}`)
    }
    
    const responseData = await response.json()
    console.log('Trial_info API response:', responseData)
    
    return new Response(JSON.stringify({ 
      success: true, 
      trials: responseData.trials || responseData
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
    
  } catch (error) {
    console.error('Error in trial-info function:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
})