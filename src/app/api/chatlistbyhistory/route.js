import prisma from '../../../lib/prisma'; // Import Prisma client instance

export async function GET(req, res) {
    const { searchParams } = new URL(req.url)
  const chatHistoryId = searchParams.get('chatHistoryId')
  const referer = req.headers.get("referer");
    try {
        // Fetch chats grouped by chat history
        const chatList = await prisma.chat.findMany({
            where: {
              chatHistoryId: parseInt(chatHistoryId) // Filter chats by chatHistoryId
            }
          });


        return new Response(JSON.stringify({
            data: chatList,
        }), {
            status: 200,
            headers: { referer: referer },
        });

    } catch (error) {
        console.error('Error fetching chats:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}