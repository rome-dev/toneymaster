import { IEventDetails } from 'common/models';

export const EVENT_DETAILS_FETCH_START = 'EVENT_DETAILS_FETCH_START';
export const EVENT_DETAILS_FETCH_SUCCESS = 'EVENT_DETAILS_FETCH_SUCCESS';
export const EVENT_DETAILS_FETCH_FAILURE = 'EVENT_DETAILS_FETCH_FAILURE';

export interface EventDetailsFetchStart {
  type: 'EVENT_DETAILS_FETCH_START';
}

export interface EventDetailsFetchSuccess {
  type: 'EVENT_DETAILS_FETCH_SUCCESS';
  payload: IEventDetails[];
}

export interface EventDetailsFetchFailure {
  type: 'EVENT_DETAILS_FETCH_FAILURE';
}

export type EventDetailsAction =
  | EventDetailsFetchStart
  | EventDetailsFetchSuccess
  | EventDetailsFetchFailure;
