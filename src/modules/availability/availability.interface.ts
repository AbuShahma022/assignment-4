import { DayOfWeek } from "../../../generated/prisma/enums";

export interface ICreateAvailability {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface IUpdateAvailability
  extends Partial<ICreateAvailability> {}