export type Data = {
  country: string;
  confirmed: number;
  deaths: number;
  recovered: number;
  active: number;
  newCases: number;
  newDeaths: number;
  newRecovered: number;
  confirmedLastWeek: number;
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
