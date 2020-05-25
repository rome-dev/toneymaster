import { IField, ISchedule } from 'common/models';
import { IEventSummary } from 'common/models/event-summary';
import { ISchedulesDetails } from 'common/models/schedule/schedules-details';

export const FETCH_FIELDS_SUCCESS = 'FETCH_FIELDS_SUCCESS';
export const FETCH_FIELDS_FAILURE = 'FETCH_FIELDS_FAILURE';
export const FETCH_EVENT_SUMMARY_SUCCESS = 'FETCH_EVENT_SUMMARY_SUCCESS';
export const FETCH_EVENT_SUMMARY_FAILURE = 'FETCH_EVENT_SUMMARY_FAILURE';

export const SCHEDULES_DRAFT_SAVED_SUCCESS = 'SCHEDULES_DRAFT_SAVED_SUCCESS';
export const SCHEDULES_DRAFT_SAVED_FAILURE = 'SCHEDULES_DRAFT_SAVED_FAILURE';
export const SCHEDULES_SAVING_IN_PROGRESS = 'SCHEDULES_SAVING_IN_PROGRESS';
export const FETCH_SCHEDULES_DETAILS_SUCCESS =
  'FETCH_SCHEDULES_DETAILS_SUCCESS';
export const FETCH_SCHEDULES_DETAILS_FAILURE =
  'FETCH_SCHEDULES_DETAILS_FAILURE';

export const SCHEDULES_PUBLISHED_FAILURE = 'SCHEDULES_PUBLISHED_SUCCESS';
export const SCHEDULES_PUBLISHED_SUCCESS = 'SCHEDULES_PUBLISHED_FAILURE';
export const SCHEDULES_PUBLISHED_CLEAR = 'SCHEDULES_PUBLISHED_CLEAR';

export const ANOTHER_SCHEDULE_PUBLISHED = 'ANOTHER_SCHEDULE_PUBLISHED';
export const SCHEDULES_GAMES_ALREADY_EXIST = 'SCHEDULES_GAMES_ALREADY_EXIST';

interface IFetchFieldsSuccess {
  type: 'FETCH_FIELDS_SUCCESS';
  payload: IField[];
}

interface IFetchFieldsFailure {
  type: 'FETCH_FIELDS_FAILURE';
}

interface FetchEventSummarySuccess {
  type: 'FETCH_EVENT_SUMMARY_SUCCESS';
  payload: IEventSummary[];
}

interface FetchEventSummaryFailure {
  type: 'FETCH_EVENT_SUMMARY_FAILURE';
}

interface SchedulesDraftSavedSuccess {
  type: 'SCHEDULES_DRAFT_SAVED_SUCCESS';
}

interface SchedulesDraftSavedFailure {
  type: 'SCHEDULES_DRAFT_SAVED_FAILURE';
}

interface SchedulesSavingInProgress {
  type: 'SCHEDULES_SAVING_IN_PROGRESS';
  payload: boolean;
}

interface FetchSchedulesDetailsSuccess {
  type: 'FETCH_SCHEDULES_DETAILS_SUCCESS';
  payload: {
    schedule: ISchedule;
    schedulesDetails: ISchedulesDetails[];
  };
}

interface SchedulesPublishedSuccess {
  type: 'SCHEDULES_PUBLISHED_SUCCESS';
}

interface SchedulesPublishedFailure {
  type: 'SCHEDULES_PUBLISHED_FAILURE';
}

interface SchedulesPublishedClear {
  type: 'SCHEDULES_PUBLISHED_CLEAR';
}

interface FetchSchedulesDetailsFailure {
  type: 'FETCH_SCHEDULES_DETAILS_FAILURE';
}

interface AnotherSchedulePublished {
  type: 'ANOTHER_SCHEDULE_PUBLISHED';
  payload: boolean;
}

interface SchedulesGamesAlreadyExist {
  type: 'SCHEDULES_GAMES_ALREADY_EXIST';
  payload: boolean;
}

export type FieldsAction = IFetchFieldsSuccess | IFetchFieldsFailure;

export type IScheduleAction =
  | FetchSchedulesDetailsSuccess
  | FetchSchedulesDetailsFailure
  | SchedulesSavingInProgress
  | SchedulesDraftSavedSuccess
  | SchedulesDraftSavedFailure
  | FetchEventSummarySuccess
  | FetchEventSummaryFailure
  | SchedulesPublishedSuccess
  | SchedulesPublishedFailure
  | SchedulesPublishedClear
  | AnotherSchedulePublished
  | SchedulesGamesAlreadyExist;
