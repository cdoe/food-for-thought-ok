export const metersToRoundedMiles = (meters: number) => {
  const miles = meters / 1609.344;
  if (miles < 10) {
    return Math.round(miles * 10) / 10;
  } else {
    return Math.round(miles);
  }
};
