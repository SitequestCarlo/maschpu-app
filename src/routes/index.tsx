import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h1>MaschPu-App</h1>
      <p>Das hier soll eine kleine Zusammenfassung von Lehrunterlagen un nützlichen Tools für Maschinisten von Schmutzwasserpumpen darstellen.</p>

      <Link href="/impressum">Impressum</Link>
    </>
  );
});

export const head: DocumentHead = {
  title: "MaschPu-App",
  meta: [
    {
      name: "description",
      content: "Web-App für Maschinisten von SChmutzwasserpumpen im Technischen Hilfswerk",
    },
  ],
};
