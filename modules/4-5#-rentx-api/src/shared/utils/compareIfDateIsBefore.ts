import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface IParams {
  startDate: Date;
  endDate?: Date;
}

/**
 * Returns If the "startDate" is before "endDate"
 *
 * If no "endDate" is given, it will use the current date
 */
function compareIfDateIsBefore({
  startDate,
  endDate = dayjs().toDate(),
}: IParams): boolean {
  const isBefore = dayjs(startDate).isBefore(endDate);

  return isBefore;
}

export default compareIfDateIsBefore;
