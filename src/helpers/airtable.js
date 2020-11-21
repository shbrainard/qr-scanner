import { AIRTABLE_API_KEY, AIRTABLE_ID } from "./../constants";

const Airtable = window.Airtable;

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: AIRTABLE_API_KEY
});

export const airtableBase = Airtable.base(AIRTABLE_ID);

/**
 * posts scanned codes to airtable 
 * @param {string} tableId 
 * @param {object} entry 
 */
export const postEntryToAirtable = (tableId, entry) => {
  return new Promise((resolve, reject) => {
    airtableBase(tableId).create(entry, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * creates a cache of the airtable lookup table
 * @param {string} lookupKey - the column name to be looked up
 * @param {array} fields - the fields to retrive from airtable
 */
export const assembleLookupTable = (lookupTable, lookupKey, fields) => {
  const lookup = {};
  const promise = new Promise((resolve, reject) => {
    airtableBase(lookupTable)
      .select({ fields: fields })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach(record => {
            const fieldValue = record.get(lookupKey);
            const id = record.id;
            const recordObject = {...record.fields, id}
            lookup[fieldValue] = recordObject;
          });

          fetchNextPage();
        },
        // this is called when done
        err => {
          if (err) {
            reject(err);
          }
          resolve(lookup);
        }
      );
  });
  return promise;
};
