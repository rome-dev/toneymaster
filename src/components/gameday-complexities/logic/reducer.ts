import {
  EVENTS_FETCH_SUCCESS,
  FACILITIES_FETCH_SUCCESS,
  FIELDS_FETCH_SUCCESS,
  BACKUP_PLANS_FETCH_SUCCESS,
  ADD_BACKUP_PLAN_SUCCESS,
  DELETE_BACKUP_PLAN,
  UPDATE_BACKUP_PLAN,
} from './actionTypes';
import { IFacility, IField, IEventDetails } from 'common/models';
import { IBackupPlan } from 'common/models/backup_plan';

export interface IState {
  data?: IEventDetails[];
  facilities: IFacility[];
  fields: IField[];
  backupPlans: IBackupPlan[];
  isLoading: boolean;
}

const defaultState: IState = {
  data: [],
  facilities: [],
  fields: [],
  backupPlans: [],
  isLoading: true,
};

export default (
  state = defaultState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case EVENTS_FETCH_SUCCESS: {
      return {
        ...state,
        data: action.payload.sort(
          (a: IEventDetails, b: IEventDetails) =>
            +new Date(b.event_startdate) - +new Date(a.event_startdate)
        ),
      };
    }
    case FACILITIES_FETCH_SUCCESS: {
      return {
        ...state,
        facilities: action.payload,
      };
    }
    case FIELDS_FETCH_SUCCESS: {
      return {
        ...state,
        fields: action.payload,
      };
    }
    case BACKUP_PLANS_FETCH_SUCCESS: {
      return {
        ...state,
        backupPlans: action.payload,
        isLoading: false,
      };
    }
    case ADD_BACKUP_PLAN_SUCCESS: {
      return {
        ...state,
        backupPlans: [...state.backupPlans, action.payload],
      };
    }
    case DELETE_BACKUP_PLAN: {
      return {
        ...state,
        backupPlans: state.backupPlans.filter(
          backupPlan => backupPlan.backup_plan_id !== action.payload
        ),
      };
    }
    case UPDATE_BACKUP_PLAN: {
      return {
        ...state,
        backupPlans: state.backupPlans.map(backupPlan =>
          backupPlan.backup_plan_id === action.payload.backup_plan_id
            ? action.payload
            : backupPlan
        ),
      };
    }
    default:
      return state;
  }
};
