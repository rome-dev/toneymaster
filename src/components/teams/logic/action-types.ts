import {
  IDivision,
  IPool,
  ITeam,
  ISchedulesGameWithNames,
} from '../../../common/models';

export const LOAD_TEAMS_DATA_START = 'TEAMS:LOAD_TEAMS_DATA_START';
export const LOAD_TEAMS_DATA_SUCCESS = 'TEAMS:LOAD_TEAMS_DATA_SUCCESS';
export const LOAD_TEAMS_DATA_FAILURE = 'TEAMS:LOAD_TEAMS_DATA_FAILURE';

export const LOAD_POOLS_START = 'TEAMS:LOAD_POOLS_START';
export const LOAD_POOLS_SUCCESS = 'TEAMS:LOAD_POOLS_SUCCESS';
export const LOAD_POOLS_FAILURE = 'TEAMS:LOAD_POOLS_FAILURE';

export const SAVE_TEAMS_START = 'TEAMS:SAVE_TEAMS_START';
export const SAVE_TEAMS_SUCCESS = 'TEAMS:SAVE_TEAMS_SUCCESS';
export const SAVE_TEAMS_FAILURE = 'TEAMS:SAVE_TEAMS_FAILURE';
export const CREATE_TEAMS_SUCCESS = 'TEAMS:CREATE_TEAMS_SUCCESS';

export interface loadDivisionsTeamsStart {
  type: 'TEAMS:LOAD_TEAMS_DATA_START';
}

export interface loadDivisionsTeamsSuccess {
  type: 'TEAMS:LOAD_TEAMS_DATA_SUCCESS';
  payload: {
    divisions: IDivision[];
    teams: ITeam[];
    games: ISchedulesGameWithNames[];
  };
}

export interface loadPoolsStart {
  type: 'TEAMS:LOAD_POOLS_START';
  payload: {
    divisionId: string;
  };
}

export interface loadPoolsSuccess {
  type: 'TEAMS:LOAD_POOLS_SUCCESS';
  payload: {
    divisionId: string;
    pools: IPool[];
  };
}

export interface saveTeamsSuccess {
  type: 'TEAMS:SAVE_TEAMS_SUCCESS';
  payload: {
    teams: ITeam[];
  };
}

export interface createTeamsSuccess {
  type: 'TEAMS:CREATE_TEAMS_SUCCESS';
  payload: {
    data: ITeam[];
  };
}

export type TeamsAction =
  | loadDivisionsTeamsStart
  | loadDivisionsTeamsSuccess
  | loadPoolsStart
  | loadPoolsSuccess
  | saveTeamsSuccess
  | createTeamsSuccess;
