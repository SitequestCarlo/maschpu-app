// First section

export function validateRequiredPumpPressure(
  input: HTMLInputElement,
  min: number,
  max: number,
  label: string,
): boolean {
  const message = `${label} has an invalid value: ${input.value}`;
  const str = input.value;
  for (let i = 0; i < str.length; i++) {
    const ch = str.substring(i, i + 1);
    if ((ch < "0" || "9" < ch) && ch !== ".") {
      alert(message);
      return false;
    }
  }
  const num = Number(str);
  if (num < min || max < num) {
    alert(`${message} is out of range [${min}..${max}]`);
    return false;
  }
  input.value = str;
  return true;
}

export function calculateRequiredPumpPressure(input: HTMLInputElement): void {
  let value: number | undefined;
  if (input.value.length !== 0) value = parseFloat(input.value);
  if (!isNaN(value as number)) {
    input.value = String(value);
    showRequiredPumpPressureResult(input.form as HTMLFormElement);
  } else {
    input.value = "";
  }
}

export function showRequiredPumpPressureResult(form: HTMLFormElement): void {
  if (
    form.nFlow.value == null ||
    form.nFlow.value.length === 0 ||
    form.nDiam.value == null ||
    form.nDiam.value.length === 0 ||
    form.nLen.value == null ||
    form.nLen.value.length === 0 ||
    form.nElv.value == null ||
    form.nElv.value.length === 0
  ) {
    return;
  }
  if (
    !validateRequiredPumpPressure(form.nFlow, 0, 9999999, "Capacity") ||
    !validateRequiredPumpPressure(form.nDiam, 0, 9999, "Diameter") ||
    !validateRequiredPumpPressure(form.nLen, 0, 999999, "Length") ||
    !validateRequiredPumpPressure(form.nElv, 0, 999999, "Elevation")
  ) {
    form.nKW.value = "Invalid";
    return;
  }
  const unitQIndex = form.cUnitQ.options.selectedIndex;
  const unitQArray = [0, 1 / 3.6, 1 / 60, 1, 1 / 15.852];
  const nConQ = unitQArray[unitQIndex + 1];
  const unitDIndex = form.cUnitD.options.selectedIndex;
  const unitDArray = [0, 25.4, 1];
  const nConD = unitDArray[unitDIndex + 1];
  const pipeIndex = form.cPipe.options.selectedIndex;
  const pipeArray = [0, 145, 150, 135, 125];
  const nHazen = pipeArray[pipeIndex + 1];
  const nQ = form.nFlow.value * nConQ * 15.852; // US gpm
  const nD = (form.nDiam.value * nConD) / 25.4; // inches
  const nL = form.nLen.value; // m
  const nE = form.nElv.value; // m
  const num =
    nE / 1 +
    ((0.002083 * Math.pow(100 / nHazen, 1.85) * Math.pow(nQ, 1.85)) /
      Math.pow(nD, 4.8655)) *
      nL;
  const result = num.toFixed(2);
  if (!isNaN(Number(result))) form.nOut.value = result;
  else form.nOut.value = (window as any).$("#NoValueElement").val();
}

// Second section

export function validateMaximumPipeLength(
  input: HTMLInputElement,
  min: number,
  max: number,
  label: string,
): boolean {
  const message = `${label} has an invalid value: ${input.value}`;
  const str = input.value;
  for (let i = 0; i < str.length; i++) {
    const ch = str.substring(i, i + 1);
    if ((ch < "0" || "9" < ch) && ch !== ".") {
      alert(message);
      return false;
    }
  }
  const num = Number(str);
  if (num < min || max < num) {
    alert(`${message} is out of range [${min}..${max}]`);
    return false;
  }
  input.value = str;
  return true;
}

export function calculateMaximumPipeLength(input: HTMLInputElement): void {
  let value: number | undefined;
  if (input.value.length !== 0) value = parseFloat(input.value);
  if (!isNaN(value as number)) {
    input.value = String(value);
    showMaximumPipeLengthResult(input.form as HTMLFormElement);
  } else {
    input.value = "";
  }
}

