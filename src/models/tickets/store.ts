import { DbStore, Db } from "@db";
import { ITicketPayment } from "./interfaces";

export class TicketsStore extends DbStore {
  constructor(db: Db) {
    super(db, "tickets");
  }

  async checkPayment(email: string, waNu: string): Promise<boolean> {
    const query = await this.$.findOne(
      { $or: [{ email }, { wa_nu: waNu }] },
      { projection: { _id: 1 } }
    );
    return query?._id ? false : true;
  }
  async checkEmail(email: string): Promise<boolean> {
    const query = await this.$.findOne({ email }, { projection: { _id: 1 } });
    return query?._id ? false : true;
  }
  async checkWaNu(waNu: string): Promise<boolean> {
    const query = await this.$.findOne(
      { wa_nu: waNu },
      { projection: { _id: 1 } }
    );
    return query?._id ? false : true;
  }

  async storePayment(payment: ITicketPayment): Promise<boolean> {
    const result = await this.$.insertOne(payment);
    return result.insertedId ? true : false;
  }
}
