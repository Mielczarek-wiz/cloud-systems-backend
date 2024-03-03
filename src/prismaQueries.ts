import { CovidStats, PrismaClient } from "@prisma/client";
import { Data, Stats } from "./types";

const prisma = new PrismaClient();

async function disconnect() {
  try {
    await prisma.$disconnect();
  } catch {
    async (e: Error) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    };
  }
}

export async function getAll() {
  await prisma.$connect();
  const allCovid: Data[] = await prisma.covidStats.findMany({
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      country: true,
      confirmed: true,
      deaths: true,
      recovered: true,
      active: true,
      newCases: true,
      newDeaths: true,
      newRecovered: true,
      confirmedLastWeek: true,
      whoRegion: {
        select: {
          region: true,
        },
      },
    },
  });
  disconnect();
  return allCovid;
}

export async function getStats() {
  await prisma.$connect();
  const allCovid: CovidStats[] = await prisma.covidStats.findMany();
  disconnect();
  const res: Stats[] = allCovid.map((row) => {
    return {
      id: Number(row.id),
      country: row.country,
      deathsPerCases: Number(row.confirmed) !== 0 ? (Number(row.deaths) / Number(row.confirmed) * 100).toFixed(2) : String(0),
      recoveredPerCases: Number(row.confirmed) !== 0 ? (Number(row.recovered) / Number(row.confirmed) * 100).toFixed(2) : String(0),
      deathsPerRecovered: Number(row.recovered) !== 0 ? (Number(row.deaths) / Number(row.recovered) * 100).toFixed(2) : String(0),
      weekChange: String(row.confirmed - row.confirmedLastWeek), 
      weekPercentageIncrease: String(((Number(row.confirmed) - Number(row.confirmedLastWeek)) / Number(row.confirmedLastWeek) * 100).toFixed(2))
    }
  })
  return res;
}

export async function saveRecord(record: Data) {
  await prisma.$connect();
  try {
    const upsertedRegion = await prisma.wHORegion.upsert({
      where: { region: record.whoRegion.region },
      update: {},
      create: record.whoRegion,
    });

    const createRecord = await prisma.covidStats.upsert({
      where: { country: record.country },
      update: {},
      create: {
        ...record,
        whoRegion: {
          connect: { id: upsertedRegion.id },
        },
      },
    });
  } catch (error) {
    throw error;
  } finally {
    disconnect();
  }
}
