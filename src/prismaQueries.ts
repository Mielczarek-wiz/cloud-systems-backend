import { CovidStats, PrismaClient } from "@prisma/client";
import { Data, Regions, RequestData, Stats } from "./types";

const prisma = new PrismaClient();
const select = {
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
};

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
  try {
    await prisma.$connect();
    const allCovid: Data[] = await prisma.covidStats.findMany({
      orderBy: {
        id: "asc",
      },
      select: select,
    });
    return allCovid;
  } catch (error) {
    throw error;
  } finally {
    disconnect();
  }
}

export async function getAllInRegion(regionId?: number) {
  try {
    if (regionId === undefined || !Number.isInteger(regionId)) return getAll();
    await prisma.$connect();
    const allCovid: Data[] = await prisma.covidStats.findMany({
      where: {
        whoId: regionId,
      },
      orderBy: {
        id: "asc",
      },
      select: select,
    });
    return allCovid;
  } catch (error) {
    throw error;
  } finally {
    disconnect();
  }
}

export async function getOneByName(countryName: string) {
  await prisma.$connect();

  const countryData: Data | null = await prisma.covidStats.findUnique({
    where: {
      country: countryName,
    },
    select: select,
  });
  disconnect();
  return countryData;
}

export async function getOneById(countryId: number) {
  try {
    await prisma.$connect();
    const countryData: Data | null = await prisma.covidStats.findUnique({
      where: {
        id: countryId,
      },
      select: select,
    });

    const { whoRegion, ...data } = countryData!;
    const region = await prisma.wHORegion.findUnique({
      where: {
        region: whoRegion.region,
      },
      select: {
        id: true,
      },
    });
    const response = { ...data, whoId: region?.id };
    return response;
  } catch (error) {
    throw error;
  } finally {
    disconnect();
  }
}

export async function getStats() {
  try {
    await prisma.$connect();
    const allCovid: CovidStats[] = await prisma.covidStats.findMany({
      orderBy: { id: "asc" },
    });
    const res: Stats[] = allCovid.map((row) => {
      return {
        id: Number(row.id),
        country: row.country,
        deathsPerCases:
          Number(row.confirmed) !== 0
            ? ((Number(row.deaths) / Number(row.confirmed)) * 100).toFixed(2)
            : String(0),
        recoveredPerCases:
          Number(row.confirmed) !== 0
            ? ((Number(row.recovered) / Number(row.confirmed)) * 100).toFixed(2)
            : String(0),
        deathsPerRecovered:
          Number(row.recovered) !== 0
            ? ((Number(row.deaths) / Number(row.recovered)) * 100).toFixed(2)
            : String(0),
        weekChange: String(row.confirmed - row.confirmedLastWeek),
        weekPercentageIncrease: String(
          (
            ((Number(row.confirmed) - Number(row.confirmedLastWeek)) /
              Number(row.confirmedLastWeek)) *
            100
          ).toFixed(2)
        ),
      };
    });
    return res;
  } catch (error) {
    throw error;
  } finally {
    disconnect();
  }
}
export async function saveObject(record: RequestData) {
  await prisma.$connect();
  try {
    const { id, whoId, ...recordWithoutIds } = record;
    await prisma.covidStats.upsert({
      where: { id: id },
      update: {
        ...recordWithoutIds,
        whoRegion: {
          connect: { id: whoId },
        },
      },
      create: {
        ...recordWithoutIds,
        whoRegion: {
          connect: { id: whoId },
        },
      },
    });
  } catch (error) {
    throw error;
  } finally {
    disconnect();
  }
}

export async function saveRecord(record: Data) {
  await prisma.$connect();
  try {
    const upsertedRegion = await prisma.wHORegion.upsert({
      where: { region: record.whoRegion.region },
      update: {},
      create: record.whoRegion,
    });

    await prisma.covidStats.upsert({
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

export async function getRegions() {
  try {
    await prisma.$connect();
    const regions = await prisma.wHORegion.findMany({
      orderBy: {
        id: "asc",
      },
    });
    const res: Regions[] = regions.map((row) => {
      return {
        id: Number(row.id),
        region: row.region,
      };
    });
    return res;
  } catch (error) {
    throw error;
  } finally {
    disconnect();
  }
}

export async function count() {
  try {
    await prisma.$connect();
    const count = await prisma.covidStats.count();
    return count;
  } catch (error) {
    throw error;
  } finally {
    disconnect();
  }
}
