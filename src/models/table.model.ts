import { ObjectId } from "mongodb";
import { TableItem } from "./table-item.model";

export interface Table {
  _id: ObjectId;
  name: string;
  items?: TableItem[];
}
