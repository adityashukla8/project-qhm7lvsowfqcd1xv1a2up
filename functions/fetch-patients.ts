Deno.serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const { patientId } = body;
    const baseUrl = "https://clinicaltrials-multiagent-502131642989.asia-south1.run.app";
    
    console.log('Fetching patient data...', { patientId, hasPatientId: !!patientId });
    
    if (patientId && patientId.trim()) {
      // Fetch specific patient by ID
      console.log(`Fetching patient with ID: ${patientId}`);
      const response = await fetch(`${baseUrl}/patients/${patientId}`);
      
      if (!response.ok) {
        console.error(`Failed to fetch patient ${patientId}: ${response.status} ${response.statusText}`);
        return new Response(JSON.stringify({
          success: false,
          error: `Failed to fetch patient: ${response.status} ${response.statusText}`
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      const patient = await response.json();
      console.log('Patient data received:', patient);
      
      return new Response(JSON.stringify({
        success: true,
        patient: patient
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      // Fetch all patients
      console.log('Fetching all patients from /patients endpoint...');
      const response = await fetch(`${baseUrl}/patients`);
      
      if (!response.ok) {
        console.error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
        return new Response(JSON.stringify({
          success: false,
          error: `Failed to fetch patients: ${response.status} ${response.statusText}`
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      const patients = await response.json();
      console.log('All patients data received:', patients);
      
      return new Response(JSON.stringify({
        success: true,
        patients: Array.isArray(patients) ? patients : []
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error('Error in fetch-patients function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});