import { $, component$, useSignal } from "@builder.io/qwik";
import { Form, type DocumentHead } from "@builder.io/qwik-city";
import styles from "~/styles/calculator.module.css";
import { getMaxFlowRate, type PipeMaterial } from "../hazen-williams";

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
    // Alle Eingabewerte prüfen und in SI-Einheiten umrechnen
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
    ).value as PipeMaterial;
    const length = parseFloat(
      (form.querySelector("input#length") as HTMLInputElement).value,
    );
    const lengthUnit = (
      form.querySelector("select#length_unit") as HTMLSelectElement
    ).value;
    const elevation = parseFloat(
      (form.querySelector("input#elevation") as HTMLInputElement).value,
    );

    // Umrechnung der Einheiten
    // zu mWs umrechnen
    let pressureSI = pressure;
    switch (pressureUnit) {
      case "bar":
        pressureSI *= 9.80665;
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

    // Berechnung der maximalen Fördermenge
    const maxFlow = getMaxFlowRate(
      pressureSI,
      diameterSI,
      material,
      lengthSI,
      elevation,
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
