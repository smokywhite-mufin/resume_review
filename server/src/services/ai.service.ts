import { Messages } from "../types";

export const callGroq = async (
  messages: Messages[],
  temperature: number = 0
) => {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: temperature,
        response_format: { type: "json_object" },
      }),
    }
  );

  const result = await response.json();
  return result.choices[0].message.content;
};
