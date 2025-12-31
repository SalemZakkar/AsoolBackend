import { MongoId } from "../../../core";
import { Category } from "../category/interface";
import { Address, LocalizedString, PhoneNumber } from "../common/interface";

export interface Store {
  name: LocalizedString;
  phone: PhoneNumber;
  address: Address;
  categories?: MongoId[] | Category[];
  image?: MongoId | null
}
