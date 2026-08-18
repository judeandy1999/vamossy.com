import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { openai } = await import("@/lib/openai");
    const { getMemory, setMemory } = await import("@/lib/memory");
    const { scoreLead, logEvent } = await import("@/lib/telemetry");
    const { agent, userId, sessionId, message } = await request.json();

    const validAgents = [
      "acquisition",
      "seo",
      "conversion",
      "retention",
      "analytics",
      "creative",
      "foresight",
    ];
    if (!validAgents.includes(agent)) {
      return Response.json({ error: "Invalid agent" }, { status: 400 });
    }

    if (!message || !userId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const promptPath = join(process.cwd(), "agents", "vamossy_unified.txt");
    const unifiedPrompt = readFileSync(promptPath, "utf-8");
    const systemPrompt = unifiedPrompt.replace(/<ACTIVE_AGENT>/g, agent);
    const conversationHistory = await getMemory(userId, agent);
    await setMemory(userId, agent, "user", message);

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages,
    });

    const assistantMessage = completion.choices[0]?.message?.content || "";

    if (!assistantMessage) {
      if (completion.choices[0]?.finish_reason === "length") {
        const retryCompletion = await openai.chat.completions.create({
          model: "gpt-5",
          messages: [{ role: "user", content: `Please provide a helpful response to: ${message}` }],
          max_completion_tokens: 1000,
        });
        const retryMessage =
          retryCompletion.choices[0]?.message?.content ||
          "I apologize, but I'm having trouble generating a response right now. Please try rephrasing your question.";
        await setMemory(userId, agent, "assistant", retryMessage);
        return Response.json({
          agent,
          message: retryMessage,
          leadScore: scoreLead(retryMessage),
        });
      }

      return Response.json(
        {
          error: "AI model returned empty response",
          debug: { finish_reason: completion.choices[0]?.finish_reason },
        },
        { status: 500 }
      );
    }

    await setMemory(userId, agent, "assistant", assistantMessage);
    const leadScore = scoreLead(assistantMessage);
    await logEvent({
      userId,
      sessionId,
      agent,
      input: message,
      output: assistantMessage,
      leadScore,
      version: "Vamossy-Agents-1.0.0",
    });

    return Response.json({
      agent,
      message: assistantMessage,
      leadScore,
    });
  } catch (error) {
    console.error("Agent API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
