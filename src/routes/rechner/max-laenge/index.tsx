import { $, component$, useSignal } from "@builder.io/qwik";
import { Form, type DocumentHead } from "@builder.io/qwik-city";
import styles from "~/styles/calculator.module.css";
import { getMaxPipeLength, type PipeMaterial } from "../hazen-williams";
import {
  FlowInput,
  readFlow,
  PressureMWsInput,
  readPressureMWs,
  DiameterInput,
  readDiameter,
  HeightInput,
  readHeight,
  PipeMaterialInput,
  readPipeMaterial,
} from "~/components/form/inputs";

export const head: DocumentHead = {
  title: "Berechne die maximale Leitungslänge",
  meta: [
    {
      name: "description",
      content:
        "Berechnet die maximale Leitungslänge nach Hazen-Williams basierend auf der maximalen Druckdifferenz und anderen Parametern.",
    },
    { name: "search:tags", content: "rechner, maximale leitungslänge, hazen-williams, druckdifferenz" },
  ],
};

export default component$(() => {
  const mLength = useSignal<number>(0);

  const calcMaxLength = $((e: Event, form: HTMLFormElement) => {
    const flowRateSI = readFlow(form, "flow");
    const pressureSI = readPressureMWs(form, "pressure");
    const diameterSI = readDiameter(form, "diameter");
    const material = readPipeMaterial(form, "material");
    const elevationSI = readHeight(form, "elevation");

    const maxLength = getMaxPipeLength(
      flowRateSI,
      diameterSI,
      material as PipeMaterial,
      pressureSI,
      elevationSI,
    );

    mLength.value = maxLength;
  });

  return (
    <div class={styles.tool}>
      <h1>Berechne die maximale Leitungslänge</h1>
      <p>
        Dieser Rechner hilft dir, die maximale Leitungslänge zu bestimmen, die
        du mit einer bestimmten Druckdifferenz und anderen Parametern verwenden
        kannst.
      </p>
      <Form onSubmitCompleted$={calcMaxLength}>
        <FlowInput name="flow" />
        <PressureMWsInput name="pressure" />
        <DiameterInput name="diameter" />
        <PipeMaterialInput name="material" />

        <HeightInput name="elevation" />

        <hr />

        <button type="submit">Berechnen</button>
      </Form>

      <div class={styles.result}>
        <div>
          <span>Maximale Leitungslänge</span>
          <span>
            <b>{Math.max(mLength.value, 0).toFixed(2)}</b> m
          </span>
        </div>
      </div>
    </div>
  );
});
