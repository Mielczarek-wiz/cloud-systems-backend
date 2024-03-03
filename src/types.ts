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
