import { ObjectId } from "mongodb";

export interface TableItem {
  _id: ObjectId;
  table_id: ObjectId;
  name: string;
  price: number;
}
