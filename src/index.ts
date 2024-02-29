import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { parseFile } from "fast-csv";
import { main } from "./prismaQueries";

dotenv.config();

const app: Express = express();
const port: Number = Number(process.env.PORT) || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/import", (req: Request, res: Response) => {});

app.listen(port, () => {
  parseFile("./country_wise_latest.csv")
    .on("error", (error) => console.error(error))
    .on("data", (row) => console.log(row))
    .on("end", (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
});
