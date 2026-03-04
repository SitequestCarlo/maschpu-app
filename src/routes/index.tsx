import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h1>MaschPu-App</h1>
      <p>
        Das hier soll eine kleine Zusammenfassung von Datenblättern,
        Lehrunterlagen und nützlichen Tools für Maschinisten von
        Schmutzwasserpumpen darstellen.
      </p>

      <Link href="/impressum">Impressum</Link>

      <h2>Inhalte werden bereitgestellt von:</h2>

      <p>
        <b>Börger GmbH</b>
        <br />
        Benningsweg 24 <br />
        46325 Borken-Weseke <br />
        Deutschland <br />
        <a href="https://www.boerger.de">www.boerger.de</a>
      </p>

      <p>
        <b>Bundesanstalt Technisches Hilfswerk (THW)</b>
        <br />
        Provinzialstraße 93 <br />
        53127 Bonn <br />
        Deutschland <br />
        <a href="https://www.thw.de">www.thw.de</a>
      </p>

      <p>
        <b>DIA Pumpen GmbH</b> <br />
        Hans-Böckler-Straße 9 <br />
        40764 Langenfeld <br />
        Deutschland <br />
        <a href="https://www.dia-pumpen.de">www.dia-pumpen.de</a>
      </p>

      <p>
        <b>Faltsilo GmbH</b> <br />
        Am Hasselt 3 <br />
        24576 Bad Bramstedt <br />
        Deutschland <br />
        <a href="https://www.faltsilo.de">www.faltsilo.de</a>
      </p>

      <p>
        <b>Faszitech UG</b> <br />
        AM Schloßpark 23 <br />
        64625 Bensheim <br />
        Deutschland <br />
        <a href="https://www.faszitech.de">www.faszitech.de</a>
      </p>

      <p>
        <b>KSB SE & Co. KGaA</b> <br />
        Johann-Klein-Straße 9 <br />
        67227 Frankenthal <br />
        Deutschland <br />
        <a href="https://www.ksb.com">www.ksb.com</a>
      </p>

      <p>
        <b>Mast Pumpen GmbH</b>
        <br />
        Mönkestraße 1 <br />
        73773 Aichwald <br />
        Deutschland <br />
        <a href="https://www.mast-pumpen.de">www.mast-pumpen.de</a>
      </p>

      <p>
        <b>Spechtenhauser Hochwasser- und Gewässerschutz GmbH</b> <br />
        Gewerbestraße 3 <br />
        86875 Waal <br />
        Deutschland <br />
        <a href="https://www.spechtenhauser.de">www.spechtenhauser.de</a>
      </p>

      <p>
        <b>Tec-Science</b> <br />
        <a href="https://www.tec-science.com">www.tec-science.com</a>
      </p>

      <p>
        <b>Wilo SE</b> <br />
        Wilopark 1 <br />
        44263 Dortmund <br />
        Deutschland <br />
        <a href="https://www.wilo.com">www.wilo.com</a>
      </p>

      <p>
        Die Verwendungsrechte der entsprechenden Inhalte liegen bei den oben
        genannten Parteien.
      </p>
    </>
  );
});

export const head: DocumentHead = {
  title: "MaschPu-App",
  meta: [
    {
      name: "description",
      content:
        "Web-App für Maschinisten von Schmutzwasserpumpen im Technischen Hilfswerk",
    },
    { name: "search:tags", content: "startseite, home, maschpu, app" },
  ],
};
