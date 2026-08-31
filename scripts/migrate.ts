import { connect } from "./db-connect.ts";

const conn = await connect();
console.log(`Migrujem: ${conn.label}`);
await conn.migrate("./drizzle");
console.log("Migrácie aplikované.");
await conn.close();
