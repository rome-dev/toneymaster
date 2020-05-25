import { Dispatch } from 'redux';
import { IAppState } from 'reducers/root-reducer.types';
import { chunk, orderBy } from 'lodash-es';
import {
  PLAYOFF_SAVED_SUCCESS,
  PLAYOFF_FETCH_GAMES,
  PLAYOFF_CLEAR_GAMES,
  PLAYOFF_UNDO_GAMES,
} from './actionTypes';
import {
  mapBracketData,
  mapBracketGames,
  mapFetchedBracket,
  mapFetchedBracketGames,
} from '../mapBracketsData';
import { IBracketGame } from '../bracketGames';
import api from 'api/api';
import { successToast, errorToast } from 'components/common/toastr/showToasts';
import { addNewBracket } from 'components/scheduling/logic/actions';
import { IPlayoffGame } from 'common/models/playoffs/bracket-game';

type IGetState = () => IAppState;

const playoffSavedSuccess = (payload: boolean) => ({
  type: PLAYOFF_SAVED_SUCCESS,
  payload,
});

export const fetchBracketGames = (payload: IBracketGame[]) => ({
  type: PLAYOFF_FETCH_GAMES,
  payload,
});

export const clearBracketGames = () => ({
  type: PLAYOFF_CLEAR_GAMES,
});

export const onUndoBrackets = () => ({
  type: PLAYOFF_UNDO_GAMES,
});

const newError = () =>
  errorToast('An error occurred while saving the playoff data');

const callPostPut = (uri: string, data: any, isUpdate: boolean) =>
  isUpdate ? api.put(uri, data) : api.post(uri, data);

const managePlayoffSaving = (
  bracketGames: IBracketGame[],
  isCreate: boolean
) => async (dispatch: Dispatch, getState: IGetState) => {
  const { scheduling } = getState();
  const { bracket } = scheduling;

  if (!bracket) return newError();

  const loadedGames: IPlayoffGame[] = await api.get(`/games_brackets`, {
    bracket_id: bracket.id,
  });

  // POST/PUT Bracket
  const bracketData = await mapBracketData(bracket, true);
  const bracketResp = await callPostPut(
    '/brackets_details',
    bracketData,
    !isCreate
  );

  if (!bracketResp) return newError();

  // POST/PUT BracketGames
  const existingGames: IBracketGame[] = [];
  const newGames: IBracketGame[] = [];

  const existingGameIds = loadedGames.map(item => item.game_id);
  const removedGames = bracketGames.filter(item => item.hidden);
  bracketGames = bracketGames.filter(item => !item.hidden);

  bracketGames.forEach(item =>
    existingGameIds.includes(item.id)
      ? existingGames.push(item)
      : newGames.push(item)
  );

  const existingBracketGames = await mapBracketGames(existingGames, bracket);
  const existingBracketGamesChunk = chunk(existingBracketGames, 50);

  const existingBracketGamesResp = await Promise.all(
    existingBracketGamesChunk.map(
      async arr => await api.put('/games_brackets', arr)
    )
  );

  const newBracketGames = await mapBracketGames(newGames, bracket);
  const newBracketGamesChunk = chunk(newBracketGames, 50);

  const newBracketGamesResp = await Promise.all(
    newBracketGamesChunk.map(
      async arr => await api.post('/games_brackets', arr)
    )
  );

  // Delete games that were removed in the component
  const mappedRemovedGames = await mapBracketGames(removedGames, bracket);
  const mappedRemovedGamesChunk = chunk(mappedRemovedGames, 50);

  await Promise.all(
    mappedRemovedGamesChunk.map(
      async arr => await api.delete('/games_brackets', arr)
    )
  );

  const existingBracketGamesRespOk = existingBracketGamesResp.every(
    item => item
  );
  const newBracketGamesRespOk = newBracketGamesResp.every(item => item);

  const responseOk =
    existingGames?.length && newGames?.length
      ? existingBracketGamesRespOk && newBracketGamesRespOk
      : existingBracketGamesRespOk || newBracketGamesRespOk;

  if (bracketResp && responseOk) {
    dispatch(playoffSavedSuccess(true));
    successToast('Playoff data was successfully saved!');
    return;
  }

  dispatch(playoffSavedSuccess(false));
  errorToast('Something happened during the saving process');
};

export const createPlayoff = (bracketGames: IBracketGame[]) => (
  dispatch: Dispatch
) => {
  dispatch<any>(managePlayoffSaving(bracketGames, true));
};

export const savePlayoff = (bracketGames: IBracketGame[]) => (
  dispatch: Dispatch
) => {
  dispatch<any>(managePlayoffSaving(bracketGames, false));
};

export const retrieveBrackets = (bracketId: string) => async (
  dispatch: Dispatch
) => {
  const response = await api.get('/brackets_details', {
    bracket_id: bracketId,
  });

  if (response?.length) {
    const bracketData = mapFetchedBracket(response[0]);
    dispatch(addNewBracket(bracketData));
  }
};

export const retrieveBracketsGames = (bracketId: string) => async (
  dispatch: Dispatch,
  getState: IGetState
) => {
  const response = await api.get('/games_brackets', { bracket_id: bracketId });
  const fields = getState().pageEvent.tournamentData.fields;

  if (response?.length) {
    const bracketGames = mapFetchedBracketGames(response, fields);
    const orderedGames = orderBy(bracketGames, ['divisionId', 'index']);
    dispatch(fetchBracketGames(orderedGames));
  }
};
