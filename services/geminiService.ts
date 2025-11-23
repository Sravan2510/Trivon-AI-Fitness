import { GoogleGenAI as AIClient } from "@google/genai";

// Initialize the client securely
const client = new AIClient({ apiKey: process.env.API_KEY });

export const generateDietPlan = async (
  age: number,
  weight: number,
  height: number,
  goal: string,
  preference: string
): Promise<string> => {
  try {
    const prompt = `
      Create a detailed daily meal plan for a person with the following stats:
      Age: ${age}, Weight: ${weight}kg, Height: ${height}cm.
      Goal: ${goal}.
      Dietary Preference: ${preference}.
      
      Provide the output in valid Markdown format with sections for Breakfast, Lunch, Dinner, and Snacks.
      Also include a summary of total calories and macronutrients.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate diet plan.";
  } catch (error) {
    console.error("Diet plan generation failed:", error);
    return "Error generating diet plan. Please check your connection.";
  }
};

export const generateGroceryList = async (dietPlan: string): Promise<string> => {
  try {
    const prompt = `
      Based on the following meal plan, create a consolidated grocery shopping list categorized by aisle (Produce, Dairy, Meat, Pantry, etc.).
      
      Meal Plan:
      ${dietPlan}
      
      Output format: Markdown checklist.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate grocery list.";
  } catch (error) {
    return "Error generating list.";
  }
};

export const chatWithGymBuddy = async (message: string, history: { role: string, parts: { text: string }[] }[]) => {
  try {
    const chat = client.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: "You are 'Gym Buddy', a high-energy, motivational fitness AI assistant. Keep answers concise, encouraging, and focused on fitness, health, and mental well-being. Do not give medical advice."
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm catching my breath! Try again in a moment.";
  }
};