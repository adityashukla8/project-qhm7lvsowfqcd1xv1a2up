import { createSuperdevClient } from 'npm:@superdevhq/client@0.1.51';

const superdev = createSuperdevClient({ 
  appId: Deno.env.get('SUPERDEV_APP_ID'), 
});

const BASE_URL = 'https://clinicaltrials-multiagent-502131642989.asia-south1.run.app';

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    superdev.auth.setToken(token);

    const { patientId } = await req.json();

    if (patientId) {
      // Fetch specific patient by ID
      const response = await fetch(`${BASE_URL}/patients/${patientId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch patient: ${response.status} ${response.statusText}`);
      }
      
      const patientData = await response.json();
      
      return new Response(JSON.stringify({
        success: true,
        patient: patientData
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Fetch all patients
      const response = await fetch(`${BASE_URL}/patients`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
      }
      
      const patientsData = await response.json();
      
      return new Response(JSON.stringify({
        success: true,
        patients: patientsData,
        total: Array.isArray(patientsData) ? patientsData.length : 0
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    console.error('Error fetching patients:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});