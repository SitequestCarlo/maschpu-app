import { $, component$, useSignal } from "@builder.io/qwik";
import { Form, type DocumentHead } from "@builder.io/qwik-city";
import styles from "~/styles/calculator.module.css";
import { getMaxPipeLength, type PipeMaterial } from "../hazen-williams";

export const head: DocumentHead = {
  title: "Berechne die maximale Leitungslänge",
  meta: [
    {
      name: "description",
      content:
        "Berechnet die maximale Leitungslänge nach Hazen-Williams basierend auf der maximalen Druckdifferenz und anderen Parametern.",
    },
  ],
};

export default component$(() => {
  const mLength = useSignal<number>(0);

  const calcMaxLength = $((e: Event, form: HTMLFormElement) => {
    // Alle Eingabewerte prüfen und in SI-Einheiten umrechnen
    const flowRate = parseFloat(
      (form.querySelector("input#flow") as HTMLInputElement).value,
    );
    const flowUnit = (
      form.querySelector("select#flow_unit") as HTMLSelectElement
    ).value;
    const pressure = parseFloat(
      (form.querySelector("input#pressure") as HTMLInputElement).value,
    );
    const pressureUnit = (
      form.querySelector("select#pressure_unit") as HTMLSelectElement
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

    // zu mWs umrechnen
    let pressureSI = pressure;
    switch (pressureUnit) {
      case "bar":
        pressureSI *= 9.80665;
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

    // Berechnung der maximalen Leitungslänge
    const maxLength = getMaxPipeLength(
      flowRateSI, // Durchflussrate in m³/s
      diameterSI, // Rohrdurchmesser in m
      material as PipeMaterial, // Rohrmaterial
      pressureSI, // Pumpendruck in Pa
      elevationSI, // Höhenunterschied in m
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

        {/* Pumpendruck */}
        <div>
          <label for="pressure">Pumpendruck</label>
          <div class={styles.unitInput}>
            <input type="number" required id="pressure" value={2} step={0.1} />
            <select id="pressure_unit">
              <option value="bar" selected>
                bar
              </option>
              <option value="mWs">mWs</option>
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
          <span>Maximale Leitungslänge</span>
          <span>
            <b>{Math.max(mLength.value, 0).toFixed(2)}</b> m
          </span>
        </div>
      </div>
    </div>
  );
});
