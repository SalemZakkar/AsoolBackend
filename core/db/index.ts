import mongoose from "mongoose";
import {findAndCount} from "./plugins";

export * from "./default-mongoose-options";
export * from "./mongoose-queries-util";
export * from "./errors";
export * from "./utils";

mongoose.plugin(findAndCount);

function mongoConnect(uri: string): void {
    mongoose.connect(uri).then(e => console.log("connectedToDB"));
}

export {mongoConnect};
