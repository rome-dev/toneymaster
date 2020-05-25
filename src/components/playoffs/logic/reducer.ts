import {
  PLAYOFF_SAVED_SUCCESS,
  IPlayoffAction,
  PLAYOFF_FETCH_GAMES,
  PLAYOFF_CLEAR_GAMES,
  PLAYOFF_UNDO_GAMES,
} from './actionTypes';
import { IBracketGame } from '../bracketGames';

export interface IPlayoffState {
  playoffSaved: boolean;
  bracketGames: IBracketGame[] | null;
  bracketGamesHistory: IBracketGame[][] | [];
}

const defaultState: IPlayoffState = {
  playoffSaved: false,
  bracketGamesHistory: [],
  bracketGames: null,
};

export default (state = defaultState, action: IPlayoffAction) => {
  switch (action.type) {
    case PLAYOFF_SAVED_SUCCESS:
      return {
        ...state,
        playoffSaved: action.payload,
      };
    case PLAYOFF_FETCH_GAMES:
      return {
        ...state,
        bracketGamesHistory: [
          ...(state.bracketGamesHistory || []),
          ...(state.bracketGames ? [state.bracketGames] : []),
        ],
        bracketGames: action.payload,
      };
    case PLAYOFF_CLEAR_GAMES:
      return {
        ...state,
        bracketGamesHistory: [],
        bracketGames: null,
      };
    case PLAYOFF_UNDO_GAMES:
      return {
        ...state,
        bracketGamesHistory: state.bracketGamesHistory.slice(
          0,
          state.bracketGamesHistory?.length - 1
        ),
        bracketGames: state.bracketGamesHistory.pop(),
      };
    default:
      return state;
  }
};
