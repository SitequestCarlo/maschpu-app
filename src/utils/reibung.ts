
/**
 * Berechnet den Druckverlust durch Reibung in einer laminaren Strömung
 * @param v Strömungsgeschwindigkeit in m/s
 * @param d Durchmesser der Leitung in m
 * @param l Länge der Leitung in m
 * @param mu dynamische Viskosität in Pa*s
 * @returns Druckverlust durch Reibung in Pa
 */
export const getPfrictionLaminar = (v: number, d: number, l: number, mu: number) => {
  return 32 * mu * l * v / Math.pow(d, 2)
}

/**
 * Berechnet die Reynolds-Zahl
 * @param v Strömungsgeschwindigkeit in m/s
 * @param d Durchmesser der Leitung in m
 * @param mu dynamische Viskosität in Pa*s
 * @param rho Dichte des Fluids in kg/m³
 * @returns Reynlodszahl
 */
export const getReynolds = (v: number, d: number, mu: number, rho: number) => {
  return v * d * rho / mu
}

/**
 * Berechnet die Rohrreibungszahl bei laminarer Strömung
 * @param v Strömungsgeschwindigkeit in m/s
 * @param d Durchmesser der Leitung in m
 * @param mu dynamische Viskosität in Pa*s
 * @param rho Dichte des Fluids in kg/m³
 * @returns Rohrreibungszahl bei Laminarer Strömung
 */
export const getPipeDrictionLaminar = (v: number, d: number, mu: number, rho: number) => {
  return 64 / getReynolds(v, d, mu, rho)
}

/**
 * Berechnet den Druckverlust durch Reibung in einer turbulenten Strömung
 * @param v Strömungsgeschwindigkeit in m/s
 * @param d Durchmesser der Leitung in m
 * @param l Länge der Leitung in m
 * @param k Rohrreibungszahl
 * @param rho Dichte des Fluids in kg/m³
 * @returns Druckverlust durch Reibung in Pa
 */
export const getPfrictionTurbulent = (v: number, d: number, l: number, k: number, rho: number) => {
  return k * rho * Math.pow(v, 2) * l / d
}

/**
 * Berechnet die relative Rauheit
 * @param k absoluter Rauheitswert in m
 * @param d Durchmesser der Leitung in m
 * @returns relativer Rauheitswert
 */
export const getRelativeRoughness = (k: number, d: number) => {
  return k / d
}

/**
 * Implizite Colebrook-White-Gleichung zur Berechnung der Rohrreibungszahl
 * @param v Strömungsgeschwindigkeit in m/s
 * @param d Durchmesser der Leitung in m
 * @param k absoluter Rauheitswert in m
 * @param rho Dichte des Fluids in kg/m³
 * @param mu dynamische Viskosität in Pa*s
 * @returns Rohrreibungszahl lambda
 */
export const getPipeFrictionColebrookWhite = (v: number, d: number, k: number, rho: number, mu: number) => {
  let k1 = 100
  let k2 = 100

  do {
    const reyn = getReynolds(v, d, mu, rho) 
    const rough = getRelativeRoughness(k, d)

    k1 = k2
    k2 =  1 / (-2 * Math.log10((2.51 / reyn) * k1 + (rough / 3.71)))
  } while (Math.abs(k1 - k2) > 0.00000001)
  return Math.pow(k2, 2)
}