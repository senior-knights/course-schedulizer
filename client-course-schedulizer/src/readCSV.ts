import papa from "papaparse";

export const readCSV = function readCSV() {
  // Referenced https://jscharting.com/tutorials/js-chart-data/client-side/fetch-csv-and-json/
  fetch("data.csv")
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      // eslint-disable-next-line no-console
      console.log(convertToInterface(papa.parse(text, { header: true })));
    });
};

export const convertToInterface = function convertToInterface(objects: unknown) {
  return objects;
};
