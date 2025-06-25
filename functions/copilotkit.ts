import { CopilotRuntime, GoogleGenerativeAIAdapter } from "npm:@copilotkit/runtime@1.9.1";

Deno.serve(async (req) => {
  try {
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    
    if (!geminiApiKey) {
      console.error("Gemini API key not found");
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Initializing CopilotKit runtime with Gemini");

    const serviceAdapter = new GoogleGenerativeAIAdapter({
      apiKey: geminiApiKey,
      model: "gemini-1.5-flash",
    });

    const runtime = new CopilotRuntime();

    const response = await runtime.streamHttpServerResponse(req, serviceAdapter);
    console.log("CopilotKit runtime response generated");
    
    return response;
  } catch (error) {
    console.error("CopilotKit runtime error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
});