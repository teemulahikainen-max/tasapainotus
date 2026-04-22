import {
  calculateAirVelocity,
  calculateDarcyWeisbachPressureLoss,
  calculateHydraulicDiameter,
  calculateLocalPressureLoss,
  calculateReynoldsNumber,
  calculateSwameeJainFrictionFactor
} from "./index";

describe("HVAC formula calculations", () => {
  it("calculates hydraulic diameter for round and rectangular ducts", () => {
    expect(
      calculateHydraulicDiameter({
        shape: "round",
        diameterMeters: 0.315
      })
    ).toBeCloseTo(0.315, 6);

    expect(
      calculateHydraulicDiameter({
        shape: "rectangular",
        widthMeters: 0.4,
        heightMeters: 0.2
      })
    ).toBeCloseTo(0.266667, 6);
  });

  it("calculates air velocity and Reynolds number", () => {
    expect(calculateAirVelocity(200, 0.25)).toBeCloseTo(4.074367, 6);

    expect(
      calculateReynoldsNumber({
        densityKgPerM3: 1.2,
        velocityMps: 5,
        hydraulicDiameterMeters: 0.25,
        dynamicViscosityPaS: 1.81e-5
      })
    ).toBeCloseTo(82872.928177, 6);
  });

  it("calculates Swamee-Jain, Darcy-Weisbach, and local losses", () => {
    expect(
      calculateSwameeJainFrictionFactor({
        reynoldsNumber: 82872.928177,
        roughnessMeters: 0.00009,
        hydraulicDiameterMeters: 0.25
      })
    ).toBeCloseTo(0.020344, 6);

    expect(
      calculateDarcyWeisbachPressureLoss({
        frictionFactor: 0.02,
        lengthMeters: 12,
        hydraulicDiameterMeters: 0.25,
        densityKgPerM3: 1.2,
        velocityMps: 5
      })
    ).toBeCloseTo(14.4, 6);

    expect(
      calculateLocalPressureLoss({
        lossCoefficient: 0.75,
        densityKgPerM3: 1.2,
        velocityMps: 5
      })
    ).toBeCloseTo(11.25, 6);
  });
});
