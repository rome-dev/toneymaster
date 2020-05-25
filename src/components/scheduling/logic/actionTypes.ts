import { ISchedule } from 'common/models/schedule';
import { ISchedulingSchedule } from '../types';
import { ICreateBracketModalOutput } from '../create-new-bracket';
import { IBracket } from 'common/models/playoffs/bracket';

export const SCHEDULE_FETCH_IN_PROGRESS = 'SCHEDULE_FETCH_IN_PROGRESS';
export const SCHEDULE_FETCH_SUCCESS = 'SCHEDULE_FETCH_SUCCESS';
export const SCHEDULE_FETCH_FAILURE = 'SCHEDULE_FETCH_FAILURE';

export const CREATE_NEW_SCHEDULE_SUCCESS = 'CREATE_NEW_SCHEDULE_SUCCESS';
export const CREATE_NEW_SCHEDULE_FAILURE = 'CREATE_NEW_SCHEDULE_FAILURE';

export const ADD_NEW_SCHEDULE = 'ADD_NEW_SCHEDULE';

export const CHANGE_SCHEDULE = 'CHANGE_SCHEDULE';

export const UPDATE_SCHEDULE_SUCCESS = 'UPDATE_SCHEDULE_SUCCESS';
export const UPDATE_SCHEDULE_FAILURE = 'UPDATE_SCHEDULE_FAILURE';

export const DELETE_SCHEDULE_SUCCESS = 'DELETE_SCHEDULE_SUCCESS';
export const DELETE_SCHEDULE_FAILURE = 'DELETE_SCHEDULE_FAILURE';

export const ADD_NEW_BRACKET = 'ADD_NEW_BRACKET';
export const FETCH_EVENT_BRACKETS = 'FETCH_EVENT_BRACKETS';

interface IScheduleFetchInProgress {
  type: 'SCHEDULE_FETCH_IN_PROGRESS';
}

interface IScheduleFetchSuccess {
  type: 'SCHEDULE_FETCH_SUCCESS';
  payload: {
    schedules: ISchedulingSchedule[];
  };
}

interface IScheduleFetchFailure {
  type: 'SCHEDULE_FETCH_FAILURE';
}

interface IScheduleAddNewSchedule {
  type: 'ADD_NEW_SCHEDULE';
  payload: {
    newSchedule: Partial<ISchedule>;
  };
}

interface IScheduleChangeSchedule {
  type: 'CHANGE_SCHEDULE';
  payload: {
    scheduleKey: Partial<ISchedule>;
  };
}

interface ISIScheduleUpdateSchedule {
  type: 'UPDATE_SCHEDULE_SUCCESS';
  payload: {
    schedule: ISchedulingSchedule;
  };
}

interface ISIScheduleDeleteSchedule {
  type: 'DELETE_SCHEDULE_SUCCESS';
  payload: {
    schedule: ISchedulingSchedule;
  };
}

interface IAddNewBracket {
  type: 'ADD_NEW_BRACKET';
  payload: ICreateBracketModalOutput;
}

interface IFetchEventBrackets {
  type: 'FETCH_EVENT_BRACKETS';
  payload: IBracket[];
}

export type ScheduleActionType =
  | IScheduleFetchInProgress
  | IScheduleFetchSuccess
  | IScheduleFetchFailure
  | IScheduleAddNewSchedule
  | IScheduleChangeSchedule
  | ISIScheduleUpdateSchedule
  | ISIScheduleDeleteSchedule
  | IAddNewBracket
  | IFetchEventBrackets;
