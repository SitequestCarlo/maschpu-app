import { $, component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, Form } from "@builder.io/qwik-city";
import styles from "~/styles/calculator.module.css"
import { getPipeFrictionColebrookWhite } from "~/utils/reibung";
import { getDensity, getDynamicViscosity, getVaporPressure } from "~/utils/values";
import {
  FlowInput, readFlow,
  LengthInput, readLength,
  PressurePaInput, readPressurePa,
  TemperatureInput, readTemperature,
  FactorInput, readFactor,
  CountInput, readCount,
  HoseTypeInput, readHoseType,
} from "~/components/form/inputs";

export const head: DocumentHead = {
  title: "Saughöhenrechner",
  meta: [
    {
      name: "description",
      content: "Berechnet die maximal mögliche geodätische und manomatrische Saughöhe anhand verschiedener Parameter.",
    },
  ],
};

export default component$(() => {
  return (
  <>
    <HeightCalc />
  </>
  )
}) 


export const HeightCalc = component$(() => {

  const geodaet = useSignal<number>(0)
  const manometr = useSignal<number>(0)
  const verlReib = useSignal<number>(0)
  const verlDampf = useSignal<number>(0)
  const verlDyn = useSignal<number>(0)

  const calcHeight = $((e: Event, form: HTMLFormElement) => {

    /** Erdbeschleunigung */
    const g = 9.81

    /** Rohrreibung Gummischlauch */
    const k = 0.0016

    /** Durchflussmenge in m³/s */
    const flow = readFlow(form, "flow")
    /** Durchmesser Saugschläuche in m */
    const hose_diam = readHoseType(form, "hose-diam")
    /** Anzahl Saugschläuche */
    const hose_amt = readCount(form, "hose-amt")
    /** Länge Saugschlauch in m */
    const hose_length = readLength(form, "hose-length")
    /** Luftdruck in Pa */
    const air_p = readPressurePa(form, "air-p")
    /** Wassertemperatur in °C */
    const water_temp = readTemperature(form, "water-temp")
    /** Sicherheitsfaktor */
    const safety = (readFactor(form, "safety") / 100) + 1

    /** Fluiddichte */
    const rho = getDensity(water_temp)

    /** Dynamische Viskosität */
    const mu = getDynamicViscosity(water_temp)

    /** Dampfdruck */
    const dampfdruck = getVaporPressure(water_temp)

    const max_geodaet = air_p / (rho*g)
    geodaet.value = max_geodaet

    /** Verluste aus Dampfdruck */
    const verl_dampfdruck = (dampfdruck / (rho*g)) * safety
    verlDampf.value = verl_dampfdruck

    /** Radius SChlauchleitung */
    const r = hose_diam /2

    /** Querschnittsfläche Saugleitungen */
    const A = Math.pow(r, 2) * Math.PI * hose_amt

    /** Fließgeschwindigkeit in m/s */
    const v = flow / A

    /** Verluste aus Dynamischem Druck */
    const verl_dynamisch = (((1/2) * rho * Math.pow(v, 2)) / (rho*g)) * safety
    verlDyn.value = verl_dynamisch

    /** Reynolds-Zahl */
/*     const reynolds = hose_diam * v * rho / dyn_visk */

    /** Rohrreibungskoeffitient */
    const lambda = getPipeFrictionColebrookWhite(v, hose_diam, k, rho, mu)
        
    /* Nikuradse? Math.pow(1/ (-2 * Math.log10(k / (3.71 * hose_diam))), 2) */

    /** Verluste aus Reibung */
    const verl_reibung = (lambda * (hose_length/hose_diam) * (rho/2) * Math.pow(v, 2) / (rho*g)) * safety
    verlReib.value = verl_reibung

    manometr.value = max_geodaet - verl_dampfdruck - verl_dynamisch - verl_reibung
  })

  return (
  <div class={styles.tool}>

    <h1>Saughöhenrechner</h1>

    <p>Wie hoch eine Pumpe ansaugen kann, hängt von vielen Faktoren ab. Mit diesem Rechner kann man sich eine grobe Einschätzung abholen.</p>

    <Form onSubmitCompleted$={calcHeight}>
      <FlowInput name="flow" label="Pumpleistung" />

      <hr />

      <HoseTypeInput name="hose-diam" label="Saugschlauch Typ" />

      <LengthInput name="hose-length" label="Saugschlauch Länge" value={9} />
      <CountInput name="hose-amt" label="Saugschlauch Anzahl" value={2} />

      <hr />

      <PressurePaInput name="air-p" label="Umgebungsdruck" value={1.01325} />
      <TemperatureInput name="water-temp" />
      <FactorInput name="safety" />

      <hr />

      <button type="submit">Berechnen</button>
    </Form>

    <div class={styles.result}>

      <div>
        <span>Max. Geodätische Saughöhe</span>
        <span><b>{Math.max(geodaet.value, 0).toFixed(2)}</b> m</span>
      </div>

      <div>
        <span>Max. Manometrische Saughöhe</span>
        <span><b>{Math.max(manometr.value, 0).toFixed(2)}</b> m</span>
      </div>

      <hr />
      
      <div>
        <span>Verluste durch Dampfdruck</span>
        <span><b>{Math.max(verlDampf.value,0).toFixed(2)}</b> m</span>
      </div>

      <div>
        <span>Verluste durch Reibung</span>
        <span><b>{Math.max(verlReib.value + verlDyn.value, 0).toFixed(2)}</b> m</span>
      </div>
    </div>

  </div>
  )
})
