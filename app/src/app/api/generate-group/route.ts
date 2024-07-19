import OpenAI from 'openai';

const inputTokensPrice = 0.000150 / 1000;
const outputTokensPrice = 0.000600 / 1000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Utilisation de la clé API en variable d'environnement
});

const promptSystem = `Tu es responsable pédagogique d'un cours de formation sur la blockchain Solana. Tu as une liste de 30 utilisateurs avec leurs compétences, leurs intérêts et leur niveau d'engagement. Ta mission est de créer des groupes de 3 personnes en respectant les critères suivants :

1. Priorité aux compétences (diversité des compétences dans chaque groupe).
2. Intérêts similaires.
3. Engagement similaire (les niveaux d'engagement doivent être proches).

Utilise les informations fournies pour former des groupes de 3 personnes en respectant les critères ci-dessus. Assure-toi que chaque groupe ait une moyenne d'engagement similaire. Retourne le résultat en format JSON avec les informations suivantes pour chaque groupe :
- "members" : une liste des utilisateurs avec leurs noms d'utilisateur, compétence principale (la plus pertinente pour le groupe), engagement et intérêts
- "average_commitment" : la moyenne des engagements des membres du groupe
- "common_interest" : les intérêts communs des membres du groupe

Voici un exemple de sortie attendue :

{
  "group_1": {
    "members": [
      {"user_name": "User1", "skills": "skill 2", "commitment": 3, "interest": "DeFi, NFT"},
      {"user_name": "User9", "skills": "skill 6", "commitment": 4, "interest": "Lending, DeFi"},
      {"user_name": "User3", "skills": "skill 1", "commitment": 2, "interest": "Lending, DeFi"}
    ],
    "average_commitment": 3,
    "common_interest": "DeFi, Lending"
},
"group_2": {
    "members": [
      {"user_name": "User4", "skills": "skill 4", "commitment": 4, "interest": "DeFi"},
      {"user_name": "User5", "skills": "skill 1", "commitment": 1, "interest": "Music, sport"},
      {"user_name": "User20", "skills": "skill 3", "commitment": 5, "interest": "Lending, DeFi"}
    ],
    "average_commitment": 3.33,
    "common_interest": "Blockchain Technology, Sport"
  },
  ...
}

Fournis la liste des utilisateurs pour que je puisse former les groupes.`

export async function openaiGenerateGroups(prompt: string) {

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: promptSystem,
      },
      { role: "user", content: prompt },
    ],
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
  });

  if (completion.usage) {
    console.log("input tokens", completion.usage?.prompt_tokens);
    console.log("output tokens", completion.usage?.completion_tokens);
    console.log("total tokens", completion.usage?.total_tokens);

    const inputPrice = completion.usage?.prompt_tokens! * inputTokensPrice;
    const outputPrice = completion.usage?.completion_tokens! * outputTokensPrice;
    const totalPrice = inputPrice + outputPrice;

    console.log("input tokens price", inputPrice);
    console.log("output tokens price", outputPrice);
    console.log("total tokens price", totalPrice);
  }

  return completion.choices[0].message.content;
}


export async function POST(request: Request) {

  try {
    const { prompt } = await request.json();
    const completion = await openaiGenerateGroups(prompt);
    return Response.json({ message: completion });
  } catch (error) {
    return Response.json({ message: "Error" });
  }
}