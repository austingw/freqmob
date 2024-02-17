import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.scrollContainer}>
          <h1 className={styles.siteTitle}>
            FREQMOB // FREQMOB // FREQMOB // FREQMOB // FREQMOB
          </h1>
        </div>
        <div className={styles.description}>
          A platform for artists.
          <button className={styles.button1}>Sign Up</button>
          <button className={styles.button2}>Log In</button>
          <button className={styles.button3}>About</button>
        </div>
      </div>
    </main>
  );
}
