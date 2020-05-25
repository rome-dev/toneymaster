import {
  EVENT_DETAILS_FETCH_START,
  EVENT_DETAILS_FETCH_SUCCESS,
  EVENT_DETAILS_FETCH_FAILURE,
  EventDetailsAction,
} from './actionTypes';
import { IEventDetails } from 'common/models';

export interface IEventState {
  data?: IEventDetails;
  error: boolean;
  isEventLoading: boolean;
  isEventLoaded: boolean;
}

const defaultState: IEventState = {
  data: undefined,
  isEventLoading: false,
  isEventLoaded: false,
  error: false,
};

export default (state = defaultState, action: EventDetailsAction) => {
  switch (action.type) {
    case EVENT_DETAILS_FETCH_START: {
      return {
        ...state,
        isEventLoading: true,
      };
    }
    case EVENT_DETAILS_FETCH_SUCCESS: {
      return {
        ...state,
        data: {
          ...action.payload[0],
        },
        isEventLoading: false,
        isEventLoaded: true,
      };
    }
    case EVENT_DETAILS_FETCH_FAILURE: {
      return {
        ...state,
        error: true,
      };
    }
    default:
      return state;
  }
};
