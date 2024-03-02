import { parseFile } from "fast-csv";
import { Data } from "../types";
import { saveRecord } from "../prismaQueries";

type Row = {
  country: string;
  confirmed: string;
  deaths: string;
  recovered: string;
  active: string;
  newCases: string;
  newDeaths: string;
  newRecovered: string;
  confirmedLastWeek: string;
  whoRegion: string;
};

const castToData = (row: Row): Data => {
  const data: Data = {
    country: String(row.country),
    confirmed: Number(row.confirmed),
    deaths: Number(row.deaths),
    recovered: Number(row.recovered),
    active: Number(row.active),
    newCases: Number(row.newCases),
    newDeaths: Number(row.newDeaths),
    newRecovered: Number(row.newRecovered),
    confirmedLastWeek: Number(row.confirmedLastWeek),
    whoRegion: {
      region: String(row.whoRegion),
    },
  };
  return data;
};

const parseRecord = (row: Row) => {
  const data = castToData(row);
  saveRecord(data)
    .then(() => {
      console.log("Record saved successfully!");
    })
    .catch(() => {
      console.error("Error saving record:", data);
    });
};

export function parseRows() {
  const option = {
    delimiter: ";",
    headers: [
      "country",
      "confirmed",
      "deaths",
      "recovered",
      "active",
      "newCases",
      "newDeaths",
      "newRecovered",
      undefined,
      undefined,
      undefined,
      "confirmedLastWeek",
      undefined,
      undefined,
      "whoRegion",
    ],
    renameHeaders: true,
    ignoreEmpty: true,
  };
  parseFile("./data/country_wise_latest.csv", option)
    .on("error", (error) => console.error(error))
    .on("data", (row: Row) => parseRecord(row))
    .on("end", (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
}
