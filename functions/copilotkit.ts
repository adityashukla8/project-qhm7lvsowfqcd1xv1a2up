import { CopilotRuntime, GoogleGenerativeAIAdapter } from "npm:@copilotkit/runtime@1.9.1";

Deno.serve(async (req) => {
  try {
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    const serviceAdapter = new GoogleGenerativeAIAdapter({
      apiKey: geminiApiKey,
      model: "gemini-1.5-flash",
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