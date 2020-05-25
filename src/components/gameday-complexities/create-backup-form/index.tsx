import React from 'react';
import styles from '../create-backup-modal/styles.module.scss';
import { Input, Select, Radio, Button, CardMessage } from 'components/common';
import { BindingCbWithThree, IFacility, IEventDetails } from 'common/models';
import { IField } from 'common/models';
import MultipleSearch from 'components/common/multiple-search-select';
import {
  getFacilitiesOptionsForEvent,
  getFieldsOptionsForFacilities,
} from '../helper';
import { CardMessageTypes } from 'components/common/card-message/types';

const options = [{ value: '05:00 PM', label: '05:00 PM' }];
const optionsTimeslots = [
  { value: '05:00 PM', label: '05:00 PM' },
  { value: '06:00 PM', label: '06:00 PM' },
];

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface Props {
  index: number;
  backupPlan: any;
  onChange: BindingCbWithThree<string, any, number>;
  events: IEventDetails[];
  facilities: IFacility[];
  fields: IField[];
}

export interface IMultipleSelectOption {
  label: string;
  value: string;
}

export enum OptionsEnum {
  'Cancel Games' = 'cancel_games',
  'Modify Start Times' = 'modify_start_time',
  'Modify Game Lengths' = 'modify_game_lengths',
}

export enum TypeOptionsEnum {
  'cancel_games' = 'Cancel Games',
  'modify_start_time' = 'Modify Start Times',
  'modify_game_lengths' = 'Modify Game Lengths',
}

class CreateBackupForm extends React.Component<Props> {
  onNameChange = (e: InputTargetValue) =>
    this.props.onChange('backup_name', e.target.value, this.props.index);

  onTournamentChange = (e: InputTargetValue) => {
    this.props.onChange('event_id', e.target.value, this.props.index);
    this.props.onChange('facilities_impacted', '', this.props.index);
    this.props.onChange('fields_impacted', '', this.props.index);
  };

  onTypeChange = (e: InputTargetValue) => {
    this.props.onChange(
      'backup_type',
      OptionsEnum[e.target.value],
      this.props.index
    );
    this.props.onChange('timeslots_impacted', '', this.props.index);
  };

  onFacilitiesChange = (
    _event: InputTargetValue,
    values: IMultipleSelectOption[]
  ) => {
    this.props.onChange('facilities_impacted', values, this.props.index);
  };

  onFieldsChange = (
    _event: InputTargetValue,
    values: IMultipleSelectOption[]
  ) => this.props.onChange('fields_impacted', values, this.props.index);

  onTimeslotsChange = (
    _event: InputTargetValue,
    values: IMultipleSelectOption[]
  ) => {
    this.props.onChange('timeslots_impacted', values, this.props.index);
  };

  onTimeslotChange = (e: InputTargetValue) =>
    this.props.onChange('timeslots_impacted', e.target.value, this.props.index);

  onChangeToChange = (e: InputTargetValue) =>
    this.props.onChange('change_value', e.target.value, this.props.index);

  renderTimeslots = (type: string, timeslots: any, changeTo: string) => {
    switch (type) {
      case 'cancel_games':
        return (
          <div className={styles.item}>
            <MultipleSearch
              label="Timeslots"
              width={'282px'}
              options={optionsTimeslots}
              onChange={this.onTimeslotsChange}
              value={timeslots || []}
            />
          </div>
        );
      case 'modify_start_time':
        return (
          <div className={styles.itemDouble}>
            <Select
              label="Timeslot"
              options={options}
              width={'131px'}
              value={timeslots || ''}
              onChange={this.onTimeslotChange}
            />
            <Select
              label="Change To"
              options={options}
              width={'131px'}
              value={changeTo || ''}
              onChange={this.onChangeToChange}
            />
          </div>
        );
      case 'modify_game_lengths':
        return (
          <div className={styles.itemDouble}>
            <Select
              label="Timeslot"
              options={options}
              width={'131px'}
              value={timeslots || ''}
              onChange={this.onTimeslotChange}
            />
            <Input
              width={'131px'}
              type={'number'}
              label="Change To"
              placeholder="Minutes"
              onChange={this.onChangeToChange}
              value={changeTo || ''}
            />
          </div>
        );
    }
  };

  render() {
    const {
      backup_name,
      event_id,
      backup_type,
      facilities_impacted,
      fields_impacted,
      timeslots_impacted,
      change_value,
    } = this.props.backupPlan;

    const { events, facilities: allFacilities, fields: allFields } = this.props;

    const eventsOptions = events.map(event => ({
      label: event.event_name,
      value: event.event_id,
    }));

    const facilitiesOptions = getFacilitiesOptionsForEvent(
      allFacilities,
      event_id
    );

    const fieldsOptions =
      facilities_impacted &&
      getFieldsOptionsForFacilities(allFields, facilities_impacted);

    return (
      <div className={styles.formContainer}>
        <div style={{ paddingTop: '15px' }}>
          <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
            Modifications only apply to the Published Schedules for each event.
          </CardMessage>
        </div>
        <div className={styles.row}>
          <div className={styles.item}>
            <Input
              fullWidth={true}
              label="Name"
              onChange={this.onNameChange}
              value={backup_name || ''}
              autofocus={true}
            />
          </div>
          <div className={styles.item}>
            <Select
              label="Event Impacted"
              options={eventsOptions}
              onChange={this.onTournamentChange}
              value={event_id || ''}
            />
          </div>
          <div className={styles.itemLarge}>
            <Radio
              row={true}
              options={[
                'Cancel Games',
                'Modify Start Times',
                'Modify Game Lengths',
              ]}
              formLabel="Type"
              onChange={this.onTypeChange}
              checked={
                TypeOptionsEnum[backup_type] || OptionsEnum['Cancel Game']
              }
            />
          </div>
        </div>
        <div className={styles.row}>
          {event_id && (
            <div className={styles.item}>
              <MultipleSearch
                label="Facilities Impacted"
                width={'282px'}
                options={facilitiesOptions}
                onChange={this.onFacilitiesChange}
                value={facilities_impacted || []}
              />
            </div>
          )}

          {facilities_impacted?.length ? (
            <div className={styles.item}>
              <MultipleSearch
                label="Fields Impacted"
                width={'282px'}
                options={fieldsOptions}
                onChange={this.onFieldsChange}
                value={fields_impacted || []}
              />
            </div>
          ) : null}

          {fields_impacted?.length
            ? this.renderTimeslots(
                backup_type,
                timeslots_impacted,
                change_value
              )
            : null}

          {event_id && (
            <div className={styles.item}>
              <>
                <span>or</span>
                <Button
                  label="Open Scheduler"
                  variant="text"
                  color="secondary"
                />
              </>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CreateBackupForm;
