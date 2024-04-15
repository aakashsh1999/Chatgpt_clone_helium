import prisma from '../../../lib/prisma'; // Import Prisma client instance

export async function GET(req, res) {
    const { searchParams } = new URL(req.url)

  const id = searchParams.get('userId')
  const referer = req.headers.get("referer");
    try {
        // Fetch chats grouped by chat history
        const chats = await prisma.chat.findMany({
          where: {
            chatHistory: {
                userId: id // Filter chats by user's clerkId
            }
        },
        include: {
            chatHistory: {
                include: {
                    chatList: true // Include the chatList relation in chatHistory
                }
            }
        },
    });
    
    // Group chats by chatHistoryId
    const groupedChats = {};
    chats.forEach(chat => {
        if (!groupedChats[chat.chatHistoryId]) {
            groupedChats[chat.chatHistoryId] = chat;
        }
    });
    
    // Convert groupedChats object to array
    const uniqueChats = Object.values(groupedChats);

        return new Response(JSON.stringify({
            data: uniqueChats,
        }), {
            status: 200,
            headers: { referer: referer },
        });

    } catch (error) {
        console.error('Error fetching chats:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}