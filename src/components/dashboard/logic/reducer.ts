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
import {
  ITeam,
  IField,
  ICalendarEvent,
  IEventDetails,
  IFacility,
  ISchedule,
} from 'common/models';
import { orderBy } from 'lodash';

export interface IState {
  data?: IEventDetails[];
  teams: ITeam[];
  fields: IField[];
  facilities: IFacility[];
  schedules: ISchedule[];
  calendarEvents: ICalendarEvent[];
  isLoading: boolean;
  isDetailLoading: boolean;
  areCalendarEventsLoading: boolean;
  error: boolean;
}

const defaultState: IState = {
  data: [],
  teams: [],
  fields: [],
  facilities: [],
  schedules: [],
  calendarEvents: [],
  isLoading: false,
  isDetailLoading: true,
  areCalendarEventsLoading: false,
  error: false,
};

export default (
  state = defaultState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case DASHBOARD_FETCH_START: {
      return {
        ...state,
        isLoading: true,
        error: false,
      };
    }
    case EVENTS_FETCH_SUCCESS: {
      const orderedEvents = orderBy(
        action.payload,
        [
          ({ is_published_YN }: IEventDetails) => {
            return is_published_YN;
          },
          ({ event_startdate }: IEventDetails) => {
            return event_startdate;
          },
        ],
        ['desc', 'desc']
      );

      return {
        ...state,
        data: orderedEvents,
        isLoading: false,
        error: false,
      };
    }
    case EVENTS_FETCH_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    }
    case DASHBOARD_TEAMS_FETCH_SUCCESS: {
      return {
        ...state,
        teams: action.payload,
        isDetailLoading: false,
        error: false,
      };
    }
    case FIELDS_FETCH_SUCCESS: {
      return {
        ...state,
        facilities: action.payload.facilities,
        fields: action.payload.fields,
        isDetailLoading: false,
        error: false,
      };
    }
    case CALENDAR_EVENTS_FETCH_START: {
      return {
        ...state,
        areCalendarEventsLoading: true,
      };
    }
    case CALENDAR_EVENTS_FETCH_SUCCESS: {
      return {
        ...state,
        calendarEvents: action.payload.sort(
          (a: ICalendarEvent, b: ICalendarEvent) =>
            +new Date(a.cal_event_datetime) - +new Date(b.cal_event_datetime)
        ),
        areCalendarEventsLoading: false,
      };
    }
    case DASHBOARD_SCHEDULES_FETCH_SUCCESS: {
      return { ...state, schedules: action.payload };
    }
    default:
      return state;
  }
};
