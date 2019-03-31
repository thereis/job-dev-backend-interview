import { IWorkingDays } from "../modules/restaurants/models/Restaurant";

import * as moment from "moment";

export const isValidUtcDate = (date: string) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(date)) return false;
  var d = new Date(date);
  return d.toISOString() === date;
};

export const checkIfIsValidWorkingDate = (dates: IWorkingDays[]) => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ];

  if (dates.length === 0) {
    throw Error("Dates must not be empty.");
  }

  dates.forEach(date => {
    const { dayOfWeek, times } = date;

    if (!dayOfWeek) {
      throw Error("Day of week is not defined");
    }

    if (!times) {
      throw Error("Times is not defined.");
    }

    const isDateRange = dayOfWeek.includes("-");

    if (isDateRange) {
      const splittedDays = dayOfWeek.split("-");

      splittedDays.forEach(day => {
        day = day.toLowerCase();

        if (!days.includes(day)) {
          throw Error("Not a valid week day.");
        }
      });
    } else {
      if (!days.includes(dayOfWeek.toLowerCase())) {
        throw Error("Not a valid week day.");
      }
    }

    if (!times["start"] || !times["end"]) {
      throw Error("start or end is not defined for times.");
    }

    const isValidStartTime = moment(times.start, "HH:mm", true);
    const isValidEndTime = moment(times.end, "HH:mm", true);

    if (!isValidStartTime.isValid() || !isValidEndTime.isValid()) {
      throw Error(
        "Check if the start and end parameters are valid hour:minute."
      );
    }

    let diff = moment(isValidEndTime).diff(isValidStartTime, "minutes");

    if (diff < 15) {
      throw Error("This restaurant need to be opened for at least 15 minutes.");
    }
  });

  return true;
};
