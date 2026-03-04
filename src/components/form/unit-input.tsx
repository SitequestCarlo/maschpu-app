import { component$ } from "@builder.io/qwik";
import styles from "~/styles/calculator.module.css";

/**
 * Definition einer Einheit mit Umrechnungsfaktor.
 * `factor` rechnet den Eingabewert in die Basiseinheit (SI) um:
 * SI-Wert = Eingabewert × factor
 */
export interface UnitDef {
  /** Anzeige-Label (z.B. "l/min", "bar", "mm") */
  label: string;
  /** Wert für das select-Element */
  value: string;
  /** Umrechnungsfaktor zur Basiseinheit */
  factor: number;
  /** Ist dies die Standard-Einheit? */
  default?: boolean;
}

export interface UnitInputProps {
  /** Eindeutiger Name – wird als id/name für input und select verwendet */
  name: string;
  /** Beschriftung des Feldes */
  label: string;
  /** Verfügbare Einheiten */
  units: UnitDef[];
  /** Standard-Eingabewert (in der Standard-Einheit) */
  value?: number;
  /** Schritt-Wert für number-Input */
  step?: number;
  /** Pflichtfeld? */
  required?: boolean;
  /** Minimum */
  min?: number;
  /** Maximum */
  max?: number;
}

/**
 * Basis-Input-Komponente mit Einheiten-Select.
 *
 * Rendert `<input type="number">` + `<select>` für die Einheit.
 * Zum Auslesen des SI-Werts im Submit-Handler: `readUnitInput(form, name, units)`
 */
export const UnitInput = component$<UnitInputProps>((props) => {
  const defaultUnit = props.units.find((u) => u.default) ?? props.units[0];
  const hasMultipleUnits = props.units.length > 1;

  return (
    <div>
      <label for={props.name}>{props.label}</label>
      <div class={styles.unitInput}>
        <input
          type="number"
          id={props.name}
          name={props.name}
          value={props.value}
          step={props.step}
          min={props.min}
          max={props.max}
          required={props.required}
        />
        <select
          id={`${props.name}_unit`}
          name={`${props.name}_unit`}
          aria-label={`Einheit ${props.label}`}
          disabled={!hasMultipleUnits}
        >
          {props.units.map((unit) => (
            <option
              key={unit.value}
              value={unit.value}
              selected={unit.value === defaultUnit.value}
            >
              {unit.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});

/**
 * Liest den in die Basiseinheit umgerechneten Wert aus dem Formular.
 */
export function readUnitInput(
  form: HTMLFormElement,
  name: string,
  units: UnitDef[],
): number {
  const input = form.querySelector(`#${name}`) as HTMLInputElement;
  const select = form.querySelector(`#${name}_unit`) as HTMLSelectElement;

  const rawValue = parseFloat(input.value);
  const selectedUnit =
    units.find((u) => u.value === select.value) ?? units[0];
  return rawValue * selectedUnit.factor;
}
