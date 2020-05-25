import React from 'react';
import { Input, Select, Radio, Button } from 'components/common';
import {
  IFacility,
  BindingCbWithOne,
  BindingAction,
  IEventDetails,
} from 'common/models';
import { IField } from 'common/models';
import MultipleSearch from 'components/common/multiple-search-select';
import styles from '../create-backup-modal/styles.module.scss';
import { OptionsEnum, TypeOptionsEnum } from '../create-backup-form';
import {
  mapFacilitiesToOptions,
  mapFieldsToOptions,
  mapTimeslotsToOptions,
  getFacilitiesOptionsForEvent,
  getFieldsOptionsForFacilities,
} from '../helper';
import { IBackupPlan } from 'common/models/backup_plan';
import { IMultipleSelectOption } from '../create-backup-form';
import { PopupExposure } from 'components/common';

const options = [{ value: '05:00 PM', label: '05:00 PM' }];
const optionsTimeslots = [
  { value: '05:00 PM', label: '05:00 PM' },
  { value: '06:00 PM', label: '06:00 PM' },
];

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface Props {
  backupPlan: IBackupPlan;
  events: IEventDetails[];
  facilities: IFacility[];
  fields: IField[];
  updateBackupPlan: BindingCbWithOne<Partial<IBackupPlan>>;
  onEditClose: BindingAction;
}

interface State {
  backupPlan: any;
  isModalConfirmOpen: boolean;
}

class CreateBackupForm extends React.Component<Props, State> {
  state = { backupPlan: {}, isModalConfirmOpen: false };

  componentDidMount() {
    this.setState({
      backupPlan: {
        ...this.props.backupPlan,
        facilities_impacted: mapFacilitiesToOptions(
          this.props.facilities,
          this.props.backupPlan.facilities_impacted
        ),
        fields_impacted: mapFieldsToOptions(
          this.props.fields,
          this.props.backupPlan.fields_impacted
        ),
        timeslots_impacted:
          this.props.backupPlan.timeslots_impacted &&
          mapTimeslotsToOptions(
            this.props.backupPlan.timeslots_impacted,
            this.props.backupPlan.backup_type
          ),
      },
    });
  }

  onChange = (name: string, value: any) => {
    this.setState(({ backupPlan }) => ({
      backupPlan: { ...backupPlan, [name]: value },
    }));
  };

  onNameChange = (e: InputTargetValue) =>
    this.onChange('backup_name', e.target.value);

  onTournamentChange = (e: InputTargetValue) => {
    this.onChange('event_id', e.target.value);
    this.onChange('facilities_impacted', '');
    this.onChange('fields_impacted', '');
  };

  onTypeChange = (e: InputTargetValue) => {
    this.onChange('backup_type', OptionsEnum[e.target.value]);
    this.onChange('timeslots_impacted', '');
  };

  onFacilitiesChange = (
    _event: InputTargetValue,
    values: IMultipleSelectOption[]
  ) => {
    this.onChange('facilities_impacted', values);
  };

  onFieldsChange = (
    _event: InputTargetValue,
    values: IMultipleSelectOption[]
  ) => this.onChange('fields_impacted', values);

  onTimeslotsChange = (
    _event: InputTargetValue,
    values: IMultipleSelectOption[]
  ) => {
    this.onChange('timeslots_impacted', values);
  };

  onTimeslotChange = (e: InputTargetValue) =>
    this.onChange('timeslots_impacted', e.target.value);

  onChangeToChange = (e: InputTargetValue) =>
    this.onChange('change_value', e.target.value);

  onSave = () => {
    if (this.state.isModalConfirmOpen) {
      this.setState({ isModalConfirmOpen: false });
    }
    this.props.updateBackupPlan(this.state.backupPlan);
    this.props.onEditClose();
  };

  onCancelClick = () => {
    this.setState({ isModalConfirmOpen: true });
  };

  onModalConfirmClose = () => {
    this.setState({ isModalConfirmOpen: false });
  };

  onExit = () => {
    this.setState({ isModalConfirmOpen: false });
    this.props.onEditClose();
  };

  renderTimeslots = (type: string, timeslots: any, changeTo: string) => {
    switch (String(type)) {
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
    }: any = this.state.backupPlan;

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
      <div className={styles.container}>
        <div className={styles.title}>Edit Backup</div>
        <div className={styles.formContainer}>
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
        <div className={styles.buttonsGroup}>
          <Button
            label="Cancel"
            variant="text"
            color="secondary"
            onClick={this.onCancelClick}
          />
          <Button
            label="Save"
            variant="contained"
            color="primary"
            onClick={this.onSave}
          />
        </div>
        <PopupExposure
          isOpen={this.state.isModalConfirmOpen}
          onClose={this.onModalConfirmClose}
          onExitClick={this.onExit}
          onSaveClick={this.onSave}
        />
      </div>
    );
  }
}

export default CreateBackupForm;
