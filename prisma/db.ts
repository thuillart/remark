import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "../generated/prisma/client";

import ws from "ws";
neonConfig.webSocketConstructor = ws;

neonConfig.poolQueryViaFetch = true;

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}?connect_timeout=10&pool_timeout=15`;

const adapter = new PrismaNeon({ connectionString });
// biome-ignore lint/suspicious/noRedeclare: idc
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
