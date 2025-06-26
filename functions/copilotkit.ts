import { CopilotRuntime, GoogleGenerativeAIAdapter } from "npm:@copilotkit/runtime@1.9.1";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    console.log("CopilotKit runtime called with method:", req.method);
    console.log("Request URL:", req.url);
    
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      console.error("No Gemini API key found");
      return new Response("No Gemini key", { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        }
      });
    }

    const runtime = new CopilotRuntime();
    const adapter = new GoogleGenerativeAIAdapter({ 
      apiKey, 
      model: "gemini-1.5-flash" 
    });
    
    console.log("Processing CopilotKit request...");
    const response = await runtime.streamHttpServerResponse(req, adapter);
    
    // Add CORS headers to the response
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    return response;
  } catch (error) {
    console.error("CopilotKit runtime error:", error);
    return new Response(JSON.stringify({ error: "Runtime error", details: error.message }), { 
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      }
    });
  }
});