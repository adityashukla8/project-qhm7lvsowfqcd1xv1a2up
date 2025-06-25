import { createSuperdevClient } from 'npm:@superdevhq/client@0.1.51';

const superdev = createSuperdevClient({ 
  appId: Deno.env.get('SUPERDEV_APP_ID'), 
});

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
      // Search for specific patient
      const patients = await superdev.entities.Patient.filter({ patient_id: patientId });
      
      if (patients.length > 0) {
        return new Response(JSON.stringify({ 
          success: true, 
          patient: patients[0] 
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response(JSON.stringify({ 
          success: false, 
          message: "Patient not found" 
        }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      // Get all patients for statistics
      const patients = await superdev.entities.Patient.list();
      
      return new Response(JSON.stringify({ 
        success: true, 
        patients: patients 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error('Error fetching patients:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});