export interface IFetchedBracket {
  bracket_id: string;
  schedule_id: string;
  event_id: string;
  bracket_name: string;
  bracket_date: Date | string | null;
  align_games: 1 | 0 | null;
  adjust_columns: 1 | 0 | null;
  start_timeslot: string | null;
  custom_warmup: string | null;
  end_timeslot: string | null;
  fields_excluded: string | null;
  is_active_YN: 1 | 0 | null;
  is_published_YN: 1 | 0;
  created_by: string;
  created_datetime: string;
  updated_by: string | null;
  updated_datetime: string | null;
}

export interface IBracket {
  id: string;
  name: string;
  scheduleId: string;
  alignItems: boolean;
  adjustTime: boolean;
  warmup: string;
  bracketDate: string;
  eventId: string;
  published: boolean;
  createdBy: string;
  createDate: string;
  updatedBy: string | null;
  updateDate: string | null;
  startTimeSlot: string;
  endTimeSlot: string;
}

export interface ISchedulingBracket extends IBracket {
  createdByName: string | null;
  updatedByName: string | null;
}
