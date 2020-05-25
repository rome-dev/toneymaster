import { IBracketGame } from '../bracketGames';

export const PLAYOFF_SAVED_SUCCESS = 'PLAYOFF_SAVED_SUCCESS';
export const PLAYOFF_FETCH_GAMES = 'PLAYOFF_FETCH_GAMES';
export const PLAYOFF_CLEAR_GAMES = 'PLAYOFF_CLEAR_GAMES';
export const PLAYOFF_UNDO_GAMES = 'PLAYOFF_UNDO_GAMES';

interface IPlayoffSavedSuccess {
  type: 'PLAYOFF_SAVED_SUCCESS';
  payload: boolean;
}

interface IPlayoffFetchGames {
  type: 'PLAYOFF_FETCH_GAMES';
  payload: IBracketGame[];
}

interface IPlayoffClearGames {
  type: 'PLAYOFF_CLEAR_GAMES';
}

interface IPlayoffUndoGames {
  type: 'PLAYOFF_UNDO_GAMES';
}

export type IPlayoffAction =
  | IPlayoffSavedSuccess
  | IPlayoffFetchGames
  | IPlayoffClearGames
  | IPlayoffUndoGames;
