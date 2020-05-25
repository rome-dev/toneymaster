import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import {
  ReportingAction,
  LOAD_REPORTING_DATA_START,
  LOAD_REPORTING_DATA_SUCCESS,
  LOAD_REPORTING_DATA_FAILURE,
} from './action-types';
import Api from 'api/api';
import {
  IFacility,
  IEventDetails,
  ScheduleStatuses,
  ISchedule,
  IDivision,
} from 'common/models';

const loadReportingData: ActionCreator<ThunkAction<
  void,
  {},
  null,
  ReportingAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_REPORTING_DATA_START,
    });

    const events = await Api.get(`/events?event_id=${eventId}`);
    const divisions = await Api.get(`/divisions?event_id=${eventId}`);
    const teams = await Api.get(`/teams?event_id=${eventId}`);
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

    const schedulesDetails = await Api.get(
      `/schedules_details?schedule_id=${activeSchedule.schedule_id}`
    );

    dispatch({
      type: LOAD_REPORTING_DATA_SUCCESS,
      payload: {
        event: currentEvent,
        schedule: activeSchedule || null,
        facilities,
        fields,
        divisions,
        teams,
        schedulesDetails,
        pools,
      },
    });
  } catch {
    dispatch({
      type: LOAD_REPORTING_DATA_FAILURE,
    });
  }
};

export { loadReportingData };
