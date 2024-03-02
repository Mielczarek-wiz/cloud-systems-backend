import { CovidStats, PrismaClient } from "@prisma/client";
import { Data } from "./types";

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
