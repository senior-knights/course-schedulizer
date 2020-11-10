import range from "lodash/range";

// Returns a list of hours to display on the Schedule
// TODO: add better types for timing, maybe: https://stackoverflow.com/questions/51445767/how-to-define-a-regex-matched-string-type-in-typescript
export const getHoursArr = (min: string, max: string): number[] => {
  const minHour = parseInt(min.split(":")[0]);
  const maxHour = parseInt(max.split(":")[0]);
  return range(minHour, maxHour);
};
