import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h1>MaschPu-App</h1>
      <p>Das hier soll eine kleine Zusammenfassung von Lehrunterlagen un nützlichen Tools für Maschinisten von Schmutzwasserpumpen darstellen.</p>

      <Link href="/impressum">Impressum</Link>

      <h2>Inhalte werden bereitgestellt von:</h2>

      <p>
        <b>Mast Pumpen GmbH</b><br />
        Mönkestraße 1 <br />
        73773 Aichwald <br />
        Deutschland <br />
        <a href="https://www.mast-pumpen.de">www.mast-pumpen.de</a>
      </p>

      <p>
        <b>SHG</b> <br />
        Spechtenhauser Hochwasser- und Gewässerschutz GmbH <br />
        Gewerbestraße 3 <br />
        86875 Waal <br />
        Deutschland <br />
        <a href="https://www.spechtenhauser.de">www.spechtenhauser.de</a>
      </p>

      <p>Die Verwendungsrechte der entsprechenden Inhalte liegen bei den oben genannten Parteien.</p>
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
