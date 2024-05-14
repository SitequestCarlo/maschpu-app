import { $, component$, useSignal } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import styles from "~/styles/calculator.module.css"

export default component$(() => {
  return (
  <>
    <HeightCalc />
  </>
  )
}) 

const dampfdruckPa = (temp: number) => {
  const values = [6.1115, 6.5709, 7.0599, 7.5808, 8.1355, 8.7258, 9.3536, 10.021, 10.730, 11,483, 12.282, 13.130, 14.028, 15.990, 17.058, 18.188, 19.384, 20.647, 21.983, 23.292, 24.882, 26.453, 28.111, 29.858, 31.699]
  return values[temp] * 100
}

const dichte = (temp: number) => {
  const values = [999.843, 999.907, 999.946, 999.969, 999.975, 999.965, 999.940, 999.900, 999.845, 999.776, 999.694, 999.598, 999.489, 999.367, 999.233, 999.087, 998.930, 998.761, 998.580, 998.389, 998.186, 998.186, 997.974, 997.751, 997.518, 997.275, 997.022]
  return values[temp]
}

// https://www.schweizer-fn.de/stroemung/druckverlust/druckverlust.php


export const HeightCalc = component$(() => {

  const geodaet = useSignal<number>(0)
  const manometr = useSignal<number>(0)
  const verlReib = useSignal<number>(0)
  const verlDampf = useSignal<number>(0)
  const verlDyn = useSignal<number>(0)

  const calcHeight = $((e: Event, form: HTMLFormElement) => {

    /** Erdbeschleunigung */
    const g = 9.81

    /** Dynamische Viskosität */
/*     const dyn_visk = 0.001308 */

    /** Rohrreibung Gummischlauch */
    const k = 0.0016

    /** Durchflussmenge m³/S */
    const flow = parseFloat((form.querySelector("input#flow") as HTMLInputElement).value) / 60000
    /** Durchmesser Saugschläuche in m*/
    const hose_diam = parseInt((form.querySelector("select#hose-diam") as HTMLSelectElement).value) / 1000
    /** Anzahl Saugschläuche */
    const hose_amt = parseInt((form.querySelector("input#hose-amt") as HTMLInputElement).value)
    /** Länge Saugschlauch in m */
    const hose_length = parseFloat((form.querySelector("input#hose-length") as HTMLInputElement).value)
    /** Luftdruck in Pa */
    const air_p = parseFloat((form.querySelector("input#air-p") as HTMLInputElement).value) * 100
    /** Wassertemperatur in °C */
    const water_temp = parseFloat((form.querySelector("input#water-temp") as HTMLInputElement).value)

    const safety = (parseFloat((form.querySelector("input#safety") as HTMLInputElement).value) / 100) +1

    /** Fluiddichte */
    const rho = dichte(water_temp)

    /** Dampfdruck */
    const dampfdruck = dampfdruckPa(water_temp)

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
    const lambda = Math.pow( 1/ (2 * Math.log10(hose_diam/k) + 1.14), 2)
    
    /* 0.3164/reynolds */ 
    
    /* Nikradse? Math.pow(1/ (-2 * Math.log10(k / (3.71 * hose_diam))), 2) */

    /** Verluste aus Reibung */
    const verl_reibung = (lambda * (hose_length/hose_diam) * (rho/2) * Math.pow(v, 2) / (rho*g)) * safety
    verlReib.value = verl_reibung

    manometr.value = max_geodaet - verl_dampfdruck - verl_dynamisch - verl_reibung
  })

  return (
  <div class={styles.tool}>

    <h1>Saughöhenrechner</h1>

    <Form onSubmitCompleted$={calcHeight}>
      <div>
        <label for="flow">Pumpleistung [l/min]</label>
        <input type="number" value={5000} required id="flow"/>
      </div>

      <hr />

      <div>
        <label for="hose-diam">Saugschauch Typ</label>
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
        <label for="hose-length">Saugschlauch Länge [m]</label>
        <input type="number" value={9} required id="hose-length"/>
      </div>

      <div>
        <label for="hose-amt">Saugschlauch Anzahl [stk]</label>
        <input type="number" value={2} required id="hose-amt"/>
      </div>

      <hr />

      <div>
        <label for="air-p">Umgebungsdruck [hPa]</label>
        <input type="number" value={1013.25} required id="air-p"/>
      </div>

      <div>
        <label for="water-temp">Wassertemperatur [°C]</label>
        <input type="number" value={20} required id="water-temp"/>
      </div>

      <div>
        <label for="safety">Sicherheitsfaktor [%]</label>
        <input type="number" value={20} min={0} max={100} required id="safety"/>
      </div>

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