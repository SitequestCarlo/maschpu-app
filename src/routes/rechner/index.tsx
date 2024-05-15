import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link } from "@builder.io/qwik-city";
import styles from "~/styles/index.module.css"

export default component$(() => {
  return (
    <>
      <h1>Rechner</h1>
      <div class={styles.list}>
        <Link href="/rechner/saughoehe">
          <div class={styles.title}>Saughöhenrechner</div>
          <div class={styles.description}>
            Berechnet die maximale geodätische und manometrische Ansaughöhe.
          </div>
        </Link>

        <Link href="/rechner/druckleitung">
          <div class={styles.title}>Druckleitungsrechner</div>
          <div class={styles.description}>
            Bestimmt die aktuelle Förderleistung mittels Leitungsaufbau und Gegendruck.
          </div>
        </Link>

        <Link href="/rechner/foerdermenge">
          <div class={styles.title}>Fördermengenumrechner</div>
          <div class={styles.description}>
            Wandelt Durchflussmengen in andere Einheiten um.
          </div>
        </Link>
      </div>
    </>
  )
})

export const head: DocumentHead = {
  title: "Rechner",
  meta: [
    {
      name: "description",
      content: "Rechen-Tools zur Berechnung von verschiedenen Werten von Pumpstrecken.",
    },
  ],
};