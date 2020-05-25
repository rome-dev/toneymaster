import {
  EVENTS_FETCH_SUCCESS,
  EVENTS_FETCH_FAILURE,
  DASHBOARD_TEAMS_FETCH_SUCCESS,
  FIELDS_FETCH_SUCCESS,
  DASHBOARD_FETCH_START,
  CALENDAR_EVENTS_FETCH_START,
  CALENDAR_EVENTS_FETCH_SUCCESS,
  DASHBOARD_SCHEDULES_FETCH_SUCCESS,
} from './actionTypes';
import api from 'api/api';
import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Toasts } from 'components/common';
import {
  IFacility,
  ITeam,
  IField,
  ICalendarEvent,
  IEventDetails,
  ISchedule,
} from 'common/models';

export const fetchStart = (): { type: string } => ({
  type: DASHBOARD_FETCH_START,
});

export const fetchCalendarEventsStart = (): { type: string } => ({
  type: CALENDAR_EVENTS_FETCH_START,
});

export const eventsFetchSuccess = (
  payload: IEventDetails[]
): { type: string; payload: IEventDetails[] } => ({
  type: EVENTS_FETCH_SUCCESS,
  payload,
});

export const eventDetailsFetchFailure = (): { type: string } => ({
  type: EVENTS_FETCH_FAILURE,
});

export const dashboardTeamsFetchSuccess = (
  payload: ITeam[]
): { type: string; payload: ITeam[] } => ({
  type: DASHBOARD_TEAMS_FETCH_SUCCESS,
  payload,
});

export const fieldsFetchSuccess = (payload: {
  facilities: IFacility[];
  fields: IField[];
}): {
  type: string;
  payload: { facilities: IFacility[]; fields: IField[] };
} => ({
  type: FIELDS_FETCH_SUCCESS,
  payload,
});

export const schedulesFetchSuccess = (
  payload: ISchedule[]
): { type: string; payload: ISchedule[] } => ({
  type: DASHBOARD_SCHEDULES_FETCH_SUCCESS,
  payload,
});

export const calendarEventsFetchSuccess = (
  payload: ICalendarEvent[]
): { type: string; payload: ICalendarEvent[] } => ({
  type: CALENDAR_EVENTS_FETCH_SUCCESS,
  payload,
});

export const getEvents: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = () => async (dispatch: Dispatch) => {
  dispatch(fetchStart());
  const events = await api.get('/events');
  if (!events) {
    dispatch(eventDetailsFetchFailure());
    return Toasts.errorToast("Couldn't load tournaments");
  }
  dispatch(eventsFetchSuccess(events));

  const teams = await api.get(`/teams`);

  let facilities: IFacility[] = [];
  for await (const event of events) {
    const fac = await api.get(`/facilities?event_id=${event.event_id}`);
    facilities = [...facilities, ...fac];
  }

  let fields: IField[] = [];
  for await (const facility of facilities) {
    const flds = await api.get(
      `/fields?facilities_id=${facility.facilities_id}`
    );

    const updFields = flds.map((field: IField) => ({
      ...field,
      event_id: facility.event_id,
    }));
    fields = [...fields, ...updFields];
  }

  const schedules = await api.get('/schedules');

  dispatch(fieldsFetchSuccess({ fields, facilities }));
  dispatch(schedulesFetchSuccess(schedules));
  dispatch(dashboardTeamsFetchSuccess(teams));
};

export const getCalendarEvents = () => async (dispatch: Dispatch) => {
  dispatch(fetchCalendarEventsStart());
  const response = await api.get('/calendar_events');

  if (response && !response.error) {
    return dispatch(calendarEventsFetchSuccess(response));
  }
};
