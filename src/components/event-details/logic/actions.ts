import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Dispatch } from 'redux';
import { Storage } from 'aws-amplify';
// import uuidv4 from 'uuid/v4';
import * as Yup from 'yup';

import {
  EVENT_DETAILS_FETCH_START,
  EVENT_DETAILS_FETCH_SUCCESS,
  EVENT_DETAILS_FETCH_FAILURE,
  EventDetailsAction,
} from './actionTypes';

import api from 'api/api';
import { eventDetailsSchema } from 'validations';
import { IIconFile } from './model';
import history from 'browserhistory';
import { Toasts } from 'components/common';
import {
  IDivision,
  IFacility,
  BindingAction,
  IEventDetails,
} from 'common/models';

export const eventDetailsFetchStart = () => ({
  type: EVENT_DETAILS_FETCH_START,
});

export const eventDetailsFetchSuccess = (
  payload: IEventDetails[]
): EventDetailsAction => ({
  type: EVENT_DETAILS_FETCH_SUCCESS,
  payload,
});

export const eventDetailsFetchFailure = (): EventDetailsAction => ({
  type: EVENT_DETAILS_FETCH_FAILURE,
});

export const getEventDetails: ActionCreator<ThunkAction<
  void,
  {},
  null,
  EventDetailsAction
>> = (eventId: string) => async (dispatch: Dispatch) => {
  dispatch(eventDetailsFetchStart());

  const eventDetails = await api.get('/events', { event_id: eventId });

  if (eventDetails) {
    dispatch(eventDetailsFetchSuccess(eventDetails));
  } else {
    dispatch(eventDetailsFetchFailure());
  }
};

export const saveEventDetails: ActionCreator<ThunkAction<
  void,
  {},
  null,
  EventDetailsAction
>> = (eventDetails: IEventDetails) => async (dispatch: Dispatch) => {
  try {
    await eventDetailsSchema.validate(eventDetails);

    const response = await api.put(
      `/events?event_id=${eventDetails.event_id}`,
      eventDetails
    );

    if (response?.errorType !== undefined) {
      return Toasts.errorToast("Couldn't save the changes");
    }

    Toasts.successToast('Changes successfully saved');

    dispatch<any>(getEventDetails(eventDetails.event_id));
  } catch (err) {
    Toasts.errorToast(err.message);
  }
};

export const createEvent: ActionCreator<ThunkAction<
  void,
  {},
  null,
  EventDetailsAction
>> = (eventDetails: IEventDetails) => async (dispatch: Dispatch) => {
  try {
    const allEvents = await api.get('/events');

    await Yup.array()
      .of(eventDetailsSchema)
      .unique(
        e => e.event_name,
        'You already have an event with the same name. Event must have a unique name.'
      )
      .validate([...allEvents, eventDetails]);

    const response = await api.post('/events', eventDetails);

    if (response?.errorType !== undefined)
      return Toasts.errorToast("Couldn't save the changes");

    Toasts.successToast('Changes successfully saved');

    history.replace(`/event/event-details/${eventDetails.event_id}`);

    dispatch<any>(getEventDetails(eventDetails.event_id));
  } catch (err) {
    Toasts.errorToast(err.message);
  }
};

// export const uploadFiles = (files: IIconFile[]) => () => {
//   if (!files || !files.length) return;

//   files.forEach((fileObject: IIconFile) => {
//     const { file, destinationType } = fileObject;
//     const uuid = uuidv4();
//     const saveFilePath = `event_media_files/${destinationType}_${uuid}_${file.name}`;
//     const config = { contentType: file.type };

//     Storage.put(saveFilePath, file, config)
//       .then(() => Toasts.successToast(`${file.name} was successfully uploaded`))
//       .catch(() => Toasts.errorToast(`${file.name} couldn't be uploaded`));
//   });
// };

export const removeFiles = (files: IIconFile[]) => () => {
  if (!files || !files.length) return;

  files.forEach(fileObject => {
    const { file, destinationType } = fileObject;
    const key = `event_media_files/${destinationType}_${file.name}`;
    Storage.remove(key)
      .then(() => Toasts.successToast(`${file.name} was successfully removed`))
      .catch(() => Toasts.errorToast(`${file.name} failed to remove`));
  });
};

export const deleteEvent: ActionCreator<ThunkAction<
  void,
  {},
  null,
  EventDetailsAction
>> = (eventId: string) => async (_dispatch: Dispatch) => {
  // Delete EVENT
  await api.delete(`/events?event_id=${eventId}`);

  //DELETE REGISTRATION
  const registrations = await api.get(`/registrations?event_id=${eventId}`);
  api.delete('/registrations', registrations);

  // DELETE DIVISIONS&POOLS
  const divisions = await api.get(`/divisions?event_id=${eventId}`);
  divisions.forEach(async (division: IDivision) => {
    const pools = await api.get(`/pools?division_id=${division.division_id}`);
    api.delete('/pools', pools);
  });
  api.delete('/divisions', divisions);

  // DELETE TEAMS
  const teams = await api.get(`/teams?event_id=${eventId}`);
  api.delete('/teams', teams);

  //DELETE FACILITIES&FIELDS
  const facilities = await api.get(`/facilities?event_id=${eventId}`);
  facilities.forEach(async (facility: IFacility) => {
    const fields = await api.get(
      `/fields?facilities_id=${facility.facilities_id}`
    );
    api.delete('/fields', fields);
  });
  api.delete('/facilities', facilities);

  Toasts.successToast('Event is successfully deleted');
  history.push('/');
};

export const createEvents: ActionCreator<ThunkAction<
  void,
  {},
  null,
  EventDetailsAction
>> = (events: IEventDetails[], cb: BindingAction) => async (
  dispatch: Dispatch
) => {
  try {
    const allEvents = await api.get('/events');

    for (const event of events) {
      await Yup.array()
        .of(eventDetailsSchema)
        .unique(
          e => e.event_name,
          'You already have an event with the same name. Event must have a unique name.'
        )
        .validate([...allEvents, event]);
    }

    for (const event of events) {
      await api.post('/events', event);
    }
    const lastEvent = events[events.length - 1];
    const successMsg = `Events are successfully created (${events.length})`;
    Toasts.successToast(successMsg);
    cb();
    history.replace(`/event/event-details/${lastEvent.event_id}`);

    dispatch<any>(getEventDetails(lastEvent.event_id));
  } catch (err) {
    const e = err.value[err.value.length - 1];
    const index = events.findIndex(event => event.event_id === e.event_id);
    const errMessage = `Record ${index + 1}: ${err.message}`;
    return Toasts.errorToast(errMessage);
  }
};
