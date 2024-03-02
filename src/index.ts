import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { getAll } from "./prismaQueries";
import { parseRows } from "./utils/parseRows";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;
const prisma = new PrismaClient();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/stats", async (req: Request, res: Response) => {
  try {
    const data = await prisma.$queryRaw`
        select
        cs.id,
        cs.country,
        who.region,
        cs.confirmed,
        cs.deaths,
        cs.recovered,
        cs.active,
        cs."newCases",
        cs."newDeaths",
        cs."newRecovered",
        cs."confirmedLastWeek",
        case when cs.confirmed != 0
          then round(cs.deaths::numeric / cs.confirmed * 100, 2)
          else 0
        end as "Deaths / 100 Cases",
        case when cs.confirmed != 0
          then round(cs.recovered::numeric / cs.confirmed * 100, 2)
          else 0	
        end as "Recovered / 100 Cases",
        case when cs.recovered != 0
          then round(cs.deaths::numeric / cs.recovered * 100, 2) 
          else 0
        end as "Deaths / 100 Recovered",
        cs.confirmed - cs."confirmedLastWeek" as "1 week change",
        ROUND((cs.confirmed - cs."confirmedLastWeek")/cs."confirmedLastWeek"::numeric * 100, 2) as "1 week % increase"
        from "CovidStats" cs
        join "WHORegion" who
        on cs."whoId" = who.id
    `
    res.send(JSON.stringify(
      data,
      (_, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    ))
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  //parseRows();
});