export function showMaximumPipeLengthResult(form: HTMLFormElement): void {
  if (
    form.nFlowMaxPipe.value == null ||
    form.nFlowMaxPipe.value.length === 0 ||
    form.nDiamMaxPipe.value == null ||
    form.nDiamMaxPipe.value.length === 0 ||
    form.nOutMaxPipe.value == null ||
    form.nOutMaxPipe.value.length === 0 ||
    form.nElvMaxPipe.value == null ||
    form.nElvMaxPipe.value.length === 0
  ) {
    return;
  }
  if (
    !validateMaximumPipeLength(form.nFlowMaxPipe, 0, 9999999, "Capacity") ||
    !validateMaximumPipeLength(form.nDiamMaxPipe, 0, 9999, "Diameter") ||
    !validateMaximumPipeLength(
      form.nOutMaxPipe,
      0,
      999999,
      "Pressure Difference",
    ) ||
    !validateMaximumPipeLength(form.nElvMaxPipe, 0, 999999, "Elevation")
  ) {
    form.nKW.value = "Invalid";
    return;
  }
  const unitQIndex = form.cUnitQMaxPipe.options.selectedIndex;
  const unitQArray = [0, 1 / 3.6, 1 / 60, 1, 1 / 15.852];
  const nConQ = unitQArray[unitQIndex + 1];
  const unitDIndex = form.cUnitDMaxPipe.options.selectedIndex;
  const unitDArray = [0, 25.4, 1];
  const nConD = unitDArray[unitDIndex + 1];
  const pipeIndex = form.cPipeMaxPipe.options.selectedIndex;
  const pipeArray = [0, 145, 150, 135, 125];
  const nHazen = pipeArray[pipeIndex + 1];
  const nQ = form.nFlowMaxPipe.value * nConQ * 15.852; // US gpm
  const nD = (form.nDiamMaxPipe.value * nConD) / 25.4; // inches
  const nO = form.nOutMaxPipe.value; // m
  const nE = form.nElvMaxPipe.value; // m
  const num =
    (nO - nE / 1) /
    ((0.002083 * Math.pow(100 / nHazen, 1.85) * Math.pow(nQ, 1.85)) /
      Math.pow(nD, 4.8655));
  const result = num.toFixed(2);
  if (!isNaN(Number(result))) form.nLenMaxPipe.value = result;
  else form.nLenMaxPipe.value = (window as any).$("#NoValueElement").val();
}

// Third section

export function validateMaximumCapacity(
  input: HTMLInputElement,
  min: number,
  max: number,
  label: string,
): boolean {
  const message = `${label} has an invalid value: ${input.value}`;
  const str = input.value;
  for (let i = 0; i < str.length; i++) {
    const ch = str.substring(i, i + 1);
    if ((ch < "0" || "9" < ch) && ch !== ".") {
      alert(message);
      return false;
    }
  }
  const num = Number(str);
  if (num < min || max < num) {
    alert(`${message} is out of range [${min}..${max}]`);
    return false;
  }
  input.value = str;
  return true;
}

export function calculateMaximumCapacity(input: HTMLInputElement): void {
  let value: number | undefined;
  if (input.value.length !== 0) value = parseFloat(input.value);
  if (!isNaN(value as number)) {
    input.value = String(value);
    showMaximumCapacityResult(input.form as HTMLFormElement);
  } else {
    input.value = "";
  }
}

