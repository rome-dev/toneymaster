import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import * as Yup from 'yup';
import { Toasts } from 'components/common';
import { EMPTY_FACILITY, EMPTY_FIELD } from './constants';
import {
  ADD_EMPTY_FACILITY,
  ADD_EMPTY_FIELD,
  LOAD_FACILITIES_START,
  LOAD_FACILITIES_SUCCESS,
  LOAD_FACILITIES_FAILURE,
  LOAD_FIELDS_START,
  LOAD_FIELDS_SUCCESS,
  LOAD_FIELDS_FAILURE,
  UPDATE_FACILITY,
  UPDATE_FIELD,
  SAVE_FACILITIES_SUCCESS,
  SAVE_FACILITIES_FAILURE,
  FacilitiesAction,
  UPLOAD_FILE_MAP_SUCCESS,
  UPLOAD_FILE_MAP_FAILURE,
  DELETE_FACILITY_SUCCESS,
} from './action-types';
import { IAppState } from 'reducers/root-reducer.types';
import Api from 'api/api';
import { facilitySchema, fieldSchema } from 'validations';
import { getVarcharEight, uploadFile } from 'helpers';
import { IFacility, IField, IUploadFile } from 'common/models';

const loadFacilities = (eventId: string) => async (
  dispatch: Dispatch,
  getState: () => IAppState
) => {
  try {
    dispatch({
      type: LOAD_FACILITIES_START,
    });

    const { event } = getState().pageEvent.tournamentData;
    const facilities = await Api.get(`/facilities?event_id=${eventId}`);
    const mappedFacilitiesByEvent = facilities.map((it: IFacility) => ({
      ...it,
      first_game_time: it.first_game_time || event?.first_game_time,
      last_game_end: it.last_game_end || event?.last_game_end,
    }));

    dispatch({
      type: LOAD_FACILITIES_SUCCESS,
      payload: {
        facilities: mappedFacilitiesByEvent,
      },
    });
  } catch {
    dispatch({
      type: LOAD_FACILITIES_FAILURE,
    });
  }
};

const loadFields: ActionCreator<ThunkAction<
  void,
  {},
  null,
  FacilitiesAction
>> = (facilityId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: LOAD_FIELDS_START,
      payload: {
        facilityId,
      },
    });

    const fields = await Api.get(`/fields?facilities_id=${facilityId}`);

    dispatch({
      type: LOAD_FIELDS_SUCCESS,
      payload: {
        facilityId,
        fields,
      },
    });
  } catch {
    dispatch({
      type: LOAD_FIELDS_FAILURE,
    });
  }
};

const addEmptyFacility = (eventId: string) => async (
  dispatch: Dispatch,
  getState: () => IAppState
) => {
  const { tournamentData } = getState().pageEvent;

  const emptyFacility = {
    ...EMPTY_FACILITY,
    event_id: eventId,
    facilities_id: getVarcharEight(),
    first_game_time: tournamentData.event?.first_game_time,
    last_game_end: tournamentData.event?.last_game_end,
    isNew: true,
  };

  dispatch({
    type: ADD_EMPTY_FACILITY,
    payload: {
      facility: emptyFacility,
    },
  });
};

const addEmptyField = (
  facilityId: string,
  fieldsLength: number
): FacilitiesAction => ({
  type: ADD_EMPTY_FIELD,
  payload: {
    field: {
      ...EMPTY_FIELD,
      field_id: getVarcharEight(),
      field_name: `Field ${fieldsLength + 1}`,
      isNew: true,
      facilities_id: facilityId,
      is_library_YN: 0,
    },
  },
});

const updateFacilities = (updatedFacility: IFacility): FacilitiesAction => ({
  type: UPDATE_FACILITY,
  payload: {
    updatedFacility: { ...updatedFacility, isChange: true },
  },
});

const updateField = (updatedField: IField): FacilitiesAction => ({
  type: UPDATE_FIELD,
  payload: {
    updatedField: { ...updatedField, isChange: true },
  },
});

const saveFacilities: ActionCreator<ThunkAction<
  void,
  {},
  null,
  FacilitiesAction
