import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface IParams {
  date: Date | string;
  dateToCompare?: Date | string;
}

/**
 * Returns the difference between two dates.
 *
 * If no "dateToCompare" is given, it will use the current date
 */
function getDifferenceInHoursBetweenDates({
  date,
  dateToCompare = new Date(),
}: IParams): number {
  const formattedDate = dayjs(date).utc().local().format();

  const formattedDateToCompare = dayjs(dateToCompare).utc().local().format();

  const differenceInHours = dayjs(formattedDate).diff(
    formattedDateToCompare,
    'hours',
  );

  return differenceInHours;
}

export default getDifferenceInHoursBetweenDates;