export function showMaximumCapacityResult(form: HTMLFormElement): void {
  if (
    form.nOutMaxFlow.value == null ||
    form.nOutMaxFlow.value.length === 0 ||
    form.nDiamMaxFlow.value == null ||
    form.nDiamMaxFlow.value.length === 0 ||
    form.nLenMaxFlow.value == null ||
    form.nLenMaxFlow.value.length === 0 ||
    form.nElvMaxFlow.value == null ||
    form.nElvMaxFlow.value.length === 0
  ) {
    return;
  }
  if (
    !validateMaximumCapacity(
      form.nOutMaxFlow,
      0,
      9999999,
      "Pressure Difference",
    ) ||
    !validateMaximumCapacity(form.nDiamMaxFlow, 0, 9999, "Diameter") ||
    !validateMaximumCapacity(form.nLenMaxFlow, 0, 999999, "Length") ||
    !validateMaximumCapacity(form.nElvMaxFlow, 0, 999999, "Elevation")
  ) {
    form.nKW.value = "Invalid";
    return;
  }
  const unitDIndex = form.cUnitDMaxFlow.options.selectedIndex;
  const unitDArray = [0, 25.4, 1];
  const nConD = unitDArray[unitDIndex + 1];
  const pipeIndex = form.cPipeMaxFlow.options.selectedIndex;
  const pipeArray = [0, 145, 150, 135, 125];
  const nHazen = pipeArray[pipeIndex + 1];
  const nD = (form.nDiamMaxFlow.value * nConD) / 25.4; // inches
  const nL = form.nLenMaxFlow.value; // m
  const nE = form.nElvMaxFlow.value; // m
  const num =
    Math.pow(
      ((form.nOutMaxFlow.value - nE / 1) /
        (0.002083 * Math.pow(100 / nHazen, 1.85)) /
        nL) *
        Math.pow(nD, 4.8655),
      0.54054,
    ) / 4.403333;
  const result = num.toFixed(2);
  if (!isNaN(Number(result))) form.nFlowMaxFlow.value = result;
  else form.nFlowMaxFlow.value = (window as any).$("#NoValueElement").val();
}

// Fourth section

export function validateRequiredPipeDiameter(
  input: HTMLInputElement,
  min: number,
  max: number,
  label: string,
): boolean {
  const message = `${label} has an invalid value: ${input.value}`;
  const str = input.value;
  for (let i = 0; i < str.length; i++) {
    const ch = str.substring(i, i + 1);
    if ((ch < "0" || "9" < ch) && ch !== ".") {
      alert(message);
      return false;
    }
  }
  const num = Number(str);
  if (num < min || max < num) {
    alert(`${message} is out of range [${min}..${max}]`);
    return false;
  }
  input.value = str;
  return true;
}

export function calculateRequiredPipeDiameter(input: HTMLInputElement): void {
  let value: number | undefined;
  if (input.value.length !== 0) value = parseFloat(input.value);
  if (!isNaN(value as number)) {
    input.value = String(value);
    showRequiredPipeDiameterResult(input.form as HTMLFormElement);
  } else {
    input.value = "";
  }
}

export function showRequiredPipeDiameterResult(form: HTMLFormElement): void {
  if (
    form.nFlowDiameter.value == null ||
    form.nFlowDiameter.value.length === 0 ||
    form.nLenDiameter.value == null ||
    form.nLenDiameter.value.length === 0 ||
    form.nOutDiameter.value == null ||
    form.nOutDiameter.value.length === 0 ||
    form.nElvDiameter.value == null ||
    form.nElvDiameter.value.length === 0
  ) {
    return;
  }
  if (
    !validateRequiredPipeDiameter(form.nFlowDiameter, 0, 9999999, "Capacity") ||
    !validateRequiredPipeDiameter(form.nLenDiameter, 0, 9999, "Length") ||
    !validateRequiredPipeDiameter(
      form.nOutDiameter,
      0,
      999999,
      "Pressure Difference",
    ) ||
    !validateRequiredPipeDiameter(form.nElvDiameter, 0, 999999, "Elevation")
  ) {
    form.nKW.value = "Invalid";
    return;
  }
  const unitQIndex = form.cUnitQDiameter.options.selectedIndex;
  const unitQArray = [0, 1 / 3.6, 1 / 60, 1, 1 / 15.852];
  const nConQ = unitQArray[unitQIndex + 1];
  const pipeIndex = form.cPipeDiameter.options.selectedIndex;
  const pipeArray = [0, 145, 150, 135, 125];
  const nHazen = pipeArray[pipeIndex + 1];
  const nQ = form.nFlowDiameter.value * nConQ * 15.852; // US gpm
  const nL = form.nLenDiameter.value; // m
  const nO = form.nOutDiameter.value; // m
  const nE = form.nElvDiameter.value; // m
  const num =
    Math.pow(
      (0.002083 * Math.pow(100 / nHazen, 1.85) * Math.pow(nQ, 1.85)) /
        ((nO - nE / 1) / nL),
      0.2055,
    ) * 25.4;
  const result = num.toFixed(2);
  if (!isNaN(Number(result))) form.nDiamDiameter.value = result;
  else form.nDiamDiameter.value = (window as any).$("#NoValueElement").val();
}
