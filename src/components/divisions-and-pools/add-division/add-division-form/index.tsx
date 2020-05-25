import React from 'react';
import Input from '../../../common/input';
import ColorPicker from '../../../common/color-picker';
import Checkbox from '../../../common/buttons/checkbox';
import styles from '../styles.module.scss';
import { BindingCbWithThree, IDivision, IFacility } from 'common/models';
import { IRegistration } from 'common/models/registration';
import { Select, Tooltip } from 'components/common';
import { Icons } from 'common/enums';
import { getIcon } from 'helpers';

const STYLES_WARNING_ICON = {
  marginLeft: '5px',
  fill: '#FFCC00',
  height: '20px',
};

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IAddDivisionFormState {
  hasUniqueGameDurations: boolean;
  hasMessage: boolean;
}
interface IAddDivisionFormProps {
  onChange: BindingCbWithThree<string, string | number, number>;
  index: number;
  division: Partial<IDivision>;
  registration?: IRegistration;
  facilities: IFacility[];
  divisions: IDivision[];
}

class AddDivisionForm extends React.Component<
  IAddDivisionFormProps,
  IAddDivisionFormState
> {
  state = { hasUniqueGameDurations: false, hasMessage: true };

  onLongNameChange = (e: InputTargetValue) =>
    this.props.onChange('long_name', e.target.value, this.props.index);

  onShortNameChange = (e: InputTargetValue) =>
    this.props.onChange('short_name', e.target.value, this.props.index);

  onTagChange = (e: InputTargetValue) =>
    this.props.onChange('division_tag', e.target.value, this.props.index);

  onEntryFeeChange = (e: InputTargetValue) =>
    this.props.onChange('entry_fee', e.target.value, this.props.index);

  onDescChange = (e: InputTargetValue) =>
    this.props.onChange(
      'division_description',
      e.target.value,
      this.props.index
    );

  onMaxNumOfTeamsChange = (e: InputTargetValue) =>
    this.props.onChange('max_num_teams', e.target.value, this.props.index);

  onDivisionMessageChange = (e: InputTargetValue) =>
    this.props.onChange('division_message', e.target.value, this.props.index);

  onColorChange = (value: string) =>
    this.props.onChange(
      'division_hex',
      value.replace(/#/, () => ''),
      this.props.index
    );

  onPlayAtSpecFacilityChange = (e: InputTargetValue) => {
    this.props.onChange(
      'plays_at_spec_facility',
      e.target.checked ? 1 : 0,
      this.props.index
    );
  };

  onSpecFacilitySelect = (e: InputTargetValue) => {
    this.props.onChange('spec_facilities_id', e.target.value, this.props.index);
  };

  onHasMessageChange = () => {
    this.setState({
      hasMessage: !this.state.hasMessage,
    });
  };

  onUniqueGameDurationsChange = () => {
    this.setState({
      hasUniqueGameDurations: !this.state.hasUniqueGameDurations,
    });
  };

  renderEntryFee = (entryFee?: number) => {
    return (
      <Input
        fullWidth={true}
        label="Entry Fee"
        startAdornment="$"
        type="number"
        value={entryFee || ''}
        onChange={this.onEntryFeeChange}
        disabled={!this.props.registration?.fees_vary_by_division_YN}
      />
    );
  };

  onIsPremierChange = (e: InputTargetValue) => {
    this.props.onChange(
      'is_premier_YN',
      e.target.checked ? 1 : 0,
      this.props.index
    );
  };

  render() {
    const {
      division_id,
      long_name,
      short_name,
      division_tag,
      division_description,
      entry_fee,
      max_num_teams,
      division_message,
      division_hex,
      plays_at_spec_facility,
      spec_facilities_id,
      is_premier_YN,
    } = this.props.division;
    const defaultDivisionColor = '#1c315f';

    const facilitiesOptions = this.props.facilities
      ? this.props.facilities.map(facility => ({
          label: facility.facilities_description,
          value: facility.facilities_id,
        }))
      : [];

    return (
      <div className={styles.sectionContainer}>
        <div className={styles.section}>
          <div className={styles.sectionRow}>
            <div className={styles.sectionItemLarge}>
              <Input
                fullWidth={true}
                label="Long Name"
                autofocus={true}
                value={long_name || ''}
                onChange={this.onLongNameChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                fullWidth={true}
                label="Short Name"
                value={short_name || ''}
                onChange={this.onShortNameChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                fullWidth={true}
                label="Division Tag"
                startAdornment="@"
                value={division_tag || ''}
                onChange={this.onTagChange}
              />
            </div>
          </div>
          <div className={styles.sectionRow}>
            <div className={styles.sectionItem}>
              {!this.props.registration?.fees_vary_by_division_YN ? (
                <Tooltip
                  type="info"
                  title="Entry Fee is set in the Registartion section. To be able to chage it, go to the 'Registration' and toggle 'Division Fees Vary' checkbox."
                >
                  <div>{this.renderEntryFee(entry_fee)}</div>
                </Tooltip>
              ) : (
                this.renderEntryFee(entry_fee)
              )}
            </div>
            <div className={styles.sectionItem}>
              <Input
                fullWidth={true}
                label="Division Description"
                value={division_description || ''}
                onChange={this.onDescChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                fullWidth={true}
                label="Max # of Teams"
                type="number"
                value={max_num_teams || ''}
                onChange={this.onMaxNumOfTeamsChange}
              />
            </div>
            <div className={styles.sectionItemColorPicker}>
              <p className={styles.sectionLabel}>
                <span>Color</span>
                {this.props.divisions.some(
                  division =>
                    division.division_id !== division_id &&
                    division.division_hex === division_hex
                ) && (
                  <Tooltip
                    type="info"
                    title="There is already a division with such color"
                  >
                    {getIcon(Icons.WARNING, STYLES_WARNING_ICON)}
                  </Tooltip>
                )}
              </p>
              <ColorPicker
                value={division_hex || defaultDivisionColor}
                onChange={this.onColorChange}
              />
            </div>
          </div>
          <div className={styles.sectionThirdRow}>
            <div className={styles.sectionItemLarge}>
              <Checkbox
                formLabel=""
                options={[
                  { label: 'Division Message', checked: this.state.hasMessage },
                ]}
                onChange={this.onHasMessageChange}
              />
              {this.state.hasMessage && (
                <Input
                  fullWidth={true}
                  multiline={true}
                  rows="5"
                  value={division_message || ''}
                  onChange={this.onDivisionMessageChange}
                />
              )}
            </div>
            <div className={styles.sectionItemSelect}>
              <Checkbox
                formLabel=""
                options={[
                  {
                    label: 'Plays at Specific Facility',
                    checked: Boolean(plays_at_spec_facility),
                  },
                ]}
                onChange={this.onPlayAtSpecFacilityChange}
              />
              {plays_at_spec_facility ? (
                <div className={styles.selectContainer}>
                  <Select
                    options={facilitiesOptions}
                    label=""
                    value={
                      facilitiesOptions.find(
                        facility => facility.value === spec_facilities_id
                      )?.value || ''
                    }
                    onChange={this.onSpecFacilitySelect}
                  />
                </div>
              ) : null}
              <Checkbox
                formLabel=""
                options={[
                  {
                    label: 'Plays on Premier Fields',
                    checked: Boolean(is_premier_YN),
                  },
                ]}
                onChange={this.onIsPremierChange}
              />
            </div>
          </div>
          <div className={styles.sectionRow}>
            <div>
              <Checkbox
                formLabel=""
                options={[
                  {
                    label: 'Division has Unique Game Durations',
                    checked: this.state.hasUniqueGameDurations,
                  },
                ]}
                onChange={this.onUniqueGameDurationsChange}
              />
              {this.state.hasUniqueGameDurations && (
                <div className={styles.sectionItemTime}>
                  <Input
                    fullWidth={true}
                    endAdornment="Minutes"
                    label="Pregame Warmup"
                    value="0"
                  />
                  <span className={styles.innerSpanText}>&nbsp;+&nbsp;</span>
                  <Input
                    fullWidth={true}
                    endAdornment="Minutes"
                    label="Time Division Duration"
                    value="0"
                  />
                  <span className={styles.innerSpanText}>
                    &nbsp;(0)&nbsp;+&nbsp;
                  </span>
                  <Input
                    fullWidth={true}
                    endAdornment="Minutes"
                    label="Time Between Periods"
                    value="0"
                  />
                  <span className={styles.innerSpanText}>
                    &nbsp;=&nbsp;0&nbsp; Minutes Total Runtime
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddDivisionForm;
