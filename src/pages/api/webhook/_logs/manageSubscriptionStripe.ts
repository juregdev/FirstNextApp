import { fauna } from '../../../../services/fauna'

import { query as q } from 'faunadb'
import { stripe } from '../../../../services/stripe'
import Stripe from 'stripe'

type subscriptionType = {
  UserId: Object,
  subscriptionId: string,
  customerId: string,
  // subscription: Stripe.Subscription,
  priceId: string,
  active: string,

}


export default async function saveSubcrition(
  subscriptionId: string,
  customerId: string,
) {

  const userRef = await fauna.query(
    q.Select('ref',
      q.Get(
        q.Match(
          q.Index('data_by_customer'),
          customerId
        )
      ))
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const subscriptionData: subscriptionType = {
    UserId: userRef,
    subscriptionId: subscription.id,
    customerId: customerId,
    priceId: subscription.items.data[0].price.id,
    active: subscription.status,
  }

  fauna.query(
    q.Create(
      q.Collection('subscription'), { data: subscriptionData })
  )


  console.log(subscription, userRef, subscriptionData)
}