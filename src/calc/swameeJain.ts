import {
  assertNonNegativeNumber,
  assertPositiveNumber
} from "../components/base";

export interface SwameeJainInput {
  reynoldsNumber: number;
  roughnessMeters: number;
  hydraulicDiameterMeters: number;
}

export function calculateSwameeJainFrictionFactor(
  input: SwameeJainInput
): number {
  assertNonNegativeNumber(input.reynoldsNumber, "reynoldsNumber");
  assertNonNegativeNumber(input.roughnessMeters, "roughnessMeters");
  assertPositiveNumber(
    input.hydraulicDiameterMeters,
    "hydraulicDiameterMeters"
  );

  if (input.reynoldsNumber === 0) {
    return 0;
  }

  if (input.reynoldsNumber < 4000) {
    return 64 / input.reynoldsNumber;
  }

  const relativeRoughnessTerm =
    input.roughnessMeters / (3.7 * input.hydraulicDiameterMeters);
  const reynoldsTerm = 5.74 / input.reynoldsNumber ** 0.9;
  const denominator = Math.log10(relativeRoughnessTerm + reynoldsTerm) ** 2;

  return 0.25 / denominator;
}
