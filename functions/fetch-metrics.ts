Deno.serve(async (req) => {
  try {
    console.log('Fetching metrics from API...')
    
    const response = await fetch('https://clinicaltrials-multiagent-502131642989.asia-south1.run.app/metrics')
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Metrics API Response:', data)
    
    return new Response(JSON.stringify({ 
      success: true, 
      metrics: data 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})