import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link } from "@builder.io/qwik-city";
import styles from "~/styles/index.module.css"

export default component$(() => {
  return (
    <>
      <h1>Theorie</h1>
      <h2>Strömungslehre</h2>
      <div class={styles.list}>

        <Link href="/theorie/stroemungslehre/einfuehrung">
          <div class={styles.title}>Einführung</div>
          <div class={styles.description}>Eine kleine Übersicht über Strömunglehre im THW.</div>
        </Link>

        <Link href="/theorie/stroemungslehre/durchfluss">
          <div class={styles.title}>Durchflussmenge</div>
          <div class={styles.description}>
            Was bedeutet Durchfluss und wie berechnet er sich?
          </div>
        </Link>

        <Link href="/theorie/stroemungslehre/druck">
          <div class={styles.title}>Druck</div>
          <div class={styles.description}>
            Was ist eigentlich Druck?
          </div>
        </Link>

        <Link href="/theorie/stroemungslehre/venturi">
          <div class={styles.title}>Venturi-Effekt</div>
          <div class={styles.description}>
            Was ist der Venturi-Effekt und wie kann ich ihn nutzen?
          </div>
        </Link>

        <Link href="/theorie/stroemungslehre/kavitation">
          <div class={styles.title}>Kavitation</div>
          <div class={styles.description}>
            Wie entsteht Kavitation und was sind die Folgen?
          </div>
        </Link>

        <Link href="/theorie/stroemungslehre/reibung">
          <div class={styles.title}>Reibung</div>
          <div class={styles.description}>
            Wo ensteht Reibung und welchen Einfluss hat Sie?
          </div>
        </Link>

        <Link href="/theorie/stroemungslehre/saughoehe">
          <div class={styles.title}>Saughöhe</div>
          <div class={styles.description}>
            Wie hoch kann ich ansaugen und warum?
          </div>
        </Link>
      </div>

{/*       <h2>Pumpentechnik</h2>
      <div class={styles.list}>
        <Link href="/theorie/pumpentechnik/einfuehrung">
          <div class={styles.title}>Einführung</div>
          <div class={styles.description}>
            Welche Pumpenarten gibt es im THW?
          </div>
        </Link>

        <Link href="/theorie/pumpentechnik/kreiselrad">
          <div class={styles.title}>Kreiselrad-pumpen</div>
          <div class={styles.description}>
            Wie funktionieren Kreiselrad-pumpen?
          </div>
        </Link>

        <Link href="/theorie/pumpentechnik/drehkolben">
          <div class={styles.title}>Drehkolben-pumpen</div>
          <div class={styles.description}>
            Wie funktionieren Drehkolben-pumpen?
          </div>
        </Link>

        <Link href="/theorie/pumpentechnik/drehschieber">
          <div class={styles.title}>Drehschieber-pumpen (Vakuum-pumpen)</div>
          <div class={styles.description}>
            Wie funktionieren Drehschieber-pumpen?
          </div>
        </Link>
      </div> */}
    </>
  )
})

export const head: DocumentHead = {
  title: "Theorie",
  meta: [
    {
      name: "description",
      content: "Theorieüberischt zu Themen aus der Strömungslehre und Pumpentechnik.",
    },
  ],
};