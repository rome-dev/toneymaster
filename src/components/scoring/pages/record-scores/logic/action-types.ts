import {
  IDivision,
  ITeam,
  IEventSummary,
  ISchedulesGame,
  IFacility,
  IEventDetails,
  IField,
  ISchedule,
  IPool,
} from 'common/models';

export const LOAD_SCORES_DATA_START = 'RECORD_SCORES:LOAD_SCORES_DATA_START';
export const LOAD_SCORES_DATA_SUCCESS =
  'SRECORD_SCORES:LOAD_SCORES_DATA_SUCCESS';
export const LOAD_SCORES_DATA_FAILURE =
  'RECORD_SCORES:LOAD_SCORES_DATA_FAILURE';

export const SAVE_GAME_SUCCESS = 'SCORES:SAVE_GAME_SUCCESS';
export const SAVE_GAME_FAILURE = 'SCORES:SAVE_GAME_FAILURE';

export interface loadScoresDataStart {
  type: 'RECORD_SCORES:LOAD_SCORES_DATA_START';
}

export interface loadScoresDataSuccess {
  type: 'SRECORD_SCORES:LOAD_SCORES_DATA_SUCCESS';
  payload: {
    event: IEventDetails;
    facilities: IFacility[];
    fields: IField[];
    divisions: IDivision[];
    teams: ITeam[];
    schedule: ISchedule;
    eventSummary: IEventSummary[];
    pools: IPool[];
    schedulesGames: ISchedulesGame[];
  };
}

export type RecordScoresAction = loadScoresDataStart | loadScoresDataSuccess;
