import { MongoId } from "../../../core";

export interface Category {
  id?: MongoId;
  name: string;
  image?: MongoId | null;
}

export interface SubCategory {
  id?: MongoId;
  category: MongoId;
  name: string;
  image?: MongoId | null;
}
