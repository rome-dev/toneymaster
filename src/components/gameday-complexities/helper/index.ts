import { IFacility, IField } from 'common/models';

export const mapFacilitiesToOptions = (
  allFacilities: IFacility[],
  facilitiesImpacted: string
) => {
  const facilities = JSON.parse(facilitiesImpacted);
  return allFacilities
    .filter(fac => facilities && facilities.includes(fac.facilities_id))
    .map(fac => ({
      label: fac.facilities_description,
      value: fac.facilities_id,
    }));
};

export const mapFieldsToOptions = (
  allFields: IField[],
  fieldsImpacted: string
) => {
  const fields = JSON.parse(fieldsImpacted);
  return allFields
    .filter(field => fields && fields.includes(field.field_id))
    .map(field => ({
      label: field.field_name,
      value: field.field_id,
    }));
};

export const mapTimeslotsToOptions = (
  timeslots: string,
  backupType: string
) => {
  switch (backupType) {
    case 'cancel_games': {
      const parsedTimeslots = JSON.parse(timeslots);
      return parsedTimeslots.map((timeslot: string) => ({
        label: timeslot,
        value: timeslot,
      }));
    }
    case 'modify_start_time':
    case 'modify_game_lengths':
      return timeslots;
    default:
      return [{ label: 'default', value: 'default' }];
  }
};

export const getFacilitiesOptionsForEvent = (
  facilities: IFacility[],
  eventId: string
) => {
  return facilities
    .filter(facility => facility.event_id === eventId)
    .map(facility => ({
      label: facility.facilities_description,
      value: facility.facilities_id,
    }));
};

export const getFieldsOptionsForFacilities = (
  fields: IField[],
  facilities: { label: string; value: string }[]
) => {
  return fields
    .filter(field =>
      facilities.map(fac => fac.value).includes(field.facilities_id)
    )
    .map(field => ({ label: field.field_name, value: field.field_id }));
};

export const stringifyBackupPlan = (backupPlan: any) => {
  return {
    ...backupPlan,
    facilities_impacted: JSON.stringify(
      backupPlan.facilities_impacted.map((fac: any) => fac.value)
    ),
    fields_impacted: JSON.stringify(
      backupPlan.fields_impacted.map((field: any) => field.value)
    ),
    timeslots_impacted:
      backupPlan.backup_type === 'cancel_games'
        ? JSON.stringify(
            backupPlan.timeslots_impacted.map((timeslot: any) => timeslot.value)
          )
        : backupPlan.timeslots_impacted,
  };
};
