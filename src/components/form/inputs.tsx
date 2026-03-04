/**
 * Vorgefertigte Input-Komponenten für häufig verwendete physikalische Größen.
 * Jede Komponente kapselt ihre Einheiten-Definitionen und bietet eine
 * passende `readXxx()` Funktion zum Auslesen des SI-Werts.
 */
import { component$ } from "@builder.io/qwik";
import { UnitInput, readUnitInput, type UnitDef } from "./unit-input";
import styles from "~/styles/calculator.module.css";

// ─── Einheiten-Definitionen ────────────────────────────────────────────

/** Durchfluss → Basiseinheit: m³/s */
export const FLOW_UNITS: UnitDef[] = [
  { label: "l/min", value: "l_min", factor: 1 / 60000, default: true },
  { label: "l/s", value: "l_s", factor: 1 / 1000 },
  { label: "l/h", value: "l_h", factor: 1 / 3600000 },
  { label: "m³/h", value: "m3_h", factor: 1 / 3600 },
  { label: "m³/s", value: "m3_s", factor: 1 },
  { label: "GPM", value: "gal_min", factor: 0.00378541 / 60 },
];

/** Druck → Basiseinheit: Pa */
export const PRESSURE_PA_UNITS: UnitDef[] = [
  { label: "bar", value: "bar", factor: 100000, default: true },
  { label: "mbar", value: "mbar", factor: 100 },
  { label: "hPa", value: "hPa", factor: 100 },
  { label: "Pa", value: "Pa", factor: 1 },
];

/** Druck → Basiseinheit: mWs (für Hazen-Williams) */
export const PRESSURE_MWS_UNITS: UnitDef[] = [
  { label: "bar", value: "bar", factor: 9.80665, default: true },
  { label: "mWs", value: "mWs", factor: 1 },
];

/** Länge → Basiseinheit: m */
export const LENGTH_UNITS: UnitDef[] = [
  { label: "m", value: "m", factor: 1, default: true },
  { label: "cm", value: "cm", factor: 0.01 },
  { label: "km", value: "km", factor: 1000 },
];

/** Durchmesser → Basiseinheit: m */
export const DIAMETER_UNITS: UnitDef[] = [
  { label: "mm", value: "mm", factor: 0.001, default: true },
  { label: "cm", value: "cm", factor: 0.01 },
  { label: "m", value: "m", factor: 1 },
];

/** Höhe/Elevation → Basiseinheit: m */
export const HEIGHT_UNITS: UnitDef[] = [
  { label: "m", value: "m", factor: 1, default: true },
  { label: "cm", value: "cm", factor: 0.01 },
];

/** Temperatur → Basiseinheit: °C (keine Umrechnung) */
export const TEMPERATURE_UNITS: UnitDef[] = [
  { label: "°C", value: "C", factor: 1, default: true },
];

/** Faktor/Prozent → Basiseinheit: Rohwert (%) */
export const FACTOR_UNITS: UnitDef[] = [
  { label: "%", value: "pct", factor: 1, default: true },
];

/** Anzahl → Basiseinheit: Stück */
export const COUNT_UNITS: UnitDef[] = [
  { label: "Stk.", value: "stk", factor: 1, default: true },
];

// ─── Komponenten ────────────────────────────────────────────────────────

interface SpecializedInputProps {
  name: string;
  label?: string;
  value?: number;
  step?: number;
  required?: boolean;
  min?: number;
  max?: number;
}

/** Durchfluss-Input (Basiseinheit: m³/s) */
export const FlowInput = component$<SpecializedInputProps>((props) => (
  <UnitInput
    name={props.name}
    label={props.label ?? "Fördermenge"}
    units={FLOW_UNITS}
    value={props.value ?? 5000}
    step={props.step}
    required={props.required ?? true}
  />
));

/** Druck-Input mit Ausgabe in Pa (für Colebrook-White Rechner) */
export const PressurePaInput = component$<SpecializedInputProps>((props) => (
  <UnitInput
    name={props.name}
    label={props.label ?? "Druck"}
    units={PRESSURE_PA_UNITS}
    value={props.value ?? 1}
    step={props.step ?? 0.00001}
    required={props.required ?? true}
  />
));

/** Druck-Input mit Ausgabe in mWs (für Hazen-Williams Rechner) */
export const PressureMWsInput = component$<SpecializedInputProps>((props) => (
  <UnitInput
    name={props.name}
    label={props.label ?? "Pumpendruck"}
    units={PRESSURE_MWS_UNITS}
    value={props.value ?? 2}
    step={props.step ?? 0.1}
    required={props.required ?? true}
  />
));

/** Länge-Input (Basiseinheit: m) */
export const LengthInput = component$<SpecializedInputProps>((props) => (
  <UnitInput
    name={props.name}
    label={props.label ?? "Länge"}
    units={LENGTH_UNITS}
    value={props.value ?? 50}
    step={props.step}
    required={props.required ?? true}
  />
));

