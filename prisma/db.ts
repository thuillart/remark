import "dotenv/config";

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

import ws from "ws";
neonConfig.webSocketConstructor = ws;

// To work in edge environments (Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true;

declare global {
  var db: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
// biome-ignore lint/suspicious/noRedeclare: leave this as is
const db = global.db || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.db = db;
}

export default db;
