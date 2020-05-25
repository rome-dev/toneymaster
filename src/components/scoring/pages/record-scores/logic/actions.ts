import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  RecordScoresAction,
  LOAD_SCORES_DATA_START,
  LOAD_SCORES_DATA_SUCCESS,
  LOAD_SCORES_DATA_FAILURE,
  SAVE_GAME_SUCCESS,
  SAVE_GAME_FAILURE,
} from './action-types';
import Api from 'api/api';
import {
  IFacility,
  IEventDetails,
  IDivision,
  ISchedulesGame,
  ISchedule,
  ScheduleStatuses,
} from 'common/models';
import { Toasts } from 'components/common';
import { chunk } from 'lodash-es';

const loadScoresData: ActionCreator<ThunkAction<
  void,
  {},
  null,
  RecordScoresAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_SCORES_DATA_START,
    });

    const events = await Api.get(`/events?event_id=${eventId}`);
    const divisions = await Api.get(`/divisions?event_id=${eventId}`);
    const teams = await Api.get(`/teams?event_id=${eventId}`);
    const eventSummary = await Api.get(`/event_summary?event_id=${eventId}`);
    const schedules = await Api.get(`/schedules?event_id=${eventId}`);
    const facilities = await Api.get(`/facilities?event_id=${eventId}`);
    const fields = (
      await Promise.all(
        facilities.map((it: IFacility) =>
          Api.get(`/fields?facilities_id=${it.facilities_id}`)
        )
      )
    ).flat();

    const pools = (
      await Promise.all(
        divisions.map((it: IDivision) =>
          Api.get(`/pools?division_id=${it.division_id}`)
        )
      )
    ).flat();

    const currentEvent = events.find(
      (it: IEventDetails) => it.event_id === eventId
    );

    const activeSchedule = schedules.find(
      (it: ISchedule) => it.schedule_status === ScheduleStatuses.PUBLISHED
    );

    const schedulesGames = await Api.get(
      `/games?schedule_id=${activeSchedule.schedule_id}`
    );

    dispatch({
      type: LOAD_SCORES_DATA_SUCCESS,
      payload: {
        event: currentEvent,
        schedule: activeSchedule || null,
        facilities,
        fields,
        divisions,
        teams,
        eventSummary,
        pools,
        schedulesGames,
      },
    });
  } catch {
    dispatch({
      type: LOAD_SCORES_DATA_FAILURE,
    });
  }
};

const saveGames: ActionCreator<ThunkAction<
  void,
  {},
  null,
  RecordScoresAction
>> = (games: ISchedulesGame[]) => async (dispatch: Dispatch) => {
  try {
    const schedulesGamesChunk = chunk(games, 50);
    const gamesResponses = await Promise.all(
      schedulesGamesChunk.map(arr => Api.put('/games', arr))
    );

    const gamesResponseSuccess = gamesResponses.every(item => item);

    if (!gamesResponseSuccess) {
      throw Error('Something happened during the saving process');
    }

    dispatch({
      type: SAVE_GAME_SUCCESS,
    });

    Toasts.successToast('Schedules data successfully saved and published!');
  } catch (err) {
    Toasts.successToast(err);

    dispatch({
      type: SAVE_GAME_FAILURE,
    });
  }
};

export { loadScoresData, saveGames };
