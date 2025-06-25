import { CopilotRuntime, OpenAIAdapter } from "@copilotkit/runtime";

Deno.serve(async (req) => {
  try {
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    const serviceAdapter = new OpenAIAdapter({
      apiKey: openaiApiKey,
      model: "gpt-4o-mini",
    });

    const runtime = new CopilotRuntime();

    return runtime.streamHttpServerResponse(req, serviceAdapter);
  } catch (error) {
    console.error("CopilotKit runtime error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
});