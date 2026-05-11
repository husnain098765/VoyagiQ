import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper function to pause execution (Used for backoff delay)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req) {
  try {
    const { location, interests, budget } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 1. Prompt Definition
    const prompt = `
Generate a JSON array of 8 famous travel destinations located in "${location}".
Format exactly like this example (NO extra text):

[
  {
    "name": "Rome",
    "country": "Italy",
    "shortDescription": "Ancient city with historic architecture.",
    "estimatedBudgetUSD": 1200,
    "imageSearchQuery": "Rome Italy city skyline"
  }
]

User interests: ${interests?.join(", ") || "general"}
Budget: ${budget || "medium"}

Return ONLY pure JSON. No explanation. No markdown. No extra text.
`;

    // 2.  UPDATED RETRY LOGIC IMPLEMENTATION
    let result;
    const MAX_RETRIES = 3;
    const INITIAL_DELAY_MS = 1000; // 1 second base delay

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            // Attempt to generate content
            result = await model.generateContent(prompt);
            break; // Success! Exit the loop.
        } catch (error) {
            // Check for 503 status OR a common connection failure message
            // 'fetch failed' errors often don't have a status property.
            const isRetryable = error.status === 503 || String(error).includes('fetch failed'); 

            if (isRetryable && attempt < MAX_RETRIES) {
                const delay = INITIAL_DELAY_MS * Math.pow(2, attempt - 1); // Exponential backoff (1s, 2s, 4s)
                console.log(`⚠️ Attempt ${attempt} failed (Service/Connection Error). Retrying in ${delay / 1000}s...`);
                await sleep(delay);
            } else {
                // Throw the error if max retries reached or if it's a non-retryable error (e.g., 400, 401, etc.)
                console.error(`❌ generate-destinations ERROR on final attempt ${attempt}:`, error);
                // Throw the error to be caught by the outer try-catch block
                throw error; 
            }
        }
    }
    
    // If we reach here without a successful result (shouldn't happen with the inner throw, but for safety)
    if (!result) {
        throw new Error("AI request failed after all retries.");
    }

    // 3. Process Response
    const text = (await result.response).text();

    let destinations = [];
    try {
      destinations = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json|```/g, "").trim();
      destinations = JSON.parse(cleaned);
    }

    // 4. Attach Picsum Images
    destinations = destinations.map((d, index) => ({
      ...d,
      // Picsum is used for reliable image loading
      image: `https://picsum.photos/800/600?random=${index + 1}`,
    }));

    return Response.json({ destinations }, { status: 200 });
  } catch (err) {
    // This catches the final error thrown after all retries or non-retryable errors.
    console.error("❌ generate-destinations FINAL CATCH ERROR:", err);
    return Response.json({ error: "Failed to generate destinations. Check API key or network status." }, { status: 500 });
  }
}