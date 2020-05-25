import moment from 'moment';
import { DefaultSelectValues } from 'common/enums';

const getSelectDayOptions = (eventDays: string[]) => {
  const selectDayOptions = [
    {
      label: DefaultSelectValues.ALL,
      value: DefaultSelectValues.ALL,
    },
    ...eventDays.map(day => ({
      label: moment(day).format('l'),
      value: day,
    })),
  ];

  return selectDayOptions;
};

export { getSelectDayOptions };