>> = (facilities: IFacility[], fields: IField[]) => async (
  dispatch: Dispatch
) => {
  try {
    const mappedFacilityFields = Object.values(
      fields.reduce((acc, it: IField) => {
        const facilityId = it.facilities_id;

        acc[facilityId] = [...(acc[facilityId] || []), it];

        return acc;
      }, {})
    );

    for await (let mappedFields of mappedFacilityFields) {
      await Yup.array()
        .of(fieldSchema)
        .unique(
          team => team.field_name,
          'Oops. It looks like you already have fields with the same name. The field must have a unique name.'
        )
        .validate(mappedFields);
    }

    await Yup.array()
      .of(facilitySchema)
      .unique(
        facility => facility.facilities_description,
        'Oops. It looks like you already have facilities with the same name. The facility must have a unique name.'
      )
      .validate(facilities);

    for await (let facility of facilities) {
      const copiedFacility = { ...facility };

      delete copiedFacility.isFieldsLoaded;
      delete copiedFacility.isFieldsLoading;

      if (copiedFacility.isChange && !copiedFacility.isNew) {
        delete copiedFacility.isChange;

        Api.put(
          `/facilities?facilities_id=${copiedFacility.facilities_id}`,
          copiedFacility
        );
      }
      if (copiedFacility.isNew) {
        delete copiedFacility.isChange;
        delete copiedFacility.isNew;

        Api.post('/facilities', copiedFacility);
      }
    }

    for await (let field of fields) {
      const copiedField = { ...field };

      if (copiedField.isChange && !copiedField.isNew) {
        delete copiedField.isChange;

        Api.put(`/fields?field_id=${copiedField.field_id}`, copiedField);
      }

      if (copiedField.isNew) {
        delete copiedField.isChange;
        delete copiedField.isNew;

        Api.post('/fields', copiedField);
      }
    }

    dispatch({
      type: SAVE_FACILITIES_SUCCESS,
      payload: {
        facilities,
        fields,
      },
    });

    Toasts.successToast('Facilities saved successfully');
  } catch (err) {
    dispatch({
      type: SAVE_FACILITIES_FAILURE,
    });

    Toasts.errorToast(err.message);
  }
};

const uploadFileMap: ActionCreator<ThunkAction<
  void,
  {},
  null,
  FacilitiesAction
>> = (facility: IFacility, files: IUploadFile[]) => async (
  dispatch: Dispatch
) => {
  if (!files || !files.length) {
    return;
  }

  for await (let file of files) {
    try {
      const uploadedFile = await uploadFile(file);
      const { key } = uploadedFile as Storage;

      dispatch({
        type: UPLOAD_FILE_MAP_SUCCESS,
        payload: {
          facility: { ...facility, isChange: true, field_map_URL: key },
        },
      });

      Toasts.successToast('Map was successfully uploaded');
    } catch (err) {
      dispatch({
        type: UPLOAD_FILE_MAP_FAILURE,
      });

      Toasts.errorToast('Map could not be uploaded');
    }
  }
};

export {
  loadFacilities,
  loadFields,
  addEmptyFacility,
  addEmptyField,
  updateFacilities,
  updateField,
  saveFacilities,
  uploadFileMap,
};

export const createFacilities: ActionCreator<ThunkAction<
  void,
  {},
  null,
  FacilitiesAction
>> = (facilities: IFacility[], cb: () => void) => async (
  dispatch: Dispatch
) => {
  try {
    const allFacilities = await Api.get(
      `/facilities?event_id=${facilities[0].event_id}`
    );

    for (const facility of facilities) {
      await Yup.array()
        .of(facilitySchema)
        .unique(
          fac => fac.facilities_description,
          'You already have a facility with the same name. Facility must have a unique name.'
        )
        .validate([...allFacilities, facility]);
    }

    for (const facility of facilities) {
      delete facility.isNew;

      await Api.post('/facilities', facility);
    }

    dispatch({
      type: SAVE_FACILITIES_SUCCESS,
      payload: {
        facilities,
      },
    });

    const successMsg = `Facilities are successfully created (${facilities.length})`;
    Toasts.successToast(successMsg);
    cb();
  } catch (err) {
    const fac = err.value[err.value.length - 1];
    const index = facilities.findIndex(
      facility => facility.facilities_id === fac.facilities_id
    );
    const errMessage = `Record ${index + 1}: ${err.message}`;
    return Toasts.errorToast(errMessage);
  }
};

export const deleteFacility: ActionCreator<ThunkAction<
  void,
  {},
  null,
  { type: string }
>> = (facilityId: string) => async (dispatch: Dispatch) => {
  const fields = await Api.get(`/fields?facilities_id=${facilityId}`);
  for (const field of fields) {
    Api.delete(`/fields?field_id=${field.field_id}`);
  }

  const response = await Api.delete(`/facilities?facilities_id=${facilityId}`);

  if (response?.errorType === 'Error') {
    return Toasts.errorToast("Couldn't delete a facility");
  }

  dispatch({
    type: DELETE_FACILITY_SUCCESS,
    payload: { facilityId },
  });

  Toasts.successToast('Facility is successfully deleted');
};
