Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { patient_id } = body;

    if (!patient_id) {
      return new Response(JSON.stringify({
        success: false,
        error: "Patient ID is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log(`Fetching trial info for patient: ${patient_id}`);

    // Call external API to get actual trial information
    const apiUrl = `https://clinicaltrialsapi.cancer.gov/api/v2/trials?patient_id=${patient_id}`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('External API response:', data);

      // Transform the API response to match our expected format
      const trials = data.trials?.map((trial: any) => ({
        trial_id: trial.nct_id || trial.trial_id,
        match_criteria: trial.match_criteria || "match",
        reason: trial.reason || trial.match_reason || "Meets eligibility criteria",
        match_requirements: trial.match_requirements || trial.eligibility_summary || "Standard eligibility criteria",
        title: trial.brief_title || trial.title,
        phase: trial.phase?.phase || trial.phase || "Not specified",
        condition: trial.diseases?.[0]?.name || trial.condition || "Not specified",
        status: trial.current_trial_status || trial.status || "Unknown",
        location: trial.sites?.[0]?.org_name || trial.location || "Multiple locations",
        eligibility: trial.eligibility?.structured?.gender || trial.eligibility_criteria || "See full criteria",
        source_url: `https://clinicaltrials.gov/show/${trial.nct_id || trial.trial_id}`
      })) || [];

      return new Response(JSON.stringify({
        success: true,
        trials: trials
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });

    } catch (apiError) {
      console.error("External API error:", apiError);
      
      // Fallback: Return empty results instead of mock data
      return new Response(JSON.stringify({
        success: true,
        trials: [],
        message: "No trials found or API temporarily unavailable"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

  } catch (error) {
    console.error("Error in trial_info function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});