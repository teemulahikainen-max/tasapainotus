import {
  assertNonNegativeNumber,
  assertPositiveNumber
} from "../components/base";

export interface ReynoldsNumberInput {
  densityKgPerM3: number;
  velocityMps: number;
  hydraulicDiameterMeters: number;
  dynamicViscosityPaS: number;
}

export function calculateReynoldsNumber(
  input: ReynoldsNumberInput
): number {
  assertPositiveNumber(input.densityKgPerM3, "densityKgPerM3");
  assertNonNegativeNumber(input.velocityMps, "velocityMps");
  assertPositiveNumber(
    input.hydraulicDiameterMeters,
    "hydraulicDiameterMeters"
  );
  assertPositiveNumber(input.dynamicViscosityPaS, "dynamicViscosityPaS");

  if (input.velocityMps === 0) {
    return 0;
  }

  return (
    (input.densityKgPerM3 *
      input.velocityMps *
      input.hydraulicDiameterMeters) /
    input.dynamicViscosityPaS
  );
}
