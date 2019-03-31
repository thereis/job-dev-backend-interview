import { IWorkingDays } from "../models/Restaurant";

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

    const isValidStartDate = isValidUtcDate(times.start);
    const isValidEndDate = isValidUtcDate(times.end);

    if (!isValidStartDate || !isValidEndDate) {
      throw Error("Dates must be in UTC format.");
    }
  });

  return true;
};
