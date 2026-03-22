export async function convertText({
  text,
  tone,
}: {
  text: string;
  tone: string;
}) {
  const prompt = `
You are a professional translator and tone editor.

Task:
1. Detect if the input is Sinhala or English.
2. Translate it to the other language.
3. Rewrite it in the selected tone.

Tone options:
- formal
- casual
- corporate

Rules:
- Keep meaning accurate
- Keep it natural (not robotic)
- For Sinhala, use proper native phrasing (not direct translation)

Input:
"${text}"

Output:
Only return the final converted text.
`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "arcee-ai/trinity-mini:free",
      messages: [
        {
          role: "user",
          content: `${prompt}\nTone: ${tone}`,
        },
      ],
    }),
  });

  const data = await res.json();
  console.log(data)

  return data.choices?.[0]?.message?.content || "Error generating response";
}