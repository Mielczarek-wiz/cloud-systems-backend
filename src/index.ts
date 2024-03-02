import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { getAll, getStats } from "./prismaQueries";
import { parseRows } from "./utils/parseRows";

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {  
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/stats", async (req: Request, res: Response) => {
  const json = await getStats()
  res.send(json) 
});

app.listen(port, () => {
  parseRows();
});
