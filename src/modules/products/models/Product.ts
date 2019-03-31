import { prop, Typegoose } from "typegoose";
import { IWorkingDays } from "../../restaurants/models/Restaurant";

export interface IProductPromotion {
  price: Number;
  description: string;
  days: IWorkingDays[];
}

export class Product extends Typegoose {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  photo: string;

  @prop({ required: true })
  price: Number;

  @prop({ required: true })
  category: string;

  @prop({ required: false })
  promotion: IProductPromotion;

  @prop({ default: new Date() })
  createdAt?: Date;
}
