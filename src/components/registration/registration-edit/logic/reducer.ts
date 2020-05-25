import {
  REGISTRATION_FETCH_SUCCESS,
  REGISTRATION_FETCH_FAILURE,
  REGISTRATION_UPDATE_SUCCESS,
  REGISTRATION_FETCH_START,
  DIVISIONS_FETCH_SUCCESS,
  EVENT_FETCH_SUCCESS,
} from './actionTypes';
import { sortByField } from 'helpers';
import { IDivision, IRegistration, IEventDetails } from 'common/models';
import { SortByFilesTypes } from 'common/enums';

export interface IState {
  data?: Partial<IRegistration>;
  divisions: IDivision[];
  event?: IEventDetails;
  isLoading: boolean;
  error: boolean;
}

const defaultState: IState = {
  data: undefined,
  divisions: [],
  event: undefined,
  isLoading: true,
  error: false,
};

export default (
  state = defaultState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case REGISTRATION_FETCH_START: {
      return { ...defaultState };
    }
    case REGISTRATION_FETCH_SUCCESS: {
      return {
        ...state,
        data: action.payload[0],
        isLoading: false,
        error: false,
      };
    }
    case REGISTRATION_FETCH_FAILURE: {
      return {
        ...state,
        error: true,
      };
    }
    case REGISTRATION_UPDATE_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        error: false,
      };
    }
    case DIVISIONS_FETCH_SUCCESS: {
      return {
        ...state,
        divisions: sortByField(action.payload, SortByFilesTypes.DIVISIONS),
        error: false,
      };
    }
    case EVENT_FETCH_SUCCESS: {
      return { ...state, event: action.payload };
    }
    default:
      return state;
  }
};
