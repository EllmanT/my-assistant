import { adminDb } from "@/firebaseAdmin";
import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const headersList = headers();
  const body = await req.text();
  const signature = (await headersList).get("stripe-signature");
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("Stripe webhook secret is not set");
    return new NextResponse("Stripe webhook secret is not set", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log(`Webhook error ${error}`);
    return new NextResponse(`Webhook Error:${error}`, { status: 400 });
  }
  const getUserDetails = async (customerId: string) => {
    const userDoc = await adminDb
      .collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();

    if (!userDoc.empty) {
      return userDoc.docs[0];
    }
  };
  switch (event.type) {
    case "checkout.session.completed":
    case "payment_intent.succeeded": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;

      const usersDetails = await getUserDetails(customerId);

      if (!usersDetails?.id) {
        return new NextResponse("User not found", { status: 404 });
      }
      // Update the user sub status

      await adminDb.collection("users").doc(usersDetails?.id).update({
        hasActiveMembership: true,
      });
      break;
    }
    case "customer.subscription.deleted":
    case "subscription_schedule.canceled": {
      const subsription = event.data.object as Stripe.Subscription;
      const customerId = subsription.customer as string;

      const usersDetails = await getUserDetails(customerId);

      if (!usersDetails?.id) {
        return new NextResponse("User not found", { status: 404 });
      }

      await adminDb.collection("users").doc(usersDetails?.id).update({
        hasActiveMembership: false,
      });
      break;
    }
    default:
      console.log(`unhandled event type :${event.type}`);
  }

  return NextResponse.json({ message: "Webhook recieved" });
}
