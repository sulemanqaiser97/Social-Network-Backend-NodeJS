import { table } from "console";
import crypto from "crypto";

const key1 = crypto.randomBytes(32).toString("hex");
const key2 = crypto.randomBytes(32).toString("hex");

table({ key1, key2 });
