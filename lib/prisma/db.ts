import "dotenv/config";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "../../generated/prisma";

import ws from "ws";
neonConfig.webSocketConstructor = ws;

neonConfig.poolQueryViaFetch = true;

const connectionString = `${process.env.DATABASE_URL}?connect_timeout=10&pool_timeout=15`;

const adapter = new PrismaNeon({ connectionString });
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
