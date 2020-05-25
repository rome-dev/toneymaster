import { ITournamentData, IEvent } from 'common/models';
import { IEntity } from 'common/types';
import { EntryPoints } from 'common/enums';

export const LOAD_AUTH_PAGE_DATA_START = 'LOAD_AUTH_PAGE_DATA_START';
export const LOAD_AUTH_PAGE_DATA_SUCCESS = 'LOAD_AUTH_PAGE_DATA_SUCCESS';
export const LOAD_AUTH_PAGE_DATA_FAILURE = 'LOAD_AUTH_PAGE_DATA_FAILURE';

export const CLEAR_AUTH_PAGE_DATA = 'CLEAR_AUTH_PAGE_DATA';

export const PUBLISH_TOURNAMENT_SUCCESS = 'PUBLISH_TOURNAMENT_SUCCESS';
export const PUBLISH_TOURNAMENT_FAILURE = 'PUBLISH_TOURNAMENT_FAILURE';

export const ADD_ENTITY_TO_LIBRARY_SUCCESS = 'ADD_ENTITY_TO_LIBRARY_SUCCESS';
export const ADD_ENTITY_TO_LIBRARY_FAILURE = 'ADD_ENTITY_TO_LIBRARY_FAILURE';

export const ADD_ENTITIES_TO_LIBRARY_SUCCESS =
  'ADD_ENTITIES_TO_LIBRARY_SUCCESS';
export const ADD_ENTITIES_TO_LIBRARY_FAILURE =
  'ADD_ENTITIES_TO_LIBRARY_FAILURE';

export interface loadAuthPageDataStart {
  type: 'LOAD_AUTH_PAGE_DATA_START';
}

export interface loadAuthPageDataSuccess {
  type: 'LOAD_AUTH_PAGE_DATA_SUCCESS';
  payload: {
    tournamentData: ITournamentData;
  };
}

export interface cleatAuthPageData {
  type: 'CLEAR_AUTH_PAGE_DATA';
}

export interface publishTournamentSuccess {
  type: 'PUBLISH_TOURNAMENT_SUCCESS';
  payload: {
    event: IEvent;
  };
}

export interface addEntityToLibrarySuccess {
  type: 'ADD_ENTITY_TO_LIBRARY_SUCCESS';
  payload: {
    entity: IEntity;
    entryPoint: EntryPoints;
  };
}

export interface addEntitiesToLibrarySuccess {
  type: 'ADD_ENTITIES_TO_LIBRARY_SUCCESS';
  payload: {
    entities: IEntity[];
    entryPoint: EntryPoints;
  };
}

export type AuthPageAction =
  | loadAuthPageDataStart
  | loadAuthPageDataSuccess
  | cleatAuthPageData
  | publishTournamentSuccess
  | addEntityToLibrarySuccess
  | addEntitiesToLibrarySuccess;
