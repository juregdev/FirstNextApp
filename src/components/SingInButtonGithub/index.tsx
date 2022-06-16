import { FaGithub } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'

import { signIn, signOut, useSession } from 'next-auth/react'

import styles from './styles.module.scss'

export function SingInButtonGithub() {

  const { data: session } = useSession()

  return session ? (
    <button
      className={styles.singButton}
      onClick={() => signOut()}
    >

      <FaGithub
        color='#04D361'
      />
      {session.user?.name}

      <AiOutlineClose />
    </button>
  ) : (
    <button
      className={styles.singButton}
      type="button"
      onClick={() => signIn('github')}
    >
      <FaGithub
        color='#EBA417'
      />
      Sing in with GitHub
    </button>)
}