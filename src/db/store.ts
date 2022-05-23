import { Collection, Db } from "mongodb";

export { Db };

export class DbStore {
  protected $: Collection;
  constructor(db: Db, collection: string) {
    this.$ = db.collection(collection);
  }
}