/** Durchmesser-Input (Basiseinheit: m) */
export const DiameterInput = component$<SpecializedInputProps>((props) => (
  <UnitInput
    name={props.name}
    label={props.label ?? "Leitungsdurchmesser"}
    units={DIAMETER_UNITS}
    value={props.value ?? 150}
    step={props.step ?? 0.1}
    required={props.required ?? true}
  />
));

/** Höhe/Elevation-Input (Basiseinheit: m) */
export const HeightInput = component$<SpecializedInputProps>((props) => (
  <UnitInput
    name={props.name}
    label={props.label ?? "Förderhöhe"}
    units={HEIGHT_UNITS}
    value={props.value ?? 15}
    step={props.step ?? 0.01}
    required={props.required}
  />
));

/** Temperatur-Input (°C, feste Einheit) */
export const TemperatureInput = component$<SpecializedInputProps>((props) => (
  <UnitInput
    name={props.name}
    label={props.label ?? "Wassertemperatur"}
    units={TEMPERATURE_UNITS}
    value={props.value ?? 15}
    step={props.step ?? 0.01}
    required={props.required ?? true}
  />
));

/** Sicherheitsfaktor-Input (%, feste Einheit) */
export const FactorInput = component$<SpecializedInputProps>((props) => (
  <UnitInput
    name={props.name}
    label={props.label ?? "Sicherheitsfaktor"}
    units={FACTOR_UNITS}
    value={props.value ?? 20}
    step={props.step}
    required={props.required ?? true}
    min={props.min ?? 0}
    max={props.max ?? 100}
  />
));

/** Anzahl-Input (Stk., feste Einheit) */
export const CountInput = component$<SpecializedInputProps>((props) => (
  <UnitInput
    name={props.name}
    label={props.label ?? "Anzahl"}
    units={COUNT_UNITS}
    value={props.value ?? 1}
    step={props.step ?? 1}
    required={props.required ?? true}
    min={props.min ?? 1}
  />
));

// ─── Read-Hilfsfunktionen ───────────────────────────────────────────────

/** Liest Durchfluss in m³/s */
export function readFlow(form: HTMLFormElement, name: string): number {
  return readUnitInput(form, name, FLOW_UNITS);
}

/** Liest Druck in Pa */
export function readPressurePa(form: HTMLFormElement, name: string): number {
  return readUnitInput(form, name, PRESSURE_PA_UNITS);
}

/** Liest Druck in mWs */
export function readPressureMWs(form: HTMLFormElement, name: string): number {
  return readUnitInput(form, name, PRESSURE_MWS_UNITS);
}

/** Liest Länge in m */
export function readLength(form: HTMLFormElement, name: string): number {
  return readUnitInput(form, name, LENGTH_UNITS);
}

/** Liest Durchmesser in m */
export function readDiameter(form: HTMLFormElement, name: string): number {
  return readUnitInput(form, name, DIAMETER_UNITS);
}

/** Liest Höhe in m */
export function readHeight(form: HTMLFormElement, name: string): number {
  return readUnitInput(form, name, HEIGHT_UNITS);
}

/** Liest Temperatur in °C */
export function readTemperature(form: HTMLFormElement, name: string): number {
  return readUnitInput(form, name, TEMPERATURE_UNITS);
}

/** Liest Faktor (Rohwert in %) */
export function readFactor(form: HTMLFormElement, name: string): number {
  return readUnitInput(form, name, FACTOR_UNITS);
}

/** Liest Anzahl */
export function readCount(form: HTMLFormElement, name: string): number {
  return readUnitInput(form, name, COUNT_UNITS);
}

// ─── Select-only Komponenten ────────────────────────────────────────────

interface SelectInputProps {
  name: string;
  label?: string;
}

/** Schlauchtyp-Auswahl – gibt Durchmesser in mm als value zurück */
export const HoseTypeInput = component$<SelectInputProps>((props) => (
  <div>
    <label for={props.name}>{props.label ?? "Schlauch Typ"}</label>
    <div class={styles.selectInput}>
      <select required id={props.name} name={props.name}>
        <option value={40}>D (40mm)</option>
        <option value={50}>C (50mm)</option>
        <option value={75}>B (75mm)</option>
        <option value={110}>A (110mm)</option>
        <option value={150} selected>F (150mm)</option>
        <option value={200}>G (200mm)</option>
      </select>
    </div>
  </div>
));

/** Liest Schlauch-Durchmesser in m */
export function readHoseType(form: HTMLFormElement, name: string): number {
  const select = form.querySelector(`#${name}`) as HTMLSelectElement;
  return parseInt(select.value) / 1000;
}

/** Leitungsmaterial-Auswahl (für Hazen-Williams Rechner) */
export const PipeMaterialInput = component$<SelectInputProps>((props) => (
  <div>
    <label for={props.name}>{props.label ?? "Leitungsmaterial"}</label>
    <div class={styles.selectInput}>
      <select id={props.name} name={props.name} required>
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
));

/** Liest Leitungsmaterial als String */
export function readPipeMaterial(form: HTMLFormElement, name: string): string {
  const select = form.querySelector(`#${name}`) as HTMLSelectElement;
  return select.value;
}
