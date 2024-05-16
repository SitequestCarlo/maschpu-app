import { $, component$, useSignal } from "@builder.io/qwik";
import { type DocumentHead, Form } from "@builder.io/qwik-city";
import styles from "~/styles/calculator.module.css"

export const head: DocumentHead = {
  title: "Fördermendenumrechner",
  meta: [
    {
      name: "description",
      content: "Wandelt Fördermengen von einer Einheit in andere um.",
    },
  ],
};

export default component$(() => {
  return (
    <>
      <FlowCalc />
    </>
  )
})

enum FlowUnit {
  LITERS_SECOND,
  LITERS_MINUTE,
  LITERS_HOUR,
  CUBIC_SECOND,
  CUBIC_MINUTE,
  CUBIC_HOUR
}

export const FlowCalc = component$(() => {
  const m3h = useSignal<number>(0)

  const calcFlow = $((e: Event, form: HTMLFormElement) => {
      /** Durchflussmenge */
      const flow = parseFloat((form.querySelector("input#flow") as HTMLInputElement).value)
      /** Durchflusseinheit */
      const unit = parseInt((form.querySelector("select#unit") as HTMLSelectElement).value) as FlowUnit

      switch(unit) {
        case FlowUnit.LITERS_SECOND:
          m3h.value = flow / 1000 * 60 * 60
          break;
        case FlowUnit.LITERS_MINUTE:
          m3h.value = flow / 1000 * 60
          break;
        case FlowUnit.LITERS_HOUR:
          m3h.value = flow / 1000
          break;
        case FlowUnit.CUBIC_SECOND:
          m3h.value = flow * 60 * 60
          break;
        case FlowUnit.CUBIC_MINUTE:
          m3h.value = flow * 60
          break;
        case FlowUnit.CUBIC_HOUR:
          m3h.value = flow
          break;
      }
  })

  return (
    <div class={styles.tool}>

      <h1>Fördermengenumrechner</h1>

      <p>Klärwerke und andere Stellen der Abwasserwirschaft rechnen oft nicht in l/min. Mit diesem Rechner lassen sich die Werte in alle relevanten Einheiten umrechnen.</p>

      <Form onSubmitCompleted$={calcFlow}>

        <div>
          <label for="flow">Duchflussmenge</label>
          <input type="number" value={1000} required id="flow"/>
        </div>

        <div>
          <label for="unit">Durchflusseinheit</label>
          <select required id="unit">
            <optgroup label="Liter">
              <option value={FlowUnit.LITERS_SECOND}>l/s (Liter/Sekunde)</option>
              <option value={FlowUnit.LITERS_MINUTE} selected>l/min (Liter/Minute)</option>
              <option value={FlowUnit.LITERS_HOUR}>l/h (Liter/Stunde)</option>
            </optgroup>

            <optgroup label="Kubikmeter">
              <option value={FlowUnit.CUBIC_SECOND}>m³/s (Kubikmeter/Sekunde)</option>
              <option value={FlowUnit.CUBIC_MINUTE}>m³/min (Kubikmeter/Minute)</option>
              <option value={FlowUnit.CUBIC_HOUR}>m³/h (Kubikmeter/Stunde)</option>
            </optgroup>
          </select>
        </div>

        <hr />

        <button type="submit">Berechnen</button>

      </Form>

      <div class={styles.result}>

        <div>
          <span>l/s (Liter/Sekunde)</span>
          <span><b>{Math.max(m3h.value*1000/60/60, 0).toFixed(2)}</b> l/s</span>
        </div>

        <div>
          <span>l/min (Liter/Minute)</span>
          <span><b>{Math.max(m3h.value*1000/60, 0).toFixed(2)}</b> l/min</span>
        </div>

        <div>
          <span>l/h (Liter/Stunde)</span>
          <span><b>{Math.max(m3h.value*1000, 0).toFixed(2)}</b> l/h</span>
        </div>

        <hr />

        <div>
          <span>m³/s (Kubikmeter/Sekunde)</span>
          <span><b>{Math.max(m3h.value/60/60, 0).toFixed(2)}</b> m³/s</span>
        </div>

        <div>
          <span>m³/min (Kubikmeter/Minute)</span>
          <span><b>{Math.max(m3h.value/60, 0).toFixed(2)}</b> m³/min</span>
        </div>

        <div>
          <span>m³/h (Kubikmeter/Stunde)</span>
          <span><b>{Math.max(m3h.value, 0).toFixed(2)}</b> m³/h</span>
        </div>

      </div>

    </div>
  )
})
