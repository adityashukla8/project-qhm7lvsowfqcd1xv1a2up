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

    // Mock trial data for demonstration - replace with actual API call
    const mockTrials = [
      {
        trial_id: "NCT05813126",
        match_criteria: "match",
        reason: "Eligible due to ECOG 0 and age >= 18",
        match_requirements: "Biomarker: ALK positive",
        title: "Trial of ALK inhibitor in Lung Cancer",
        phase: "Phase 2",
        condition: "Lung Cancer",
        status: "Recruiting",
        location: "USA",
        eligibility: "Adults, ECOG 0-2",
        source_url: "https://clinicaltrials.gov/show/NCT05813126"
      },
      {
        trial_id: "NCT04567890",
        match_criteria: "partial match",
        reason: "Age criteria met but biomarker status unclear",
        match_requirements: "Age >= 18, ECOG 0-1",
        title: "Immunotherapy Trial for Advanced Cancer",
        phase: "Phase 3",
        condition: "Advanced Cancer",
        status: "Active",
        location: "Europe",
        eligibility: "Adults 18+, ECOG 0-1",
        source_url: "https://clinicaltrials.gov/show/NCT04567890"
      }
    ];

    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return new Response(JSON.stringify({
      success: true,
      trials: mockTrials
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error in trial-info function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});