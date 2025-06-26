Deno.serve(async (req) => {
  try {
    console.log('Fetching trials from /all_trials endpoint...');
    
    const baseUrl = 'https://clinicaltrials-multiagent-502131642989.asia-south1.run.app';
    const endpoint = '/all_trials';
    const fullUrl = `${baseUrl}${endpoint}`;
    
    console.log('Making request to:', fullUrl);
    
    // Try to fetch from the external API first
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      console.log('API Response status:', response.status);

      if (response.ok) {
        const trials = await response.json();
        console.log('Successfully fetched trials count:', Array.isArray(trials) ? trials.length : 'Not an array');
        
        return new Response(JSON.stringify({ 
          success: true, 
          data: trials 
        }), {
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
          },
        });
      } else {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
    } catch (apiError) {
      console.warn('External API failed, using fallback data:', apiError.message);
      
      // Fallback mock data when external API fails
      const mockTrials = [
        {
          trial_id: "NCT12345678",
          title: "Phase II Study of Novel Cancer Treatment",
          official_title: "A Phase II, Randomized, Double-Blind, Placebo-Controlled Study of Novel Treatment in Patients with Advanced Cancer",
          phase: "Phase 2",
          condition: "Advanced Cancer",
          status: "recruiting",
          location: "Multiple Sites",
          source_url: "https://clinicaltrials.gov/ct2/show/NCT12345678",
          eligibility: "Inclusion Criteria: Age 18-75 years; Confirmed diagnosis of advanced cancer; ECOG performance status 0-2; Adequate organ function. Exclusion Criteria: Previous treatment with similar agents; Pregnancy; Severe comorbidities.",
          known_side_effects: "Common side effects may include fatigue, nausea, decreased appetite, and mild skin reactions.",
          enrollment_info: "Currently recruiting participants. Target enrollment: 150 patients.",
          objective_summary: "To evaluate the efficacy and safety of the novel treatment in patients with advanced cancer.",
          sites: "Memorial Sloan Kettering Cancer Center, MD Anderson Cancer Center, Johns Hopkins Hospital",
          matched_patients_count: 12
        },
        {
          trial_id: "NCT87654321",
          title: "Phase I Dose Escalation Study",
          official_title: "A Phase I, Open-Label, Dose-Escalation Study to Evaluate Safety and Tolerability",
          phase: "Phase 1",
          condition: "Solid Tumors",
          status: "active",
          location: "United States",
          source_url: "https://clinicaltrials.gov/ct2/show/NCT87654321",
          eligibility: "Inclusion Criteria: Age 21+ years; Histologically confirmed solid tumor; Life expectancy >3 months. Exclusion Criteria: Brain metastases; Recent major surgery; Concurrent chemotherapy.",
          known_side_effects: "Potential side effects include fatigue, gastrointestinal symptoms, and laboratory abnormalities.",
          enrollment_info: "Actively enrolling. Target enrollment: 30 patients.",
          objective_summary: "To determine the maximum tolerated dose and recommended phase II dose.",
          sites: "Dana-Farber Cancer Institute, University of California San Francisco",
          matched_patients_count: 8
        },
        {
          trial_id: "NCT11223344",
          title: "Phase III Comparative Effectiveness Study",
          official_title: "A Phase III, Randomized, Controlled Trial Comparing Standard Care vs. Experimental Treatment",
          phase: "Phase 3",
          condition: "Breast Cancer",
          status: "recruiting",
          location: "International",
          source_url: "https://clinicaltrials.gov/ct2/show/NCT11223344",
          eligibility: "Inclusion Criteria: Women age 18-70; HER2-positive breast cancer; No prior treatment for metastatic disease. Exclusion Criteria: Cardiac dysfunction; Previous anthracycline therapy; Pregnancy.",
          known_side_effects: "May include cardiac toxicity, neuropathy, hair loss, and increased infection risk.",
          enrollment_info: "Recruiting globally. Target enrollment: 500 patients.",
          objective_summary: "To compare overall survival between standard care and experimental treatment.",
          sites: "Multiple international sites including US, Europe, and Asia",
          matched_patients_count: 25
        }
      ];

      return new Response(JSON.stringify({ 
        success: true, 
        data: mockTrials,
        fallback: true,
        message: "Using fallback data due to external API unavailability"
      }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        },
      });
    }
  } catch (error) {
    console.error('Error in fetch-trials function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: `API request failed: ${error.message}`
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    });
  }
});