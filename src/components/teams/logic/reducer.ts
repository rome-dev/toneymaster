import {
  TeamsAction,
  LOAD_TEAMS_DATA_START,
  LOAD_TEAMS_DATA_SUCCESS,
  LOAD_POOLS_START,
  LOAD_POOLS_SUCCESS,
  SAVE_TEAMS_SUCCESS,
  CREATE_TEAMS_SUCCESS,
} from './action-types';
import {
  IDivision,
  IPool,
  ITeam,
  ISchedulesGameWithNames,
} from 'common/models';

export interface ITeamsState {
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
  games: ISchedulesGameWithNames[];
  isLoading: boolean;
  isLoaded: boolean;
}

const initialState = {
  divisions: [],
  pools: [],
  teams: [],
  games: [],
  isLoading: false,
  isLoaded: false,
};

const teamsReducer = (
  state: ITeamsState = initialState,
  action: TeamsAction
) => {
  switch (action.type) {
    case LOAD_TEAMS_DATA_START: {
      return { ...initialState, isLoading: true };
    }
    case LOAD_TEAMS_DATA_SUCCESS: {
      const { divisions, teams, games } = action.payload;

      return {
        ...state,
        divisions,
        teams,
        games,
        isLoading: false,
        isLoaded: true,
      };
    }
    case LOAD_POOLS_START: {
      const { divisionId } = action.payload;

      return {
        ...state,
        divisions: state.divisions.map(it =>
          it.division_id === divisionId ? { ...it, isPoolsLoading: true } : it
        ),
      };
    }
    case LOAD_POOLS_SUCCESS: {
      const { pools, divisionId } = action.payload;

      return {
        ...state,
        divisions: state.divisions.map(it =>
          it.division_id === divisionId
            ? { ...it, isPoolsLoading: false, isPoolsLoaded: true }
            : it
        ),
        pools: [...state.pools, ...pools],
      };
    }

    case SAVE_TEAMS_SUCCESS: {
      const { teams } = action.payload;

      return { ...state, teams };
    }
    case CREATE_TEAMS_SUCCESS: {
      const { data } = action.payload;
      return { ...state, teams: [...state.teams, ...data] };
    }
    default:
      return state;
  }
};

export default teamsReducer;
