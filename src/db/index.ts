import Dexie, { type Table } from "dexie";
import type { Verse } from "../types";
import { initialVerses } from "../data/initialVerses";

export class NoorJarDB extends Dexie {
  verses!: Table<Verse>;

  constructor() {
    super("NoorJar");
    this.version(1).stores({
      verses: "++id, mood, arabic, translation",
    });
  }

  async initializeData() {
    const count = await this.verses.count();
    if (count === 0) {
      await this.verses.bulkAdd(initialVerses);
    }
  }
}

export const db = new NoorJarDB();

// Initialize the database with sample data
db.initializeData();
