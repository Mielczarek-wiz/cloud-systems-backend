import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import {
  getAll,
  getStats,
  getOneByName,
  getOneById,
  getAllInRegion,
  getRegions,
  saveObject,
  count,
} from "./prismaQueries";
import { parseRows } from "./utils/parseRows";

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 8080;
const allowedOrigins = [
  process.env.NEXT_PUBLIC_API_URL,
  process.env.NEXT_PRIVATE_API_URL,
];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  const origin = req.headers.origin as string;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/object", (req: Request, res: Response) => {
  saveObject(req.body)
    .then((data) => {
      res.status(200).send("ok");
    })
    .catch((e: Error) => {
      console.error(e);
      res.status(500);
    });
});

app.put("/object", (req: Request, res: Response) => {
  saveObject(req.body)
    .then((data) => {
      res.status(200).send("ok");
    })
    .catch((e: Error) => {
      console.error(e);
      res.status(500);
    });
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
    });
});

app.get("/region/:regionID", (req: Request, res: Response) => {
  getAllInRegion(Number(req.params.regionID))
    .then((data) => {
      res.send(
        JSON.stringify(data, (_, v) =>
          typeof v === "bigint" ? v.toString() : v
        )
      );
    })
    .catch((e: Error) => {
      console.error(e);
    });
});

app.get("/object/name/:countryName", (req: Request, res: Response) => {
  getOneByName(req.params.countryName)
    .then((data) => {
      if (data == null) {
        res.send("no data");
        return;
      }
      res.send(
        JSON.stringify(data, (_, v) =>
          typeof v === "bigint" ? v.toString() : v
        )
      );
    })
    .catch((e: Error) => {
      console.error(e);
    });
});

app.get("/object/:countryId", (req: Request, res: Response) => {
  getOneById(Number(req.params.countryId))
    .then((data) => {
      if (data == null) {
        res.send("no data");
        return;
      }
      res.send(
        JSON.stringify(data, (_, v) =>
          typeof v === "bigint" ? v.toString() : v
        )
      );
    })
    .catch((e: Error) => {
      console.error(e);
    });
});

app.get("/stats", async (req: Request, res: Response) => {
  getStats()
    .then((data) => res.send(data))
    .catch((e: Error) => console.error(e));
});

app.get("/region", async (req: Request, res: Response) => {
  getRegions()
    .then((data) => {
      res.send(data);
    })
    .catch((e: Error) => res.send(e));
});

app.listen(port, () => {
  count().then((data) => {
    if (data < 1) {
      parseRows();
    }
  });
});
