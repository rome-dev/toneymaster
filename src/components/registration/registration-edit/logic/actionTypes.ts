import { IRegistration } from 'common/models';

export const REGISTRATION_FETCH_START = 'REGISTRATION_FETCH_START';
export const REGISTRATION_FETCH_SUCCESS = 'REGISTRATION_FETCH_SUCCESS';
export const REGISTRATION_FETCH_FAILURE = 'REGISTRATION_FETCH_FAILURE';
export const REGISTRATION_UPDATE_SUCCESS = 'REGISTRATION_UPDATE_SUCCESS';
export const DIVISIONS_FETCH_SUCCESS = 'REGISTRATION_DIVISIONS_FETCH_SUCCESS';
export const EVENT_FETCH_SUCCESS = 'REGISTRATION_EVENT_FETCH_SUCCESS';

export interface registrationUpdateSuccess {
  type: 'REGISTRATION_UPDATE_SUCCESS';
  payload: IRegistration;
}

export type RegistrationAction = registrationUpdateSuccess;
