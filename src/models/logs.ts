import { randomBytes } from "crypto";
import { Db, DbStore } from "@db";
import env from "@env";

export class LogsStore extends DbStore {
  constructor(db: Db) {
    super(db, "logs");
  }

  async recordLog(obj: Record<string, string>): Promise<boolean> {
    await this.$.insertOne(obj);
    return true;
  }

  async checkCookie(cookie: string): Promise<boolean> {
    const result = await this.$.findOne({ cookie }, { projection: { _id: 1 } });
    return result?._id ? false : true;
  }
}

export default {
  scope: "logs",
  routes: [
    {
      method: "post",
      path: "get",
      async handle(req) {
        if (req.body.pwd !== env.logPwd) return 400;
        let cookie = null;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          cookie = randomBytes(16).toString("base64");
          if (await req.db.logs.checkCookie(cookie)) break;
        }
        return {
          data: { cookie }
        };
      }
    },
    {
      method: "post",
      path: "record",
      async handle(req) {
        if (req.body.pwd !== env.logPwd) return 400;
        await req.db.logs.recordLog({
          ...req.body.record,
          timestamp: Date.now()
        });
        return 201;
      }
    }
  ]
} as Controller;
