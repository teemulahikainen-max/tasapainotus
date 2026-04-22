import { assertPositiveNumber } from "../components/base";

export type HydraulicDiameterInput =
  | {
      shape: "round";
      diameterMeters: number;
    }
  | {
      shape: "rectangular";
      widthMeters: number;
      heightMeters: number;
    };

export function calculateHydraulicDiameter(
  input: HydraulicDiameterInput
): number {
  if (input.shape === "round") {
    assertPositiveNumber(input.diameterMeters, "diameterMeters");

    return input.diameterMeters;
  }

  assertPositiveNumber(input.widthMeters, "widthMeters");
  assertPositiveNumber(input.heightMeters, "heightMeters");

  return (
    (2 * input.widthMeters * input.heightMeters) /
    (input.widthMeters + input.heightMeters)
  );
}
