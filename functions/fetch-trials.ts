Deno.serve(async (req) => {
  try {
    console.log('Fetching trials from external API...')
    
    // Fetch from your external API
    const response = await fetch('https://clinicaltrials-multiagent-502131642989.asia-south1.run.app/all_trials', {
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
    let trialsArray = []
    if (Array.isArray(data)) {
      trialsArray = data
    } else if (data.trials && Array.isArray(data.trials)) {
      trialsArray = data.trials
    } else if (data.data && Array.isArray(data.data)) {
      trialsArray = data.data
    } else {
      console.error('Unexpected API response structure:', data)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Unexpected API response structure'
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    console.log('Processed trials count:', trialsArray.length)
    
    // Return in the format expected by the UI
    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        trials: trialsArray
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
    
  } catch (error) {
    console.error('Error in fetch-trials function:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
})