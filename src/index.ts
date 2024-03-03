import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { getAll, getStats } from "./prismaQueries";
import { parseRows } from "./utils/parseRows";

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {  
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get("/object", (req: Request, res: Response) => {
  getAll()
    .then((data) => {
      res.send(
        JSON.stringify(data, (_, v) =>
          typeof v === "bigint" ? v.toString() : v
        )
      );
    })
    .catch((e: Error) => {
      console.error(e);
    })
    .finally(() => {
      console.log("Data sent");
    });
});

app.get("/stats", async (req: Request, res: Response) => {
  getStats()
    .then((data) => res.send(data))
    .catch((e: Error) => console.error(e))
    .finally(() => console.log("Data sent2"))
});

app.listen(port, () => {
  parseRows();
});
