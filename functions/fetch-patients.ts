Deno.serve(async (req) => {
  try {
    console.log('Fetching patients from external API...')
    
    // Fetch from your external API
    const response = await fetch('https://clinicaltrials-multiagent-502131642989.asia-south1.run.app/patients', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('External API Response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`External API request failed: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('External API Response data structure:', typeof data, Array.isArray(data))
    
    // Handle different possible response structures
    let patientsArray = []
    if (Array.isArray(data)) {
      patientsArray = data
    } else if (data.patients && Array.isArray(data.patients)) {
      patientsArray = data.patients
    } else if (data.data && Array.isArray(data.data)) {
      patientsArray = data.data
    } else {
      console.error('Unexpected API response structure:', data)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Unexpected API response structure',
        data: null
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    console.log('Processed patients count:', patientsArray.length)
    
    return new Response(JSON.stringify({ 
      success: true, 
      patients: patientsArray,
      count: patientsArray.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
    
  } catch (error) {
    console.error('Error in fetch-patients function:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      patients: []
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
})