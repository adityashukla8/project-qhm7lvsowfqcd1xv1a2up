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
    
    const rawPatientData = await response.json()
    console.log('Raw patient data received:', rawPatientData)
    
    // Transform the data to match the expected format
    const patientData = {
      id: rawPatientData.$id || rawPatientData.patient_id,
      patient_id: rawPatientData.patient_id,
      patient_name: rawPatientData.patient_name,
      condition: rawPatientData.condition,
      chemotherapy: Array.isArray(rawPatientData.chemotherapy) ? rawPatientData.chemotherapy : [rawPatientData.chemotherapy],
      radiotherapy: Array.isArray(rawPatientData.radiotherapy) ? rawPatientData.radiotherapy : [rawPatientData.radiotherapy],
      age: rawPatientData.age,
      gender: Array.isArray(rawPatientData.gender) ? rawPatientData.gender : [rawPatientData.gender],
      country: rawPatientData.country,
      metastasis: Array.isArray(rawPatientData.metastasis) ? rawPatientData.metastasis : [rawPatientData.metastasis],
      histology: rawPatientData.histology,
      biomarker: rawPatientData.biomarker,
      ecog_score: rawPatientData.ecog_score,
      condition_recurrence: Array.isArray(rawPatientData.condition_recurrence) ? rawPatientData.condition_recurrence : [rawPatientData.condition_recurrence],
      status: rawPatientData.status || 'active',
      matched: rawPatientData.matched || false,
      matched_trials_count: rawPatientData.matched_trials_count || 0
    }
    
    console.log('Transformed patient data:', patientData)
    
    return new Response(JSON.stringify({ 
      success: true, 
      patient: patientData
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
    
  } catch (error) {
    console.error('Error in fetch-patients function:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
})