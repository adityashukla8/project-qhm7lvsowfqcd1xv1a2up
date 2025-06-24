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

    console.log(`🔍 Fetching trial info for patient: ${patient_id}`);

    const apiUrl = "https://clinicaltrials-multiagent-502131642989.asia-south1.run.app/trial_info";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ patient_id })
    });

    if (!response.ok) {
      console.error("❌ Backend /trial_info error:", await response.text());
      return new Response(JSON.stringify({
        success: false,
        error: `Failed to fetch from /trial_info: ${response.status} ${response.statusText}`
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify({
      success: true,
      trials: data.trials || []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("❌ Error in Superdev trial_info function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
