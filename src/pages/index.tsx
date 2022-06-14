import type { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'

import styles from '../styles/home.module.scss'

interface homeProps {
  priceId: string,
  priceAmount: number
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ product }) => {

  return (
    <>
      <Head>
        <title>Home | Ig.News</title>
      </Head>
      <main className={styles.conteiner}>

        <div className={styles.muralSubscribe}>
          <p>👏 Hey, welcome</p>
          <h1>News about
            the <span>React</span> world</h1>
          <p>Get acess to all the publications <br />
            <span>for {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.priceAmount)} month</span></p>

          <SubscribeButton />
        </div>

        <div className={styles.muralImage}>
          <Image
            src='/images/avatar.svg'
            alt='girl coding'
            width={334}
            height={520}
          />
        </div>
      </main>
    </>
  )
}



export const getStaticProps: GetStaticProps = async () => {

  const price = await stripe.prices.retrieve('price_1LAe4cCBfT7j9GyjCmFYOAdh', {
    expand: ['product']
  }
  )


  const product: homeProps = {
    priceId: price.id,
    priceAmount: price.unit_amount! / 100
  }
  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}

export default Home
