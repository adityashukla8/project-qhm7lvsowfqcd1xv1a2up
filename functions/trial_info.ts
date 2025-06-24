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

    const apiUrl = "https://<your-cloud-run-url>/trial_info"; // Replace this

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // Add auth header if required by backend
      },
      body: JSON.stringify({ patient_id })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend returned error: ${errorText}`);
      return new Response(JSON.stringify({
        success: false,
        error: `Backend returned ${response.status}: ${response.statusText}`
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const result = await response.json();

    return new Response(JSON.stringify({
      success: true,
      trials: result.trials || []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("❌ Error in trial_info function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
