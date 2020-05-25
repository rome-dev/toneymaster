import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  AuthPageAction,
  LOAD_AUTH_PAGE_DATA_START,
  LOAD_AUTH_PAGE_DATA_SUCCESS,
  LOAD_AUTH_PAGE_DATA_FAILURE,
  CLEAR_AUTH_PAGE_DATA,
  PUBLISH_TOURNAMENT_SUCCESS,
  PUBLISH_TOURNAMENT_FAILURE,
  ADD_ENTITY_TO_LIBRARY_SUCCESS,
  ADD_ENTITY_TO_LIBRARY_FAILURE,
  ADD_ENTITIES_TO_LIBRARY_SUCCESS,
  ADD_ENTITIES_TO_LIBRARY_FAILURE,
} from './action-types';
import { IAppState } from 'reducers/root-reducer.types';
import Api from 'api/api';
import { Toasts } from 'components/common';
import { IEventDetails, IRegistration, IFacility } from 'common/models';
import {
  EventStatuses,
  EntryPoints,
  MethodTypes,
  LibraryStates,
} from 'common/enums';
import { IEntity } from 'common/types';
import { sentToServerByRoute, removeObjKeysByEntryPoint } from 'helpers';

const loadAuthPageData: ActionCreator<ThunkAction<
  void,
  {},
  null,
  AuthPageAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_AUTH_PAGE_DATA_START,
    });

    const events = await Api.get(`/events?event_id=${eventId}`);
    const registrations = await Api.get(`/registrations?event_id=${eventId}`);
    const facilities = await Api.get(`/facilities?event_id=${eventId}`);
    const divisions = await Api.get(`/divisions?event_id=${eventId}`);
    const teams = await Api.get(`/teams?event_id=${eventId}`);
    const fields = (
      await Promise.all(
        facilities.map((it: IFacility) =>
          Api.get(`/fields?facilities_id=${it.facilities_id}`)
        )
      )
    ).flat();
    const schedules = await Api.get(`/schedules?event_id=${eventId}`);

    const currentEvent = events.find(
      (it: IEventDetails) => it.event_id === eventId
    );

    const currentRegistration = registrations.find(
      (it: IRegistration) => it.event_id === eventId
    );

    dispatch({
      type: LOAD_AUTH_PAGE_DATA_SUCCESS,
      payload: {
        tournamentData: {
          event: currentEvent,
          registration: currentRegistration,
          facilities,
          fields,
          divisions,
          teams,
          schedules,
        },
      },
    });
  } catch (err) {
    dispatch({
      type: LOAD_AUTH_PAGE_DATA_FAILURE,
    });
  }
};

const clearAuthPageData = () => ({
  type: CLEAR_AUTH_PAGE_DATA,
});

const toggleTournamentStatus = () => async (
  dispatch: Dispatch,
  getState: () => IAppState
) => {
  try {
    const { tournamentData } = getState().pageEvent;
    const { event } = tournamentData;

    console.log(event?.is_published_YN);

    const updatedEvent = {
      ...event,
      is_published_YN:
        event?.is_published_YN === EventStatuses.Draft
          ? EventStatuses.Published
          : EventStatuses.Draft,
    } as IEventDetails;

    await Api.put(`/events?event_id=${updatedEvent.event_id}`, updatedEvent);

    dispatch({
      type: PUBLISH_TOURNAMENT_SUCCESS,
      payload: {
        event: updatedEvent,
      },
    });

    Toasts.successToast('Changes successfully saved.');
  } catch {
    dispatch({
      type: PUBLISH_TOURNAMENT_FAILURE,
    });
  }
};

const addEntityToLibrary = (entity: IEntity, entryPoint: EntryPoints) => async (
  dispatch: Dispatch
) => {
  try {
    if (entity.is_library_YN === LibraryStates.TRUE) {
      throw new Error('The item is already in the library.');
    }

    const updatedEntity: IEntity = {
      ...entity,
      is_library_YN: LibraryStates.TRUE,
    };

    const clearEntity = removeObjKeysByEntryPoint(updatedEntity, entryPoint);

    await sentToServerByRoute(clearEntity, entryPoint, MethodTypes.PUT);

    dispatch({
      type: ADD_ENTITY_TO_LIBRARY_SUCCESS,
      payload: {
        entity: updatedEntity,
        entryPoint,
      },
    });

    Toasts.successToast('Changes successfully saved.');
  } catch (err) {
    dispatch({
      type: ADD_ENTITY_TO_LIBRARY_FAILURE,
    });

    Toasts.errorToast(err.message);
  }
};

const addEntitiesToLibrary = (
  entities: IEntity[],
  entryPoint: EntryPoints
) => async (dispatch: Dispatch) => {
  try {
    const updatedEntities = entities.map(entity => ({
      ...entity,
      is_library_YN: LibraryStates.TRUE,
    }));

    const clearEntities = updatedEntities.map(entity =>
      removeObjKeysByEntryPoint(entity, entryPoint)
    );

    await Promise.all(
      clearEntities.map(entity =>
        sentToServerByRoute(entity, entryPoint, MethodTypes.PUT)
      )
    );

    dispatch({
      type: ADD_ENTITIES_TO_LIBRARY_SUCCESS,
      payload: {
        entities: updatedEntities,
        entryPoint,
      },
    });

    Toasts.successToast('Changes successfully saved.');
  } catch (err) {
    dispatch({
      type: ADD_ENTITIES_TO_LIBRARY_FAILURE,
    });

    Toasts.errorToast(err.message);
  }
};

export {
  loadAuthPageData,
  clearAuthPageData,
  toggleTournamentStatus,
  addEntityToLibrary,
  addEntitiesToLibrary,
};
