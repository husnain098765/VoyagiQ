// lib/gemini.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//  Text / Chat model (Planning, Itineraries, Budget Estimation, etc.)
export const textModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

//  Image + Vision model (Uploading photos, Understanding Places, etc.)
export const visionModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", 
});

//  Image Generation (Banners, Thumbnails, UI Images, etc.)
export const imageModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

/**
 *  Generate Text (Example Usage)
 * const result = await generateText("Plan a 3 day trip to Dubai");
 */
export async function generateText(prompt) {
  try {
    const result = await textModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Gemini Text Error:", error);
    return null;
  }
}

/**
 *  Analyze an uploaded image
 * imageBuffer must be base64 encoded
 */
export async function analyzeImage(prompt, imageBase64) {
  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg"
      }
    };

    const result = await visionModel.generateContent([prompt, imagePart]);
    return result.response.text();
  } catch (error) {
    console.error("❌ Gemini Vision Error:", error);
    return null;
  }
}

/**
 *  Generate Images from Prompt
 */
export async function generateImage(prompt) {
  try {
    const result = await imageModel.generateImage({
      prompt,
      size: "1024x1024"
    });

    return result.imageBase64; //  returns base64 image string
  } catch (error) {
    console.error("❌ Gemini Image Generation Error:", error);
    return null;
  }
}
