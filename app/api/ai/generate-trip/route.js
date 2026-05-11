// /app/api/ai/generate-trip/route.js

import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge"; 

// Helper function to pause execution (Used for backoff delay)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function: Picsum URL Generator (Confirmed Image Size Logic for Main Image)
const getImageUrl = (query) => {
    // Agar query mein 'city view' hai, to bada size (1200x800) use karo, warna chhota (800x600).
    const width = query.includes('city view') ? 1200 : 800; 
    const height = query.includes('city view') ? 800 : 600; 
    
    // Picsum ka seed use kar rahe hain taaki har query ke liye different image mile.
    const seed = `${query}-${Math.floor(Math.random() * 99999)}`.replace(/\s/g, '_');
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
};

export async function POST(req) {
    // 1. Setup & Validation
    const { destination, budget, interests, members, date } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!destination || !budget || !members) {
        return Response.json(
            { error: "❌ Missing required travel parameters (destination, budget, or members)." },
            { status: 400 }
        );
    }
    if (!apiKey) {
        console.error("Missing GEMINI_API_KEY");
        return Response.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

    // 2. Prompt for JSON Generation (Hotels count is 8)
    const prompt = `
You are a **Professional Travel Planner** generating a detailed **3-Day Trip Plan** in **PURE JSON format**.

User Request:
- Destination: ${destination}
- Budget: ${budget} USD
- Travelers: ${members} people
- Interests: ${Array.isArray(interests) && interests.length ? interests.join(", ") : "general"}
- Date: ${date || "Flexible"}

**Crucial Output Instructions:**
1.  **Return ONLY a single JSON object** that strictly adheres to the TripSchema structure provided below.
2.  **Coordinate** keys must be valid floating point numbers (latitude and longitude).
3.  Every item (Hotels, Attractions) MUST include an **imageSearchQuery** for fetching a relevant image.
4.  **Important: The 'hotels' array must contain exactly 8 distinct hotel recommendations.**
5.  **Cost Rule: None of the 'costUSD' values (activities, transportation) should be 0. Use a realistic positive number.**

TripSchema:
{
  "destination": "string",
  "coordinates": { "lat": number, "lng": number },
  "summary": "string (A brief, engaging summary of the trip)",
  "estimatedTotalBudgetUSD": number (Total 3-day cost estimate),
  "hotels": [
    // Array must contain EXACTLY 8 hotels
    {
      "name": "string (Hotel name)",
      "type": "string (Luxury/Mid-range/Budget)",
      "priceRangeUSD": "string ($100-$150)",
      "imageSearchQuery": "string (e.g., Best western Rome exterior pool)"
    }
  ],
  "dailyPlan": [
    {
      "day": "string (e.g., Day 1: Arrival and City Center)",
      "activities": [
        {
          "time": "string (e.g., 9:00 AM)",
          "description": "string (Detailed activity/attraction)",
          "costUSD": number (MUST be greater than 0),
          "imageSearchQuery": "string (e.g., Eiffel Tower main view)"
        }
      ],
      "dailyBudgetUSD": number
    }
    // Repeat for Day 2 and Day 3
  ],
  "transportation": {
    "summary": "string (Brief advice on local travel)",
    "costEstimateUSD": number (3-day transportation cost, MUST be greater than 0)
  },
  "travelTips": ["string", "string", "string"]
}
`;

    // 3. RETRY LOGIC IMPLEMENTATION (Unchanged)
    let result;
    const MAX_RETRIES = 3;
    const INITIAL_DELAY_MS = 1000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            result = await model.generateContent(prompt);
            break; // Success! Exit the loop.
        } catch (error) {
            const isRetryable = error.status === 503 || String(error).includes('fetch failed'); 

            if (isRetryable && attempt < MAX_RETRIES) {
                const delay = INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
                console.log(`⚠️ Trip attempt ${attempt} failed (Retryable Error). Retrying in ${delay / 1000}s...`);
                await sleep(delay);
            } else {
                console.error(`❌ AI_GENERATE_TRIP_ERROR on final attempt ${attempt}:`, error);
                return Response.json(
                    { success: false, error: "Failed to generate trip itinerary after multiple retries." },
                    { status: 500 }
                );
            }
        }
    }

    if (!result) {
        return Response.json({ success: false, error: "AI request failed after all retries." }, { status: 500 });
    }

    // 4. Process and Attach Images
    let jsonText = (await result.response.text()).trim();
    let itineraryData = null;

    try {
        // Robust JSON parsing (removing markdown backticks)
        jsonText = jsonText.replace(/```json|```/g, "").trim();
        itineraryData = JSON.parse(jsonText);

        // Helper function to process items and attach images
        const processItem = (item) => ({
            ...item,
            image: item.imageSearchQuery ? getImageUrl(item.imageSearchQuery) : getImageUrl(itineraryData.destination),
        });

        // Process nested structures
        itineraryData.hotels = itineraryData.hotels.map(processItem);
        itineraryData.dailyPlan.forEach(day => {
            day.activities = day.activities.map(processItem);
        });
        
        // Add a main image for the header (This will use 1200x800 size)
        itineraryData.mainImage = getImageUrl(`${destination} travel city view`);

        return Response.json({ success: true, itinerary: itineraryData }, { status: 200 });
        
    } catch (parseError) {
        console.error("❌ JSON Parse or Processing Error:", parseError, "Raw Text:", jsonText);
        return Response.json(
            { success: false, error: "AI failed to return valid JSON. Please try again." },
            { status: 500 }
        );
    }
}