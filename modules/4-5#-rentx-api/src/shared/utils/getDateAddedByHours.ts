import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * Returns one current date added by given hours
 */
function getDateAddedByHours(hours: number): Date {
  const date = dayjs().add(hours, 'hour').toDate();

  return date;
}

export default getDateAddedByHours;
