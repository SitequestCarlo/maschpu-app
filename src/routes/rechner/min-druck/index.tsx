import { $, component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, Form } from "@builder.io/qwik-city";
import styles from "~/styles/calculator.module.css";
import { getRequirerdPumpHead, type PipeMaterial } from "../hazen-williams";
import {
  FlowInput,
  readFlow,
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
  title: "Berechne den erforderlichen Pumpendruck",
  meta: [
    {
      name: "description",
      content:
        "Berechnet den erforderlichen Pumpendruck nach der Hazen-Williams-Gleichung.",
    },
  ],
};

export default component$(() => {
  const mWs = useSignal<number>(0);

  const calcPumpPressure = $((e: Event, form: HTMLFormElement) => {
    const flowRateSI = readFlow(form, "flow");
    const diameterSI = readDiameter(form, "diameter");
    const material = readPipeMaterial(form, "material");
    const lengthSI = readLength(form, "length");
    const elevationSI = readHeight(form, "elevation");

    const pumpHead = getRequirerdPumpHead(
      flowRateSI,
      diameterSI,
      material as PipeMaterial,
      lengthSI,
      elevationSI,
    );

    mWs.value = pumpHead;
  });

  return (
    <div class={styles.tool}>
      <h1>Berechne den erforderlichen Pumpendruck</h1>
      <p>
        Dieser Rechner verwendet die Hazen-Williams-Gleichung, um den
        erforderlichen Pumpendruck für eine gewisse Fördermenge zu berechnen.
      </p>
      <Form onSubmitCompleted$={calcPumpPressure}>
        <FlowInput name="flow" />
        <DiameterInput name="diameter" />
        <PipeMaterialInput name="material" />

        <LengthInput name="length" label="Leitungslänge" />
        <HeightInput name="elevation" />

        <hr />

        <button type="submit">Berechnen</button>
      </Form>

      <div class={styles.result}>
        <div>
          <span>mWs (Meter Wassersäule)</span>
          <span>
            <b>{Math.max(mWs.value, 0).toFixed(2)}</b> mWs
          </span>
        </div>

        <div>
          <span>Bar</span>
          <span>
            <b>{Math.max(mWs.value * 0.0980665, 0).toFixed(2)}</b> bar
          </span>
        </div>
      </div>
    </div>
  );
});
