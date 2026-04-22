import {
  assertNonNegativeNumber,
  assertPositiveNumber
} from "../components/base";

export interface LocalLossInput {
  lossCoefficient: number;
  densityKgPerM3: number;
  velocityMps: number;
}

export function calculateLocalPressureLoss(input: LocalLossInput): number {
  assertNonNegativeNumber(input.lossCoefficient, "lossCoefficient");
  assertPositiveNumber(input.densityKgPerM3, "densityKgPerM3");
  assertNonNegativeNumber(input.velocityMps, "velocityMps");

  if (input.lossCoefficient === 0 || input.velocityMps === 0) {
    return 0;
  }

  return input.lossCoefficient * ((input.densityKgPerM3 * input.velocityMps ** 2) / 2);
}
