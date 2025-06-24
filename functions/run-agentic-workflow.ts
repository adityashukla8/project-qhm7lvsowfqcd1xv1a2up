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
    
    const user = await superdev.auth.me();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { patient_id, workflow_type } = await req.json();
    
    if (!patient_id || !workflow_type) {
      return new Response(JSON.stringify({ 
        error: 'Missing required parameters: patient_id and workflow_type' 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get patient data from AppWrite
    const patients = await superdev.entities.Patient.filter({ patient_id });
    if (patients.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Patient not found' 
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const patient = patients[0];

    // Call your Python agentic workflow API
    const pythonApiUrl = Deno.env.get("PYTHON_WORKFLOW_API_URL");
    const pythonApiKey = Deno.env.get("PYTHON_WORKFLOW_API_KEY");
    
    if (!pythonApiUrl) {
      return new Response(JSON.stringify({ 
        error: 'Python workflow API URL not configured' 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const workflowResponse = await fetch(`${pythonApiUrl}/run-workflow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pythonApiKey}`,
      },
      body: JSON.stringify({
        patient_data: patient,
        workflow_type: workflow_type,
        timestamp: new Date().toISOString()
      })
    });

    if (!workflowResponse.ok) {
      throw new Error(`Python API error: ${workflowResponse.status}`);
    }

    const workflowResult = await workflowResponse.json();

    // Update patient status in AppWrite
    await superdev.entities.Patient.update(patient.id, {
      status: 'processed',
      matched: workflowResult.matched || false,
      matched_trials_count: workflowResult.matched_trials_count || 0
    });

    // Store workflow results if provided
    if (workflowResult.trial_matches && workflowResult.trial_matches.length > 0) {
      for (const match of workflowResult.trial_matches) {
        await superdev.entities.TrialMatch.create({
          match_id: `${patient_id}_${match.trial_id}_${Date.now()}`,
          patient_id: patient_id,
          trial_id: match.trial_id,
          match_criteria: match.criteria || '',
          reason: match.reason || '',
          match_requirements: match.requirements || '',
          confidence_score: match.confidence_score || 0
        });
      }
    }

    // Store summary if provided
    if (workflowResult.summary) {
      await superdev.entities.Summary.create({
        summary_id: `${patient_id}_summary_${Date.now()}`,
        patient_id: patient_id,
        trial_id: workflowResult.summary.trial_id || '',
        content: workflowResult.summary.content || '',
        type: 'enriched_summary',
        confidence_score: workflowResult.summary.confidence_score || 0
      });
    }

    return new Response(JSON.stringify({
      success: true,
      workflow_id: workflowResult.workflow_id,
      status: workflowResult.status,
      message: 'Agentic workflow completed successfully',
      results: workflowResult
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Workflow error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});