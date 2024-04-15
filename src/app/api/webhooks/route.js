import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { EmailAddress, WebhookEvent } from '@clerk/nextjs/server';
import prisma from '../../../lib/prisma'; // Import Prisma Client instance


export async function POST(req) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }
  

  // Get the headers
  const headerPayload = headers(req);
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const body = await req.text();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    });
  }

  // Extract user details from the webhook payload
  const { id } = evt.data;
  // Save user details to the database
  try {
    await prisma.user.create({
      data: {
        // Assuming the Clerk ID is unique and can be used as the primary key
        clerkId:id,
        email: evt.data.email_addresses[0].email_address,
        name: `${evt.data.first_name} ${evt.data.last_name}`, // Save the user's name
        // Add other user details as needed
      }
    });
  } catch (error) {
    console.error('Error saving user:', error);
    return new Response('Error occurred while saving user details', {
      status: 500
    });
  }

  console.log(`User details saved for Clerk ID: ${id}`);

  return new Response('', { status: 200 });
}


