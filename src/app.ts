import express from "express";
import bodyParser from "body-parser";
import env from "@env";
import bootstrapDb from "./db/middleware";
import { router, handleError } from "./router";

async function bootstrap(): Promise<void> {
  const app = express();

  // middlewares
  app.use(
    bodyParser.json({
      limit: env.req.maxBodySize
    })
  );
  console.log("Connecting to database servers");
  app.use(await bootstrapDb());
  console.log("Connected to database servers!");

  app.use(router);

  app.use(handleError);

  app.listen(
    {
      port: env.port,
      hostname: env.host
    },
    () => {
      console.log(`Listening on ${env.host}:${env.port}!`);
    }
  );
}

bootstrap()
  .then(() => {
    console.log("API has bootstrapped correctly!");
  })
  .catch((error) => {
    throw error;
  });
