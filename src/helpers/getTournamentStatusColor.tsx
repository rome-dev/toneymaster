import { EventStatuses } from 'common/enums';
import { ScheduleStatuses } from 'common/models';

export const getTournamentStatusColor = (status: number | string) => {
  switch (status) {
    case EventStatuses.Draft:
    case ScheduleStatuses.DRAFT:
      return { backgroundColor: '#ffcb00' };
    case EventStatuses.Published:
    case ScheduleStatuses.PUBLISHED:
      return { backgroundColor: '#00cc47' };
    default:
      return null;
  }
};
