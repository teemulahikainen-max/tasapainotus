import {
  assertNonNegativeNumber,
  assertPositiveNumber
} from "../components/base";

export interface DarcyWeisbachInput {
  frictionFactor: number;
  lengthMeters: number;
  hydraulicDiameterMeters: number;
  densityKgPerM3: number;
  velocityMps: number;
}

export function calculateDarcyWeisbachPressureLoss(
  input: DarcyWeisbachInput
): number {
  assertNonNegativeNumber(input.frictionFactor, "frictionFactor");
  assertNonNegativeNumber(input.lengthMeters, "lengthMeters");
  assertPositiveNumber(
    input.hydraulicDiameterMeters,
    "hydraulicDiameterMeters"
  );
  assertPositiveNumber(input.densityKgPerM3, "densityKgPerM3");
  assertNonNegativeNumber(input.velocityMps, "velocityMps");

  if (
    input.frictionFactor === 0 ||
    input.lengthMeters === 0 ||
    input.velocityMps === 0
  ) {
    return 0;
  }

  return (
    input.frictionFactor *
    (input.lengthMeters / input.hydraulicDiameterMeters) *
    ((input.densityKgPerM3 * input.velocityMps ** 2) / 2)
  );
}
