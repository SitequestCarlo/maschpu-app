import { $, component$, useSignal } from "@builder.io/qwik";
import { Form, type DocumentHead } from "@builder.io/qwik-city";
import styles from "~/styles/calculator.module.css"
import { getMinDiameter, type PipeMaterial } from "../hazen-williams";

export const head: DocumentHead = {
  title: "Berechne den erforderlich Durchmesser",
  meta: [
    {
      name: "description",
      content: "Dieser Rechner verwendet die Hazen-Wiliams-Gleichung, um den erfoderlichen Leitungsduchmesser für eine bestimmte Fördermenge zu ermitteln.",
    },
  ],
}

export default component$(() => {

  const mDiameter = useSignal<number>(0);

  const calcMinDiameter = $((e: Event, form: HTMLFormElement) => {

    // Alle Eingabewerte prüfen und in SI-Einheiten umrechnen
    const flowRate = parseFloat((form.querySelector("input#flow") as HTMLInputElement).value);
    const flowUnit = (form.querySelector("select#flow_unit") as HTMLSelectElement).value;
    const pressure = parseFloat((form.querySelector("input#pressure") as HTMLInputElement).value);
    const pressureUnit = (form.querySelector("select#pressure_unit") as HTMLSelectElement).value;
    const material = (form.querySelector("select#material") as HTMLSelectElement).value;
    const length = parseFloat((form.querySelector("input#length") as HTMLInputElement).value);
    const lengthUnit = (form.querySelector("select#length_unit") as HTMLSelectElement).value;
    const elevation = parseFloat((form.querySelector("input#elevation") as HTMLInputElement).value);
    const elevationUnit = (form.querySelector("select#elevation_unit") as HTMLSelectElement).value;

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

    let pressureSI = pressure;
    switch (pressureUnit) {
      case "bar":
        pressureSI *= 9.80665; // bar zu mWs
        break;
      case "mWs":
        break; // bereits in mWs
    }

    let lengthSI = length;
    switch (lengthUnit) {
      case "m":
        break; // bereits in m
      case "cm":
        lengthSI /= 100; // cm zu m
        break
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
    // Berechnung des minimalen Durchmessers
    const diameter = getMinDiameter(
      flowRateSI,
      pressureSI,
      material as PipeMaterial ,
      lengthSI,
      elevationSI
    );

    mDiameter.value = diameter;

  });

  return (
    <div class={styles.tool}>
      <h1>Berechnet den erforderlichen Leitungsdurchmesser</h1>
      <p>Dieser Rechner verwendet die Hazen-Wiliams-Gleichung, um den erfoderlichen Leitungsduchmesser für eine bestimmte Fördermenge zu ermitteln.</p>
      <Form onSubmitCompleted$={calcMinDiameter}>

        {/* Fördermenge */}
        <div>
          <label for="flow">Fördermenge</label>
          <div class={styles.unitInput}>
            <input type="number" required id="flow" value={5000}/>
            <select id="flow_unit">
              <option value="m3_s">m³/s</option>
              <option value="m3_h">m³/h</option>
              <option value="l_s">l/s</option>
              <option value="l_min" selected>l/min</option>
              <option value="l_h">l/h</option>
              <option value="gal_min">GPM</option>
            </select>
          </div>
        </div>

        {/* Pumpendruck */}
        <div>
          <label for="pressure">Pumpendruck</label>
          <div class={styles.unitInput}>
            <input type="number" required id="pressure" value={2} step={0.1}/>
            <select id="pressure_unit">
              <option value="bar" selected>bar</option>
              <option value="mWs">mWs</option>
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
                <option value="rub" selected>Gummi (NBR)</option>
                <option value="hdpe">Hochverdichtetes Polyethylen (HDPE)</option>
                <option value="pvc">Polyvinylchlorid (PVC)</option>
                <option value="frp">Glasfaserverstärkter Kunststoff (GFK)</option>
              </optgroup>
              <optgroup label="Beton">
                <option value="con">Beton</option>
                <option value="cmc">Zementmörtel-ausgekleidetes duktiles Gusseisenrohr</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Leitungslänge */}
        <div>
          <label for="length">Leitungslänge</label>
          <div class={styles.unitInput}>
            <input type="number" required id="length" value={50}/>
            <select id="length_unit">
              <option value="m" selected>m</option>
              <option value="cm">cm</option>
              <option value="km">km</option>
            </select>
          </div>
        </div>

        {/* Förderhöhe */}
        <div>
          <label for="elevation">Förderhöhe</label>
          <div class={styles.unitInput}>
            <input type="number" id="elevation" value={15}/>
            <select id="elevation_unit">
              <option value="m" selected>m</option>
              <option value="cm">cm</option>
            </select>
          </div>
        </div>

        <hr />

        <button type="submit">Berechnen</button>

      </Form>

      <div class={styles.result}>
        
        <div>
          <span>m (Meter)</span>
          <span><b>{mDiameter.value.toFixed(2)}</b> m</span>
        </div>

        <div>
          <span>mm (Millimeter)</span>
          <span><b>{(mDiameter.value * 1000).toFixed(2)}</b> mm</span>
        </div>

      </div>
    </div>
  )
})