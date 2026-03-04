import { g } from "./values";

// https://www.tec-science.com/de/mechanik/gase-und-fluessigkeiten/bernoulli-gleichung/

/**
 * Berechnet den dynamischen Druck in Pa
 * @param rho Dichte des Fluids in kg/m³
 * @param v Strömungsgeschwindigkeit in m/s
 * @returns Dynamischer Druck in Pa
 */
export const getPdyn = (rho: number, v: number) => {
  return 0.5 * rho * Math.pow(v, 2);
};

/**
 * Berechnet den hydrostatischen Druck in Pa
 * @param rho Dichte des Fluids in kg/m³
 * @param h Höhenunterschied des Leitungssystems in m
 * @returns Hydrostatischer Druck in Pa
 */
export const getPhydrostat = (rho: number, h: number) => {
  return rho * g * h;
};
