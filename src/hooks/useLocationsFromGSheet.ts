// Core
import { useEffect } from 'react';
import useLocalState from './useLocalState';
// import { useEffect } from 'react';

function useLocationsFromGSheet(sheetId: string, sheetName: string, apiKey: string) {
  // Begin benchmark for fetch time
  const benchmark0 = performance.now();

  // Stateful object to store locations (with caching in localStorage)
  const [locations, setLocations] = useLocalState([], 'locations-cache-TMP');

  // URL format that returns Google sheet as JSON data
  const jsonUrl =
    'https://sheets.googleapis.com/v4/spreadsheets/' +
    sheetId +
    '/values/' +
    sheetName +
    '/?key=' +
    apiKey;

  const fetchData = async () => {
    try {
      // Fetch data
      const response = await fetch(jsonUrl);
      const data = await response.json();

      // Headers are the first row in the document
      const headers = data.values[0];

      // Initialize array to store formatted data
      let dataList: {}[] = [];

      // Loop through each row, attach headers, and push the new object to `dataList` array
      data.values.forEach((rowData: {}[], rowIndex: number) => {
        // Don't need headers here, so return early first row
        if (rowIndex === 0) return;

        // If row doesn't include name(second column), toss it out
        if (!rowData[1]) return;

        // Object to store the row's formatted data
        let rowObject: any = {};

        // Loop through the headers and assign as a keys to each row cell's value
        headers.forEach((header: string, headerIndex: number) => {
          const value = rowData[headerIndex];
          rowObject[header] = formatCellData(value, header);
        });

        // Data Transformations
        rowObject.servesBreakfast = !!rowObject.breakfastStart && !!rowObject.breakfastEnd;
        rowObject.servesLunch = !!rowObject.lunchStart && !!rowObject.lunchEnd;
        rowObject.servesSnack = !!rowObject.snackStart && !!rowObject.snackEnd;
        rowObject.servesDinner = !!rowObject.dinnerStart && !!rowObject.dinnerEnd;

        // Push `row` object into `dataList` array
        dataList.push(rowObject);
      });
      // Print to the console how long the fetch and format took
      const benchmark1 = performance.now();
      console.log('Fetched Google Sheet data in ' + Math.round(benchmark1 - benchmark0) + 'ms');

      // Return formatted data
      return dataList;
    } catch (error) {
      // If error, print to console and return empty array
      console.error('Error fetching and formatting Google Sheets data...', error);
      return [];
    }
  };

  // Fetch Data on load
  useEffect(() => {
    fetchData().then(result => {
      // console.log('result', result);
      setLocations(result);
    });
  }, []);

  return locations;
}

export default useLocationsFromGSheet;

function formatCellData(data: any, key: string) {
  let returnValue = data;
  // Convert boolean strings to natives
  returnValue = returnValue === 'TRUE' ? true : returnValue;
  returnValue = returnValue === 'FALSE' ? false : returnValue;

  // Trim strings then nullify if empty
  if (typeof returnValue === 'string') {
    returnValue = returnValue.trim();
    returnValue = !!returnValue ? returnValue : null;
  }

  // If key has "date" anywhere in the name
  // try to convert to a javascript date
  if (typeof key === 'string' && key.search(/date/i) > 0) {
    const date = new Date(data);
    // Only assign value if converted to valid date
    returnValue = !!date ? date : returnValue;
  }

  return returnValue;
}
