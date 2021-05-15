import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface IParams {
  date: Date | string;
  dateToCompare?: Date | string;
}

/**
 * Returns the difference in days between two dates.
 *
 * If no "dateToCompare" is given, it will use the current date
 */
function getDifferenceInDaysBetweenDates({
  date,
  dateToCompare = new Date(),
}: IParams): number {
  const formattedDate = dayjs(date).utc().local().format();

  const formattedDateToCompare = dayjs(dateToCompare).utc().local().format();

  const differenceInDays = dayjs(formattedDate).diff(
    formattedDateToCompare,
    'days',
  );

  return differenceInDays;
}

export default getDifferenceInDaysBetweenDates;
