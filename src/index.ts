import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import {
  getAll,
  getStats,
  getOneByName,
  getOneById,
  saveRecord,
  updateRecord,
  getAllInRegion,
  getRegions,
  saveObject,
} from "./prismaQueries";
import { parseRows } from "./utils/parseRows";

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
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
    })
    .finally(() => {
      console.log("saveRecord app.post(/object)");
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
    })
    .finally(() => {
      console.log("saveRecord app.post(/object)");
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
    })
    .finally(() => {
      console.log("Data sent");
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
    })
    .finally(() => {
      console.log("getAllInRegion", req.params.regionID);
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
    })
    .finally(() => {
      console.log("Data sent (getOneByName, /object/:countryName)");
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
    })
    .finally(() => {
      console.log("Data sent (getOneById, /object/:countryId)");
    });
});

app.get("/stats", async (req: Request, res: Response) => {
  getStats()
    .then((data) => res.send(data))
    .catch((e: Error) => console.error(e))
    .finally(() => console.log("Data sent2"));
});

app.get("/region", async (req: Request, res: Response) => {
  getRegions()
    .then((data) => {
      res.send(data);
    })
    .catch((e: Error) => console.error(e));
});

app.listen(port, () => {
  parseRows();
});
