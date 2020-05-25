import moment from 'moment';
import { IEventDetails } from 'common/models';

const timeToDate = (time: string) => {
  if (!time) {
    return new Date();
  }

  return moment(time.split(':').join(''), 'HHmmss').format();
};

const dateToTime = (date: Date | string) => moment(date).format('HH:mm:ss');

const getTimeFromString = (
  time: string,
  type: 'hours' | 'minutes' | 'seconds' | 'hh' | 'mm' | 'ss'
): number => {
  if (!time) {
    return 0;
  }
  const divides = time.split(':').map((timeDiv: string) => Number(timeDiv));
  const [hours, minutes, seconds] = divides;

  switch (type) {
    case 'hours':
      return hours;
    case 'minutes':
      return hours * 60 + minutes;
    case 'seconds':
      return hours * 3600 + minutes * 60 + seconds;
    case 'hh':
      return hours;
    case 'mm':
      return minutes;
    case 'ss':
      return seconds;
    default:
      return -1;
  }
};

const timeToString = (time: number): string => {
  const hours = Math.floor(time / 60);
  const minutes = time - hours * 60;
  const seconds = time * 60 - hours * 3600 - minutes * 60;

  return [hours, minutes, seconds]
    .toString()
    .split(',')
    .map((el: string) => (el.length < 2 ? '0' + el : el))
    .join(':');
};

const compareTime = (a: string, b: string) => +new Date(b) - +new Date(a);

const calculateTournamentDays = (event: IEventDetails) => {
  const startDate = event?.event_startdate;
  const endDate = event?.event_enddate;

  const daysDiff = moment(endDate).diff(startDate, 'day');

  const days = [moment(startDate).toISOString()];

  [...Array(daysDiff)].map((_v, i) =>
    days.push(
      moment(startDate)
        .add(i + 1, 'days')
        .toISOString()
    )
  );

  return days;
};

export {
  timeToDate,
  dateToTime,
  getTimeFromString,
  timeToString,
  compareTime,
  calculateTournamentDays,
};
