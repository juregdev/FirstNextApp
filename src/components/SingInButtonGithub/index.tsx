import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'

import styles from './styles.module.scss'

export function SingInButtonGithub() {

  const [isLogged, setIsLogged] = useState(true)
  return isLogged ? (
    <button className={styles.singButton}>

      <FaGithub
        color='#04D361'
      />
      FilipeBarrosg
    </button>
  ) : (<button className={styles.singButton}>

    <FaGithub
      color='#EBA417'
    />
    Sing in with GitHub
  </button>)
}