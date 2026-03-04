import { component$ } from "@builder.io/qwik";
import { type DocumentHead, Link } from "@builder.io/qwik-city";
import styles from "~/styles/index.module.css";

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

      <h2>Elektropumpen</h2>
      <div class={styles.list}>
        <Link href="/pumpen/mast-atp-20-r">
          <div class={styles.title}>Mast ATP 20 R</div>
          <div class={styles.description}>
            Elektro-Abwassertauchpumpe der Fa. Mast.
          </div>
        </Link>

        <Link href="/pumpen/mast-t-16">
          <div class={styles.title}>Mast T 16</div>
          <div class={styles.description}>Elektro-Tauchpumpe der Fa. Mast.</div>
        </Link>

        <Link href="/pumpen/mast-tp-4-1">
          <div class={styles.title}>Mast TP 4-1</div>
          <div class={styles.description}>Elektro-Tauchpumpe der Fa. Mast.</div>
        </Link>

        <Link href="/pumpen/mast-tp-8-1">
          <div class={styles.title}>Mast TP 8-1</div>
          <div class={styles.description}>Elektro-Tauchpumpe der Fa. Mast.</div>
        </Link>

        <Link href="/pumpen/mast-tp-15-1">
          <div class={styles.title}>Mast TP 15-1</div>
          <div class={styles.description}>Elektro-Tauchpumpe der Fa. Mast.</div>
        </Link>

        <Link href="/pumpen/spechtenhauser-mini-chiemsee">
          <div class={styles.title}>Spechtenhauser Mini Chiemsee</div>
          <div class={styles.description}>
            Elektro-Pumpe der Fa. Spechtenhauser.
          </div>
        </Link>

        <Link href="/pumpen/spechtenhauser-chiemsee-ex">
          <div class={styles.title}>Spechtenhauser Chiemsee EX</div>
          <div class={styles.description}>
            Elektro-Pumpe der Fa. Spechtenhauser.
          </div>
        </Link>

        <Link href="/pumpen/wilo-tp-100e190-39">
          <div class={styles.title}>Wilo TP 100E190/39</div>
          <div class={styles.description}>Elektro-Tauchpumpe der Fa. Wilo.</div>
        </Link>

        <Link href="/pumpen/wilo-tp-100e210-52">
          <div class={styles.title}>Wilo TP 100E210/52</div>
          <div class={styles.description}>Elektro-Tauchpumpe der Fa. Wilo.</div>
        </Link>

        <Link href="/pumpen/wilo-tp-100e230-70">
          <div class={styles.title}>Wilo TP 100E230/70</div>
          <div class={styles.description}>Elektro-Tauchpumpe der Fa. Wilo.</div>
        </Link>

        <Link href="/pumpen/wilo-tp-100e250-84">
          <div class={styles.title}>Wilo TP 100E250/84</div>
          <div class={styles.description}>Elektro-Tauchpumpe der Fa. Wilo.</div>
        </Link>
      </div>

      <h2>Motorpumpen</h2>
      <div class={styles.list}>
        <Link href="/pumpen/mast-np-12-b">
          <div class={styles.title}>Mast NP 12 B</div>
          <div class={styles.description}>Benzinmotorpumpe der Fa. Mast.</div>
        </Link>

        <Link href="/pumpen/spechtenhauser-atlantica">
          <div class={styles.title}>Spechtenhauser Atlantica</div>
          <div class={styles.description}>
            Benzinmotorpumpe der Fa. Spechtenhauser.
          </div>
        </Link>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Pumpen",
  meta: [
    {
      name: "description",
      content: "Übersicht über verschiedene vom THW genutzte Pumpen.",
    },
  ],
};
