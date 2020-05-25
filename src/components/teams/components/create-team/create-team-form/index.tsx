import React from 'react';
import { Input, Select, Tooltip } from 'components/common/';
import Checkbox from 'components/common/buttons/checkbox';
import styles from '../styles.module.scss';
import { sortByField } from 'helpers';
import { IDivision, ITeam } from 'common/models';
import { SortByFilesTypes } from 'common/enums';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface ICreateTeamFormProps {
  key: number;
  index: number;
  onChange: any;
  team: Partial<ITeam>;
  divisions: IDivision[];
}

class CreateTeamForm extends React.Component<ICreateTeamFormProps, {}> {
  onLongNameChange = (e: InputTargetValue) => {
    this.props.onChange('long_name', e.target.value, this.props.index);
  };

  onShortNameChange = (e: InputTargetValue) =>
    this.props.onChange('short_name', e.target.value, this.props.index);

  onTagChange = (e: InputTargetValue) =>
    this.props.onChange('team_tag', e.target.value, this.props.index);

  onCityChange = (e: InputTargetValue) =>
    this.props.onChange('city', e.target.value, this.props.index);

  onStateChange = (e: InputTargetValue) =>
    this.props.onChange('state', e.target.value, this.props.index);

  onDivisionChange = (e: InputTargetValue) => {
    this.props.onChange('division_id', e.target.value, this.props.index);
  };

  onLevelChange = (e: InputTargetValue) =>
    this.props.onChange('level', e.target.value, this.props.index);

  onFirstNameChange = (e: InputTargetValue) =>
    this.props.onChange('contact_first_name', e.target.value, this.props.index);

  onLastNameChange = (e: InputTargetValue) =>
    this.props.onChange('contact_last_name', e.target.value, this.props.index);

  onPhoneChange = (e: InputTargetValue) =>
    this.props.onChange('phone_num', e.target.value, this.props.index);

  onEmailChange = (e: InputTargetValue) =>
    this.props.onChange('contact_email', e.target.value, this.props.index);

  // onContactTagChange = (e: InputTargetValue) =>
  //   this.props.onChange('contact_tag', e.target.value, this.props.index);

  onScheduleRestrictionsChange = (e: InputTargetValue) => {
    this.props.onChange(
      'schedule_restrictions',
      e.target.checked ? 1 : 0,
      this.props.index
    );
  };

  render() {
    const {
      long_name,
      short_name,
      team_tag,
      city,
      state,
      division_id,
      level,
      contact_first_name,
      contact_last_name,
      phone_num,
      contact_email,
      // contact_tag,
      schedule_restrictions,
    } = this.props.team;

    const divisionsOptions = sortByField(
      this.props.divisions,
      SortByFilesTypes.DIVISIONS
    ).map((division: IDivision) => ({
      label: division.short_name,
      value: division.division_id,
    }));

    const levelOptions = [
      { label: 'AA', value: 'AA' },
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'N/A', value: 'N/A' },
    ];

    return (
      <div className={styles.sectionContainer}>
        <div className={styles.section}>
          <div className={styles.sectionRow}>
            <div className={styles.sectionItemLarge}>
              <Input
                fullWidth={true}
                label="Long Name"
                value={long_name || ''}
                autofocus={true}
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
                label="Team Tag"
                startAdornment="@"
                value={team_tag || ''}
                onChange={this.onTagChange}
              />
            </div>
            <div className={styles.sectionItem} />
          </div>
          <div className={styles.sectionRow}>
            <div className={styles.sectionItemLarge}>
              <Input
                fullWidth={true}
                label="City"
                value={city || ''}
                onChange={this.onCityChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                fullWidth={true}
                label="State"
                value={state || ''}
                onChange={this.onStateChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Select
                label="Division"
                options={divisionsOptions}
                value={division_id || ''}
                onChange={this.onDivisionChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Select
                label="Level"
                options={[...levelOptions]}
                value={level || ''}
                onChange={this.onLevelChange}
              />
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionRow}>
            <div className={styles.sectionItem}>
              <Input
                fullWidth={true}
                label="Contact First Name"
                value={contact_first_name || ''}
                onChange={this.onFirstNameChange}
              />
            </div>
            <div className={styles.sectionItem}>
              <Input
                fullWidth={true}
                label="Last Name"
                value={contact_last_name || ''}
                onChange={this.onLastNameChange}
              />
            </div>
            <Tooltip
              type="info"
              title="Should be in following format: [+][country code][subscriber number including area code]. Example: +14155552671"
            >
              <div className={styles.sectionItem}>
                <Input
                  fullWidth={true}
                  label="Phone #"
                  value={phone_num || ''}
                  onChange={this.onPhoneChange}
                />
              </div>
            </Tooltip>
            <div className={styles.sectionItemLarge}>
              <Input
                fullWidth={true}
                label="Email"
                value={contact_email || ''}
                onChange={this.onEmailChange}
              />
            </div>
          </div>
          <div className={styles.sectionRow}>
            {/* <div className={styles.sectionItem}>
              <Input
                fullWidth={true}
                label="Contact Tag"
                startAdornment="@"
                value={contact_tag || ''}
                onChange={this.onContactTagChange}
              />
            </div> */}
          </div>
          <div className={styles.sectionRow}>
            <div>
              <Checkbox
                formLabel=""
                options={[
                  {
                    label: 'Team has Scheduling Restrictions',
                    checked: Boolean(schedule_restrictions),
                  },
                ]}
                onChange={this.onScheduleRestrictionsChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateTeamForm;
