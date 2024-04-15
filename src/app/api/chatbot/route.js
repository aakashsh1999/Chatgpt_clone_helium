import { OpenAI } from "openai";
import prisma from '../../../lib/prisma'
import { auth, currentUser } from "@clerk/nextjs";

export async function POST(request) {
  let apiResponse;

  const openai = new OpenAI({
    apiKey: "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",
  });
  const { userId } = auth()
  const body = await request.json();
  const referer = request.headers.get("referer");

  // Retrieve chat history id from the request body
  const chatHistoryId = body.chatHistoryId;

  const messages = [{
    role: "user",
    content: body.inputPrompt,
  }];

  try {

    apiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    if (chatHistoryId !=='undefined') {

      // 2. Create a new chat message associated with the retrieved chatHistoryId
      const newChat = await prisma.chat.create({
        data: {
          prompt: body.inputPrompt,
          result: apiResponse.choices[0].message.content,
          chatHistoryId: parseInt(chatHistoryId), // Associate the chat message with the retrieved chat history entry
        },
      });

    } else {
      const newChatHistory = await prisma.chatHistory.create({
        data: {
          userId: userId || null,
        },
      });
      
      // Send the new chat history id back to the client
      const newChatHistoryId = newChatHistory.id;
   

      // 2. Create a new chat message associated with the newly created chatHistory entry
      const newChat = await prisma.chat.create({
        data: {
          prompt: body.inputPrompt,
          result: apiResponse.choices[0].message.content,
          chatHistoryId: newChatHistoryId, // Associate the chat message with the newly created chat history entry
        },
      });

      // Return the new chat history id in the response
      return new Response(JSON.stringify({
        botResponse: apiResponse.choices[0].message.content,
        chatHistoryId: newChatHistoryId,
      }), {
        status: 200,
        headers: { referer: referer },
      });
    }
    
   
    return new Response(JSON.stringify({
      botResponse: apiResponse.choices[0].message.content,
    }), {
      status: 200,
      headers: { referer: referer },
    });

  } catch (e) {
    console.error(
      "API Error:",
      e.response ? JSON.stringify(e.response.data, null, 2) : e.message
    );
    return new Response(JSON.stringify({ error: "API error or other error" }), {
      status: 500,
      headers: { referer: referer },
    });
  }
}
