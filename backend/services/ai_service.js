// const OpenAI = require("openai");

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// /**
//  * Generate AI response from chat history
//  */
// async function generateAIResponse(messages) {
//   const completion = await client.chat.completions.create({
//     model: "gpt-4o-mini", // fast + cheap + good
//     messages,
//     temperature: 0.7,
//   });

//   return completion.choices[0].message.content;
// }

// module.exports = {
//   generateAIResponse,
// };

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", // fast + cheap
});

/**
 * Generate AI response from chat history
 */
async function generateAIResponse(messages) {
  // Convert OpenAI-style messages → Gemini format
  const chatHistory = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({
    history: chatHistory.slice(0, -1), // all except last user msg
  });

  const lastUserMessage = chatHistory[chatHistory.length - 1].parts[0].text;

  const result = await chat.sendMessage(lastUserMessage);
  console.log("Gemini response:", chat+" "+ lastUserMessage);
  return result.response.text();
}

module.exports = {
  generateAIResponse,
};
