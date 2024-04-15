import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes:["/","/api/webhooks(.*)"],
  afterAuth(auth, req, evt) {
    // Handle users who aren't authenticated
    if(auth?.userId && !auth?.isPublicRoute){
       triggerWebhook();
      return NextResponse.next();
    }
  }
  });

  const triggerWebhook = async () => {
    try {
      // Make HTTP POST request to webhook endpoint
      await fetch('http://localhost:3000/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Webhook triggered successfully');
    } catch (error) {
      console.error('Error triggering webhook:', error);
    }
  };
  

export const config = {
  matcher:[
  "/((?!.+\\.[\\w]+$|_next).*)", // Exclude URLs with file extensions or starting with "_next"
    "/", // Match root URL
    "/(api|trpc)(.*)" // Match URLs starting with "/api" or "/trpc"4
  ]
};