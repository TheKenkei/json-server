import jsonServer from "json-server";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { LoDashExplicitWrapper } from "lodash";

const server = express();
const router = jsonServer.router(path.join(__dirname, "/db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get(
  "/:projects/:entity/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const db = router.db;
    const { projects, entity, id } = req.params;

    let response: LoDashExplicitWrapper<any> = db.get(`${projects}.${entity}`);

    if (!!req.query?.item) {
      response =
        (response.value() as Array<any>).filter(
          (item) => item?.id == id || item?.uuid == id,
        )[0] ?? null;
    }

    console.log("res:", response);
    res.jsonp(response);
    next();
  },
);

server.use("/api", router);

server.listen(3000, () => {
  console.log("JSON Server is running at http://localhost:3000");
});
