import { Db, MongoClient } from "mongodb";
import env from "@env";
import config from "@c/db";

// stores
import { TicketsStore } from "@m/tickets/store";
import { LogsStore } from "@m/logs";

// connection
async function connectDb(): Promise<Db> {
  const client = new MongoClient(env.db.str, config);
  await client.connect();
  return client.db(env.db.db);
}

// database stores interface
export interface IDb {
  tickets: TicketsStore;
  logs: LogsStore;
}
// stores initialization
export function initializeStores(db: Db): IDb {
  return {
    tickets: new TicketsStore(db),
    logs: new LogsStore(db)
  };
}

// bootstrapping
export default async function bootstrapDb(): Promise<ApiMiddleware> {
  const db = await connectDb();
  const stores = initializeStores(db);
  return function (req: ApiReq, res: ApiRes, next: ApiNext) {
    req.db = stores;
    next();
  };
}
