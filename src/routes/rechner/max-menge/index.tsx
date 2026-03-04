import { $, component$, useSignal } from "@builder.io/qwik";
import { Form, type DocumentHead } from "@builder.io/qwik-city";
import styles from "~/styles/calculator.module.css";
import { getMaxFlowRate, type PipeMaterial } from "../hazen-williams";
import {
  PressureMWsInput,
  readPressureMWs,
  DiameterInput,
  readDiameter,
  LengthInput,
  readLength,
  HeightInput,
  readHeight,
  PipeMaterialInput,
  readPipeMaterial,
} from "~/components/form/inputs";

export const head: DocumentHead = {
  title: "Berechne die maximale Fördermenge",
  meta: [
    {
      name: "description",
      content:
        "Berechnet die maximale Fördermenge basierend auf verschiedenen Parametern.",
    },
  ],
};

export default component$(() => {
  const m3s = useSignal<number>(0);

  const calcMaxFlow = $((e: Event, form: HTMLFormElement) => {
    const pressureSI = readPressureMWs(form, "pressure");
    const diameterSI = readDiameter(form, "diameter");
    const material = readPipeMaterial(form, "material") as PipeMaterial;
    const lengthSI = readLength(form, "length");
    const elevationSI = readHeight(form, "elevation");

    const maxFlow = getMaxFlowRate(
      pressureSI,
      diameterSI,
      material,
      lengthSI,
      elevationSI,
    );

    m3s.value = maxFlow;
  });

  return (
    <div class={styles.tool}>
      <h1>Berechne die maximale Fördermenge</h1>
      <p>
        Dieser Rechner verwendet die Hazen-Williams-Gleichung, um die maximale
        Fördermenge zu berechnen, die eine Pumpe bei gegebenen Bedingungen
        fördern kann.
      </p>
      <Form onSubmitCompleted$={calcMaxFlow}>
        <PressureMWsInput name="pressure" />
        <DiameterInput name="diameter" />
        <PipeMaterialInput name="material" />

        <LengthInput name="length" label="Leitungslänge" />
        <HeightInput name="elevation" />

        <hr />

        <button type="submit">Berechnen</button>
      </Form>

      <div class={styles.result}>
        <div>
          <span>m³/s (Kubikmeter/Sekunde)</span>
          <span>
            <b>{Math.max(m3s.value, 0).toFixed(2)}</b> m³/s
          </span>
        </div>

        <div>
          <span>m³/h (Kubikmeter/Stunde)</span>
          <span>
            <b>{Math.max(m3s.value * 3600, 0).toFixed(2)}</b> m³/h
          </span>
        </div>

        <div>
          <span>l/s (Liter/Sekunde)</span>
          <span>
            <b>{Math.max(m3s.value * 1000, 0).toFixed(2)}</b> l/s
          </span>
        </div>

        <div>
          <span>l/min (Liter/Minute)</span>
          <span>
            <b>{Math.max(m3s.value * 1000 * 60, 0).toFixed(2)}</b> l/min
          </span>
        </div>
      </div>
    </div>
  );
});
