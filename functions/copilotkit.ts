export default async function handler(req: Request): Promise<Response> {
  const body = await req.json();

  const messages = body.messages.map((m: any) => {
    if (m.role === "function") return null; // Gemini doesn't support `function` role
    return { role: m.role, parts: [{ text: m.content }] };
  }).filter(Boolean);

  const geminiBody = {
    contents: messages,
    tools: body.functions ? [{
      functionDeclarations: body.functions.map((fn: any) => ({
        name: fn.name,
        description: fn.description,
        parameters: fn.parameters,
      })),
    }] : [],
    generationConfig: {
      temperature: 0.7,
      topP: 1,
      maxOutputTokens: 1024,
    }
  };

  const geminiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + process.env.GEMINI_API_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(geminiBody)
  });

  const data = await geminiRes.json();

  if (!data.candidates?.length) {
    return new Response(JSON.stringify({ error: "No candidates returned by Gemini", raw: data }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  const result = data.candidates[0].content.parts.map((p: any) => p.text).join("");

  return new Response(JSON.stringify({
    id: "chatcmpl-gemini",
    object: "chat.completion",
    choices: [{
      index: 0,
      message: {
        role: "assistant",
        content: result
      },
      finish_reason: "stop"
    }],
    usage: {} // Gemini doesn't return tokens used
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
