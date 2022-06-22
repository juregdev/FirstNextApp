import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../../services/stripe";
import saveSubcrition from "./_logs/manageSubscriptionStripe";

async function buffer(reader: Readable) {
  const chunks = []

  for await (const chunk of reader) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    )
  }

  return Buffer.concat(chunks)
}

export const config = {
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set(['checkout.session.completed'])


/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === 'POST') {
    const buf = await buffer(req)
    const secret = req.headers['stripe-signature']

    let event: Stripe.Event

    try { event = stripe.webhooks.constructEvent(buf, secret!, process.env.STRIPE_WEBHOOK_SECRET_KEY!) }
    catch (err) {
      return res.status(400).send(`Webhook error: ${err}`);
    }

    const { type } = event

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session
            saveSubcrition(
              checkoutSession.subscription!.toString(),
              checkoutSession.customer!.toString()
            )
            break;
          default:
            throw new Error('Unexpected error')
        }
      } catch (err) {

      }
    }

    res.json({ received: true })
  }


  else {
    res.setHeader('Allow', 'POST');
    res.status(405).end("Method not allowed")
  }


}