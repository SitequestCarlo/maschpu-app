import { $, component$, useSignal } from "@builder.io/qwik";
import { Form, type DocumentHead } from "@builder.io/qwik-city";
import styles from "~/styles/calculator.module.css";
import { getPipeFrictionColebrookWhite } from "~/utils/reibung";
import { getDensity, getDynamicViscosity, g, k } from "~/utils/values";
import {
  PressurePaInput,
  readPressurePa,
  HeightInput,
  readHeight,
  LengthInput,
  readLength,
  CountInput,
  readCount,
  TemperatureInput,
  readTemperature,
  FactorInput,
  readFactor,
  HoseTypeInput,
  readHoseType,
} from "~/components/form/inputs";

export const head: DocumentHead = {
  title: "Druckleitungsrechner",
  meta: [
    {
      name: "description",
      content:
        "Berechnet die Leistung einer Förderstrecke anhand des Aufbaus und des Gegendrucks.",
    },
    { name: "search:tags", content: "rechner, druckleitung, förderstrecke, gegendruck" },
  ],
};

export default component$(() => {
  return (
    <>
      <PumpCalc />
    </>
  );
});

export const PumpCalc = component$(() => {
  const flow = useSignal<number>(0);

  const calculatePump = $((e: Event, form: HTMLFormElement) => {
    /** Betriebsdruck in Pa */
    const pressure = readPressurePa(form, "pressure");
    /** Höhenunterschied in m */
    const height = readHeight(form, "height");
    /** Durchmesser Saugschläuche in m */
    const hose_diam = readHoseType(form, "hose-diam");
    /** Anzahl Saugschläuche */
    const hose_amt = readCount(form, "hose-amt");
    /** Länge Saugschlauch in m */
    const hose_length = readLength(form, "hose-length");
    /** Wassertemperatur in °C */
    const water_temp = readTemperature(form, "water-temp");
    /** Sicherheitsfaktor */
    const safety = readFactor(form, "safety") / 100 + 1;

    /** Dichte des Mediums */
    const rho = getDensity(water_temp);
    /** Dynamische Viskosität */
    const mu = getDynamicViscosity(water_temp);

    const verl_hoehe = rho * g * height;

    const formteil_fkt = 0;

    const dyn_pressure = pressure - verl_hoehe;

    let v1 = 1;
    let v2 = 1;
    let lambda = getPipeFrictionColebrookWhite(v2, hose_diam, k, rho, mu);

    do {
      v1 = v2;
      lambda = getPipeFrictionColebrookWhite(v1, hose_diam, k, rho, mu);
      v2 = Math.sqrt(
        dyn_pressure /
          (rho / 2 +
            (((lambda * hose_length) / hose_diam) * rho) / 2 +
            formteil_fkt / 2),
      );
    } while (Math.abs(v1 - v2) > 0.0000001);

    const v = v2;

    /** Radius SChlauchleitung */
    const r = hose_diam / 2;

    /** Querschnittsfläche Saugleitungen */
    const A = Math.pow(r, 2) * Math.PI * hose_amt;

    flow.value = (v * A * 1000 * 60) / safety;
  });

  return (
    <div class={styles.tool}>
      <h1>Druckleitungsrechner</h1>

      <p>
        Bei Kreiselpumpen kann man die Förderleistung nicht direkt an der
        Drehzahl ablesen. Dieser Rechner soll dafür eine grobe Schätzung
        abgeben.
      </p>

      <Form onSubmitCompleted$={calculatePump}>
        <PressurePaInput name="pressure" label="Betriebsdruck" />

        <hr />

        <HeightInput
          name="height"
          label="Höhenunterschied Ausgang - Eingang"
          value={0}
        />

        <hr />

        <HoseTypeInput name="hose-diam" label="Druckschlauch Typ" />

        <LengthInput
          name="hose-length"
          label="Druckschlauch Länge"
          value={100}
        />
        <CountInput name="hose-amt" label="Druckschlauch Anzahl" />

        <hr />

        <TemperatureInput name="water-temp" />
        <FactorInput name="safety" />

        <button type="submit">Berechnen</button>
      </Form>

      <div class={styles.result}>
        <div>
          <span>Aktuelle Förderleistung</span>
          <span>
            <b>{Math.max(flow.value, 0).toFixed(2)}</b> l/min
          </span>
        </div>
      </div>
    </div>
  );
});
