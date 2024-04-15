import prisma from '../../../lib/prisma'; // Import Prisma client instance

export async function GET(req, res) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('userId')
    const referer = req.headers.get("referer");
    try {
        // Fetch chats grouped by chat history
        const user = await prisma.user.findFirst({
            where: {
                clerkId: id
            }// Filter chats by user's clerkId     

        });


        return new Response(JSON.stringify({
            user
        }), {
            status: 200,
            headers: { referer: referer },
        });

    } catch (error) {
        console.error('Error fetching chats:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}