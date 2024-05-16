import { $, component$, useSignal } from "@builder.io/qwik";
import { Form, type DocumentHead } from "@builder.io/qwik-city";
import styles from "~/styles/calculator.module.css"
import { dichte } from "~/utils/values";

export const head: DocumentHead = {
  title: "Druckleitungsrechner",
  meta: [
    {
      name: "description",
      content: "Berechnet die Leistung einer Förderstrecke anhand des Aufbaus und des Gegendrucks.",
    },
  ],
};

export default component$(() => {
  return (
    <>
      <PumpCalc />
    </>
  )
})

export const PumpCalc = component$(() => {

  const flow = useSignal<number>(0)

  const calculatePump = $((e: Event, form: HTMLFormElement) => {

    /** Betriebsdruck in Pa */
    const pressure = parseFloat((form.querySelector("input#pressure") as HTMLInputElement).value) * 100 * 1000
    /** Höhenunterschied in m */
    const height = parseInt((form.querySelector("input#height") as HTMLInputElement).value)
    /** Durchmesser Saugschläuche in m*/
    const hose_diam = parseInt((form.querySelector("select#hose-diam") as HTMLSelectElement).value) / 1000
    /** Anzahl Saugschläuche */
    const hose_amt = parseInt((form.querySelector("input#hose-amt") as HTMLInputElement).value)
    /** Länge Saugschlauch in m */
    const hose_length = parseFloat((form.querySelector("input#hose-length") as HTMLInputElement).value)
    /** Wassertemperatur in °C */
    const water_temp = parseFloat((form.querySelector("input#water-temp") as HTMLInputElement).value)

    const safety = (parseFloat((form.querySelector("input#safety") as HTMLInputElement).value) / 100) +1

    /** Dichte des Mediums */
    const rho = dichte(water_temp)
    /** Erdbeschleunigung */
    const g = 9.81
    /** Rohrreibung Gummischlauch */
    const k = 0.0016

    const verl_hoehe = rho * g * height

    const formteil_fkt = 0

    const dyn_pressure = pressure - verl_hoehe

    /** Rohrreibungskoeffitient */
    const lambda = Math.pow( 1/ (2 * Math.log10(hose_diam/k) + 1.14), 2)

    const v = Math.sqrt(dyn_pressure/(rho/2 + (lambda * hose_length/hose_diam * rho/2) + formteil_fkt/2))

    /** Radius SChlauchleitung */
    const r = hose_diam /2

    /** Querschnittsfläche Saugleitungen */
    const A = Math.pow(r, 2) * Math.PI * hose_amt

    flow.value = (v * A) * 1000 * 60 / safety

  })

  return (
    <div class={styles.tool}>

      <h1>Druckleitungsrechner</h1>

      <p>Bei Kreiselpumpen kann man die Förderleistung nicht direkt an der Drehuahl ablesen. Dieser Rechner soll dafür eine grobe Schätzung abgeben.</p>

      <Form onSubmitCompleted$={calculatePump}>

        <div>
          <label for="pressure">Betriebsdruck [bar]</label>
          <input type="number" value={1} step={0.00001} required id="pressure"/>
        </div>

        <hr />

        <div>
          <label for="height">Höhenunterschied Augang - Eingang [m]</label>
          <input type="number" value={0} step={0.01} required id="height"/>
        </div>

        <hr />

        <div>
          <label for="hose-diam">Druckschlauch Typ</label>
          <select required id="hose-diam">
            <option value={40}>Storz D (40mm)</option>
            <option value={50}>Storz C (50mm)</option>
            <option value={75}>Storz B (75mm)</option>
            <option value={110}>Storz A (110mm)</option>
            <option value={150} selected>Perrot-F (150mm)</option>
            <option value={200}>Perrot-G (200mm)</option>
          </select>
        </div>

        <div>
          <label for="hose-length">Druckschlauch Länge [m]</label>
          <input type="number" value={100} required id="hose-length"/>
        </div>

        <div>
          <label for="hose-amt">Druckschlauch Anzahl [stk]</label>
          <input type="number" value={1} required id="hose-amt"/>
        </div>

        <hr />

        <div>
          <label for="water-temp">Wassertemperatur [°C]</label>
          <input type="number" value={20} step={0.01} required id="water-temp"/>
        </div>

        <div>
          <label for="safety">Sicherheitsfaktor [%]</label>
          <input type="number" value={20} min={0} max={100} required id="safety"/>
        </div>

        <button type="submit">Berechnen</button>
      </Form>

      <div class={styles.result}>
        <div>
          <span>Aktuelle Förderleistung</span>
          <span><b>{Math.max(flow.value, 0).toFixed(2)}</b> l/min</span>
        </div>
      </div>

    </div>
  )
})