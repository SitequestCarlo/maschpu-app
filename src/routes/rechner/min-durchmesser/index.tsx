import { $, component$, useSignal } from "@builder.io/qwik";
import { Form, type DocumentHead } from "@builder.io/qwik-city";
import styles from "~/styles/calculator.module.css";
import { getMinDiameter, type PipeMaterial } from "../hazen-williams";
import {
  FlowInput,
  readFlow,
  PressureMWsInput,
  readPressureMWs,
  LengthInput,
  readLength,
  HeightInput,
  readHeight,
  PipeMaterialInput,
  readPipeMaterial,
} from "~/components/form/inputs";

export const head: DocumentHead = {
  title: "Berechne den erforderlich Durchmesser",
  meta: [
    {
      name: "description",
      content:
        "Dieser Rechner verwendet die Hazen-Wiliams-Gleichung, um den erfoderlichen Leitungsduchmesser für eine bestimmte Fördermenge zu ermitteln.",
    },
  ],
};

export default component$(() => {
  const mDiameter = useSignal<number>(0);

  const calcMinDiameter = $((e: Event, form: HTMLFormElement) => {
    const flowRateSI = readFlow(form, "flow");
    const pressureSI = readPressureMWs(form, "pressure");
    const material = readPipeMaterial(form, "material");
    const lengthSI = readLength(form, "length");
    const elevationSI = readHeight(form, "elevation");

    const diameter = getMinDiameter(
      flowRateSI,
      pressureSI,
      material as PipeMaterial,
      lengthSI,
      elevationSI,
    );

    mDiameter.value = diameter;
  });

  return (
    <div class={styles.tool}>
      <h1>Berechnet den erforderlichen Leitungsdurchmesser</h1>
      <p>
        Dieser Rechner verwendet die Hazen-Wiliams-Gleichung, um den
        erfoderlichen Leitungsduchmesser für eine bestimmte Fördermenge zu
        ermitteln.
      </p>
      <Form onSubmitCompleted$={calcMinDiameter}>
        <FlowInput name="flow" />
        <PressureMWsInput name="pressure" />
        <PipeMaterialInput name="material" />

        <LengthInput name="length" label="Leitungslänge" />
        <HeightInput name="elevation" />

        <hr />

        <button type="submit">Berechnen</button>
      </Form>

      <div class={styles.result}>
        <div>
          <span>m (Meter)</span>
          <span>
            <b>{mDiameter.value.toFixed(2)}</b> m
          </span>
        </div>

        <div>
          <span>mm (Millimeter)</span>
          <span>
            <b>{(mDiameter.value * 1000).toFixed(2)}</b> mm
          </span>
        </div>
      </div>
    </div>
  );
});
