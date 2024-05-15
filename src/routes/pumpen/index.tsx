import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link } from "@builder.io/qwik-city";
import styles from "~/styles/index.module.css"

export default component$(() => {
  return (
    <>
      <h1>Pumpen</h1>
      <h2>Großpumpen</h2>
      <div class={styles.list}>
        <Link href="/pumpen/boerger-5000">
          <div class={styles.title}>Börger 5.000 l/min</div>
          <div class={styles.description}>
            Drehkolben-Havariepumpe der Fa. Börger.
          </div>
        </Link>

        <Link href="/pumpen/hannibal">
          <div class={styles.title}>Hannibal 5.000 l/min</div>
          <div class={styles.description}>
            Kreiselrad-Havariepumpe der Fa. Hannibal.
          </div>
        </Link>

        <Link href="/pumpen/dia-1">
          <div class={styles.title}>DIA 1 15.000 l/min</div>
          <div class={styles.description}>
            Kreiselrad-Havariepumpe der Fa. DIA.
          </div>
        </Link>

        <Link href="/pumpen/dia-2">
          <div class={styles.title}>DIA 2 15.000 l/min</div>
          <div class={styles.description}>
            Kreiselrad-Havariepumpe der Fa. DIA.
          </div>
        </Link>

        <Link href="/pumpen/boerger-25000">
          <div class={styles.title}>Börger 25.000 l/min</div>
          <div class={styles.description}>
            Drehkolben-Havariepumpe der Fa. Börger.
          </div>
        </Link>

      </div>
    </>
  )
})

export const head: DocumentHead = {
  title: "Pumpen",
  meta: [
    {
      name: "description",
      content: "Übersicht über verschiedene vom THW genutzte Pumpen.",
    },
  ],
};