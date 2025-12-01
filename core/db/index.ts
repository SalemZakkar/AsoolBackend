import mongoose from "mongoose";
import { findAndCount } from "./plugins";

export * from "./default-mongoose-options";
export * from "./mongoose-queries-util";
export * from "./errors";

mongoose.plugin(findAndCount);

async function mongoConnect(uri: string) {
  await mongoose.connect(uri);
  console.log("connectedToDB");
}

export { mongoConnect };
