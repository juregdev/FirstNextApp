import styles from './styles.module.scss'
import Image from 'next/image'
import { SingInButtonGithub } from '../SingInButtonGithub'

export function Header() {
  return (<>
    <header className={styles.header}>
      <div>
        <Image
          src='/images/logo.svg'
          alt='logo image'
          width={109}
          height={31}
        />


        <nav>
          <a href="#" className={styles.selected}>Home</a>
          <a href="#">Posts</a>
        </nav>
      </div>
      <SingInButtonGithub />
    </header>
  </>)
}