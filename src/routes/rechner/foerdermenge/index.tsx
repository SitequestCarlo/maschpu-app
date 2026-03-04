import { $, component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, Form } from "@builder.io/qwik-city";
import styles from "~/styles/calculator.module.css";
import { FlowInput, readFlow } from "~/components/form/inputs";

export const head: DocumentHead = {
  title: "Fördermengenumrechner",
  meta: [
    {
      name: "description",
      content: "Wandelt Fördermengen von einer Einheit in andere um.",
    },
    { name: "search:tags", content: "rechner, fördermenge, umrechner, einheiten" },
  ],
};

export default component$(() => {
  return (
    <>
      <FlowCalc />
    </>
  );
});

export const FlowCalc = component$(() => {
  /** Interner Wert in m³/s */
  const m3s = useSignal<number>(0);

  const calcFlow = $((e: Event, form: HTMLFormElement) => {
    m3s.value = readFlow(form, "flow");
  });

  return (
    <div class={styles.tool}>
      <h1>Fördermengenumrechner</h1>

      <p>
        Klärwerke und andere Stellen der Abwasserwirschaft rechnen oft nicht in
        l/min. Mit diesem Rechner lassen sich die Werte in alle relevanten
        Einheiten umrechnen.
      </p>

      <Form onSubmitCompleted$={calcFlow}>
        <FlowInput name="flow" label="Durchflussmenge" value={1000} />

        <hr />

        <button type="submit">Berechnen</button>
      </Form>

      <div class={styles.result}>
        <div>
          <span>l/s (Liter/Sekunde)</span>
          <span>
            <b>{Math.max(m3s.value * 1000, 0).toFixed(2)}</b> l/s
          </span>
        </div>

        <div>
          <span>l/min (Liter/Minute)</span>
          <span>
            <b>{Math.max(m3s.value * 60000, 0).toFixed(2)}</b> l/min
          </span>
        </div>

        <div>
          <span>l/h (Liter/Stunde)</span>
          <span>
            <b>{Math.max(m3s.value * 3600000, 0).toFixed(2)}</b> l/h
          </span>
        </div>

        <hr />

        <div>
          <span>m³/s (Kubikmeter/Sekunde)</span>
          <span>
            <b>{Math.max(m3s.value, 0).toFixed(4)}</b> m³/s
          </span>
        </div>

        <div>
          <span>m³/min (Kubikmeter/Minute)</span>
          <span>
            <b>{Math.max(m3s.value * 60, 0).toFixed(4)}</b> m³/min
          </span>
        </div>

        <div>
          <span>m³/h (Kubikmeter/Stunde)</span>
          <span>
            <b>{Math.max(m3s.value * 3600, 0).toFixed(2)}</b> m³/h
          </span>
        </div>
      </div>
    </div>
  );
});
