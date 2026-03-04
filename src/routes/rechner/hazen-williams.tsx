/*
 * 3-Buchstaben-Codes für die Materialien
 * acm: Asbestzement
 * cin: Gusseisen
 * ci10: Gusseisen 10 Jahre
 * ci20: Gusseisen 20 Jahre
 * cmc: Zementmörtel-ausgekleidetes duktiles Gusseisenrohr
 * con: Beton
 * cpr: Kupfer
 * stl: Stahl
 * gir: Verzinktes Eisen
 * peh: Polyethylen
 * pvc: Polyvinylchlorid
 * frp: Glasfaserverstärkter Kunststoff
 */
export type PipeMaterial =
  | "acm"
  | "cin"
  | "cmc"
  | "con"
  | "cpr"
  | "stl"
  | "gir"
  | "hdpe"
  | "pvc"
  | "frp"
  | "rub"
  | "hdpe";

/*
 * Hilfsfunktion zur Rückgabe des Hazen-Williams-Koeffizienten basierend auf dem Rohrmaterial
 * @param material - Das Material des Rohrs
 * @returns Der Hazen-Williams-Koeffizient für das angegebene Material
 */
export function getHazenWilliamsCoefficient(material: PipeMaterial): number {
  switch (material) {
    case "acm":
      return 130; // Asbestzement
    case "cin":
      return 130; // Gusseisen
    case "cmc":
      return 140; // Zementmörtel-ausgekleidetes duktiles Gusseisenrohr
    case "con":
      return 140; // Beton
    case "cpr":
      return 135; // Kupfer
    case "stl":
      return 100; // Stahl
    case "gir":
      return 120; // Verzinktes Eisen
    case "hdpe":
      return 150; // Hochverdichtetes Polyethylen
    case "pvc":
      return 150; // Polyvinylchlorid
    case "frp":
      return 150; // Glasfaserverstärkter Kunststoff
    case "rub":
      return 150; // Gummi
    default:
      throw new Error("Unknown pipe material");
  }
}

export function getRequirerdPumpHead(
  flowRate: number, // Durchflussrate in m³/s
  diameter: number, // Rohrdurchmesser in m
  material: PipeMaterial, // Rohrmaterial
  length: number, // Rohrlänge in m
  elevation: number = 0, // Höhenunterschied in m (optional, Standard ist 0 für horizontale Rohre)
) {
  // Rohrrauheitskoeffizient
  const nC = getHazenWilliamsCoefficient(material);
  const nQ = flowRate;
  const nD = diameter;
  const nL = length;
  const nE = elevation;

  // Berechnung des erforderlichen Pumpendrucks in mWs
  const requiredPumpHead =
    nE / 1 +
    ((0.002083 * Math.pow(100 / nC, 1.852) * Math.pow(nQ, 1.852)) /
      Math.pow(nD, 4.8704)) *
      nL;
  return requiredPumpHead;
}

export function getMaxPipeLength(
  flowRate: number, // Durchflussrate in m³/s
  diameter: number, // Rohrdurchmesser in m
  material: PipeMaterial, // Rohrmaterial
  pumpHead: number, // Pumpendruck in mWs
  elevation: number = 0, // Höhenunterschied in m (optional, Standard ist 0 für horizontale Rohre)
) {
  // Rohrrauheitskoeffizient
  const nC = getHazenWilliamsCoefficient(material);
  const nQ = flowRate;
  const nD = diameter;
  const nH = pumpHead;
  const nE = elevation;

  // Berechnung der maximalen Rohrlänge in m
  const maxLength =
    (nH - nE / 1) /
    ((0.002083 * Math.pow(100 / nC, 1.852) * Math.pow(nQ, 1.852)) /
      Math.pow(nD, 4.8704));
  return maxLength;
}

export function getMaxFlowRate(
  pumpHead: number, // Pumpendruck in mWs
  diameter: number, // Rohrdurchmesser in m
  material: PipeMaterial, // Rohrmaterial
  length: number, // Rohrlänge in m
  elevation: number = 0, // Höhenunterschied in m (optional, Standard ist 0 für horizontale Rohre)
) {
  // Rohrrauheitskoeffizient
  const nC = getHazenWilliamsCoefficient(material);
  const nD = diameter;
  const nL = length;
  const nE = elevation;
  const nH = pumpHead;

  // Berechnung der maximalen Durchflussrate in m³/s
  const maxFlowRate = Math.pow(
    ((nH - nE / 1) * Math.pow(nD, 4.8704)) /
      (0.002083 * Math.pow(100 / nC, 1.852) * nL),
    1 / 1.852,
  );
  return maxFlowRate;
}

export function getMinDiameter(
  flowRate: number, // Durchflussrate in m³/s
  pumpHead: number, // Pumpendruck in mWs
  material: PipeMaterial, // Rohrmaterial
  length: number, // Rohrlänge in m
  elevation: number = 0, // Höhenunterschied in m (optional, Standard ist 0 für horizontale Rohre
) {
  // Rohrrauheitskoeffizient
  const nC = getHazenWilliamsCoefficient(material);
  const nQ = flowRate;
  const nH = pumpHead;
  const nL = length;
  const nE = elevation;

  // Berechnung des minimalen Rohrdurchmessers in m
  const minDiameter = Math.pow(
    (0.002083 * Math.pow(100 / nC, 1.852) * nL * Math.pow(nQ, 1.852)) /
      (nH - nE / 1),
    0.2055,
  );
  return minDiameter;
}
