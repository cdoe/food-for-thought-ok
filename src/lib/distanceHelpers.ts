export const metersToRoundedMiles = (meters: number) => {
  return Math.round((meters / 1609.344) * 10) / 10;
};
