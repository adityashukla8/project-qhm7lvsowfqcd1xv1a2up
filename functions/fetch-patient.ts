Deno.serve(async (req) => {
  try {
    const { patientId } = await req.json()
    
    if (!patientId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Patient ID is required' 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    console.log('Fetching patient with ID:', patientId)
    
    // Fetch from your external API
    const response = await fetch(`https://clinicaltrials-multiagent-502131642989.asia-south1.run.app/patients/${patientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('External API Response status:', response.status)
    
    if (!response.ok) {
      if (response.status === 404) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Patient with ID ${patientId} not found` 
        }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        })
      }
      throw new Error(`External API request failed: ${response.status} ${response.statusText}`)
    }
    
    const patientData = await response.json()
    console.log('Patient data received:', patientData)
    
    // Return with 'patient' field to match frontend expectation
    return new Response(JSON.stringify({ 
      success: true, 
      patient: patientData
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
    
  } catch (error) {
    console.error('Error in fetch-patient function:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
})