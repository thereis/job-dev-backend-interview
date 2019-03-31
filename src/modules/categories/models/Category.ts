import { prop, Typegoose } from "typegoose";

export class Category extends Typegoose {
  @prop({ required: true })
  name: string;

  @prop({ default: new Date() })
  createdAt?: Date;
}
