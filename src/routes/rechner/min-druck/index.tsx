import { $, component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, Form } from "@builder.io/qwik-city";
import styles from "~/styles/calculator.module.css";
import { getRequirerdPumpHead, type PipeMaterial } from "../hazen-williams";

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
    // Alle Eingabewerte prüfen und in SI-Einheiten umrechnen
    const flowRate = parseFloat(
      (form.querySelector("input#flow") as HTMLInputElement).value,
    );
    const flowUnit = (
      form.querySelector("select#flow_unit") as HTMLSelectElement
    ).value;
    const diameter = parseFloat(
      (form.querySelector("input#diameter") as HTMLInputElement).value,
    );
    const diameterUnit = (
      form.querySelector("select#diameter_unit") as HTMLSelectElement
    ).value;
    const material = (
      form.querySelector("select#material") as HTMLSelectElement
    ).value;
    const length = parseFloat(
      (form.querySelector("input#length") as HTMLInputElement).value,
    );
    const lengthUnit = (
      form.querySelector("select#length_unit") as HTMLSelectElement
    ).value;
    const elevation = parseFloat(
      (form.querySelector("input#elevation") as HTMLInputElement).value,
    );
    const elevationUnit = (
      form.querySelector("select#elevation_unit") as HTMLSelectElement
    ).value;

    // Umrechnung der Einheiten
    let flowRateSI = flowRate;
    switch (flowUnit) {
      case "m3_s":
        break; // bereits in m³/s
      case "m3_h":
        flowRateSI /= 3600; // m³/h zu m³/s
        break;
      case "l_s":
        flowRateSI /= 1000; // l/s zu m³/s
        break;
      case "l_min":
        flowRateSI /= 60000; // l/min zu m³/s
        break;
      case "l_h":
        flowRateSI /= 3600000; // l/h zu m³/s
        break;
      case "gal_min":
        flowRateSI *= 0.00378541 / 60; // GPM zu m³/s
        break;
    }

    let diameterSI = diameter;
    switch (diameterUnit) {
      case "mm":
        diameterSI /= 1000; // mm zu m
        break;
      case "cm":
        diameterSI /= 100; // cm zu m
        break;
      case "m":
        break; // bereits in m
    }

    let lengthSI = length;
    switch (lengthUnit) {
      case "m":
        break; // bereits in m
      case "cm":
        lengthSI /= 100; // cm zu m
        break;
      case "km":
        lengthSI *= 1000; // km zu m
        break;
    }

    let elevationSI = elevation;
    switch (elevationUnit) {
      case "m":
        break; // bereits in m
      case "cm":
        elevationSI /= 100; // cm zu m
        break;
    }

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
        {/* Fördermenge */}
        <div>
          <label for="flow">Fördermenge</label>
          <div class={styles.unitInput}>
            <input type="number" required id="flow" value={5000} />
            <select id="flow_unit">
              <option value="m3_s">m³/s</option>
              <option value="m3_h">m³/h</option>
              <option value="l_s">l/s</option>
              <option value="l_min" selected>
                l/min
              </option>
              <option value="l_h">l/h</option>
              <option value="gal_min">GPM</option>
            </select>
          </div>
        </div>

        {/* Leitungsdurchmesser */}
        <div>
          <label for="diameter">Leitungsdurchmesser</label>
          <div class={styles.unitInput}>
            <input
              type="number"
              required
              id="diameter"
              value={150}
              step={0.1}
            />
            <select id="diameter_unit">
              <option value="mm" selected>
                mm
              </option>
              <option value="cm">cm</option>
              <option value="m">m</option>
            </select>
          </div>
        </div>

        {/* Leitungsmaterial */}
        <div>
          <label for="material">Leitungsmaterial</label>
          <div class={styles.selectInput}>
            <select id="material" required>
              <optgroup label="Metalle">
                <option value="cin">Gusseisen</option>
                <option value="gir">Verzinktes Eisen</option>
                <option value="cpr">Kupfer</option>
                <option value="stl">Stahl</option>
              </optgroup>
              <optgroup label="Kunststoffe">
                <option value="rub" selected>
                  Gummi (NBR)
                </option>
                <option value="hdpe">
                  Hochverdichtetes Polyethylen (HDPE)
                </option>
                <option value="pvc">Polyvinylchlorid (PVC)</option>
                <option value="frp">
                  Glasfaserverstärkter Kunststoff (GFK)
                </option>
              </optgroup>
              <optgroup label="Beton">
                <option value="con">Beton</option>
                <option value="cmc">
                  Zementmörtel-ausgekleidetes duktiles Gusseisenrohr
                </option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Leitungslänge */}
        <div>
          <label for="length">Leitungslänge</label>
          <div class={styles.unitInput}>
            <input type="number" required id="length" value={50} />
            <select id="length_unit">
              <option value="m" selected>
                m
              </option>
              <option value="cm">cm</option>
              <option value="km">km</option>
            </select>
          </div>
        </div>

        {/* Förderhöhe */}
        <div>
          <label for="elevation">Förderhöhe</label>
          <div class={styles.unitInput}>
            <input type="number" id="elevation" value={15} />
            <select id="elevation_unit">
              <option value="m" selected>
                m
              </option>
              <option value="cm">cm</option>
            </select>
          </div>
        </div>

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
