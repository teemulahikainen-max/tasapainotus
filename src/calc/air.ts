import {
  assertNonNegativeNumber,
  assertPositiveNumber
} from "../components/base";

export interface AirProperties {
  densityKgPerM3: number;
  dynamicViscosityPaS: number;
}

export const DEFAULT_AIR_PROPERTIES: AirProperties = {
  densityKgPerM3: 1.2,
  dynamicViscosityPaS: 1.81e-5
};

export function litersPerSecondToCubicMetersPerSecond(
  flowRateLps: number
): number {
  assertNonNegativeNumber(flowRateLps, "flowRateLps");

  return flowRateLps / 1000;
}

export function millimetersToMeters(valueMm: number): number {
  assertPositiveNumber(valueMm, "valueMm");

  return valueMm / 1000;
}

export function calculateRoundDuctArea(diameterMeters: number): number {
  assertPositiveNumber(diameterMeters, "diameterMeters");

  return Math.PI * (diameterMeters / 2) ** 2;
}

export function calculateAirVelocity(
  flowRateLps: number,
  diameterMeters: number
): number {
  const flowRateM3s = litersPerSecondToCubicMetersPerSecond(flowRateLps);

  if (flowRateM3s === 0) {
    return 0;
  }

  return flowRateM3s / calculateRoundDuctArea(diameterMeters);
}
