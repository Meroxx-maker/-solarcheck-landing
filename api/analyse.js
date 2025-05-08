export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { inputText } = req.body;

  if (!inputText) {
    return res.status(400).json({ error: 'Texte manquant' });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en photovoltaïque. Analyse les devis pour détecter les erreurs ou incohérences techniques et financières."
        },
        { role: "user", content: inputText }
      ],
      temperature: 0.4
    })
  });

  const data = await response.json();
  res.status(200).json({ result: data.choices?.[0]?.message?.content || "Pas de réponse." });
}
