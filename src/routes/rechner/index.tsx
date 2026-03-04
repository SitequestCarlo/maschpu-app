import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link } from "@builder.io/qwik-city";
import styles from "~/styles/index.module.css";

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

        <Link href="/rechner/foerdermenge">
          <div class={styles.title}>Fördermengenumrechner</div>
          <div class={styles.description}>
            Wandelt Durchflussmengen in andere Einheiten um.
          </div>
        </Link>

        <Link href="/rechner/min-druck">
          <div class={styles.title}>Erforderlicher Pumpendruck</div>
          <div class={styles.description}>
            Berechnet den erforderlichen Pumpendruck für eine bestimmte
            Fördermenge.
          </div>
        </Link>

        <Link href="/rechner/max-laenge">
          <div class={styles.title}>Maximale Leitungslänge</div>
          <div class={styles.description}>
            Berechnet die maximale Länge einer Leitung.
          </div>
        </Link>

        <Link href="/rechner/max-menge">
          <div class={styles.title}>Maximale Fördermenge</div>
          <div class={styles.description}>
            Berechnet die maximal mögliche Fördermenge einer Leitung.
          </div>
        </Link>

        <Link href="/rechner/min-durchmesser">
          <div class={styles.title}>Erforderlicher Leitungsdurchmesser</div>
          <div class={styles.description}>
            Berechnet den erforderlichen Leitungsdurchmesser für eine bestimmte
            Fördermenge.
          </div>
        </Link>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Rechner",
  meta: [
    {
      name: "description",
      content:
        "Rechen-Tools zur Berechnung von verschiedenen Werten von Pumpstrecken.",
    },
    { name: "search:tags", content: "rechner, berechnung, kalkulator, tools" },
  ],
};
