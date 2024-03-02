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
