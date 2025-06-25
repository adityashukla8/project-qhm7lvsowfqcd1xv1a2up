import { CopilotRuntime, GoogleGenerativeAIAdapter } from "npm:@copilotkit/runtime@1.9.1";

Deno.serve(async (req) => {
  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response("No Gemini key", { status: 500 });
    }

    const runtime = new CopilotRuntime();
    const adapter = new GoogleGenerativeAIAdapter({ 
      apiKey, 
      model: "gemini-1.5-flash" 
    });
    
    return await runtime.streamHttpServerResponse(req, adapter);
  } catch (error) {
    console.error("CopilotKit runtime error:", error);
    return new Response("Runtime error", { status: 500 });
  }
});