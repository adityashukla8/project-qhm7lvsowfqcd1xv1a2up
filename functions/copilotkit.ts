import { CopilotRuntime, OpenAIAdapter } from "npm:@copilotkit/runtime@1.9.1";

Deno.serve(async (req) => {
  try {
    const copilotApiKey = Deno.env.get("COPILOTKIT_API");
    
    if (!copilotApiKey) {
      return new Response(
        JSON.stringify({ error: "CopilotKit API key not configured" }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    const serviceAdapter = new OpenAIAdapter({
      apiKey: copilotApiKey,
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