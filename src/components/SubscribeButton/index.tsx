import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJS } from '../../services/stripe-js';
import styles from './styles.module.scss';

export function SubscribeButton() {
  const { data: session } = useSession()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
    } else {
      try {
        const res = await api.post('/subcription')
        const { sessionId } = res.data

        const stripe = await getStripeJS()

        stripe?.redirectToCheckout({ sessionId })
      } catch (err) {
        alert(err)
      }
    }
  }

  return (
    <button
      className={styles.subscribeBtn}
      type="button"
      onClick={() => handleSubscribe()}>
      Subscribe Now
    </button>)
}