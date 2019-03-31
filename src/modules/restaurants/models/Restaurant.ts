import { prop, Typegoose } from "typegoose";

export interface IWorkingDays {
  dayOfWeek: string;
  times: {
    start: string;
    end: string;
  };
}

export class Restaurant extends Typegoose {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  address: string;

  @prop({ required: true })
  photo: string;

  @prop({ required: true })
  activityDate: IWorkingDays[];

  @prop({ default: new Date() })
  createdAt?: Date;
}
