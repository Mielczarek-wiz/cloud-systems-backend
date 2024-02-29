import { CovidStats, PrismaClient } from "@prisma/client";

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

export async function main() {
  await prisma.$connect();
  const allCovid: CovidStats[] = await prisma.covidStats.findMany();
  console.log(allCovid);
  disconnect();
}
