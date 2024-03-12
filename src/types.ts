export type Data = {
  country: string;
  confirmed: bigint;
  deaths: bigint;
  recovered: bigint;
  active: bigint;
  newCases: bigint;
  newDeaths: bigint;
  newRecovered: bigint;
  confirmedLastWeek: bigint;
  whoRegion: {
    region: string;
  };
};

export type Stats = {
  id: number;
  country: string;
  weekPercentageIncrease: string;
  weekChange: string;
  deathsPerCases: string;
  deathsPerRecovered: string;
  recoveredPerCases: string;
};
export type RequestData = {
  id: number;
  country: string;
  confirmed: number;
  deaths: number;
  recovered: number;
  active: number;
  newCases: number;
  newDeaths: number;
  newRecovered: number;
  confirmedLastWeek: number;
  whoId: number;
};

export type Regions = {
  id: number;
  region: string;
};
