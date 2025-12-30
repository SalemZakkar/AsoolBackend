import { MongoId } from "../../../core";
import { LocalizedString } from "../common/interface";

export interface Category {
  id?: MongoId;
  name: LocalizedString;
  image?: MongoId | null;
}

export interface SubCategory {
  id?: MongoId;
  category: MongoId;
  name: LocalizedString;
  image?: MongoId | null;
}
