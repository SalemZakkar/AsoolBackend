require("./errors");
import mongoose from "mongoose";
import {findAndCount} from "./plugins";
import {accessibleFieldsPlugin, accessibleRecordsPlugin} from "@casl/mongoose";

export * from "./default-mongoose-options";
export * from "./mongoose-queries-util";
export * from "./errors";
export * from "./utils";

mongoose.plugin(findAndCount);
mongoose.plugin(accessibleFieldsPlugin);
mongoose.plugin(accessibleRecordsPlugin);


function mongoConnect(uri: string): void {
    mongoose.connect(uri).then(e => console.log("connectedToDB"));
}

export {mongoConnect};
