import React from 'react';
import styles from '../styles.module.scss';
import { Input, Radio, Checkbox, Select } from 'components/common';
import { IRegistration } from 'common/models/registration';
import { BindingCbWithTwo } from 'common/models';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/high-res.css';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

enum OptionsEnum {
  'Require' = 1,
  'Request' = 2,
  'None' = 0,
}

const roleOptions = [
  { label: 'Coach', value: 'Coach' },
  { label: 'Participant', value: 'Participant' },
  { label: 'Parent/Guardian', value: 'Parent/Guardian' },
  { label: 'Other', value: 'Other' },
];

interface IRegistrationDetailsProps {
  data?: IRegistration;
  onChange: BindingCbWithTwo<string, string | number>;
  eventType: string;
}

const RegistrationDetails = ({
  data,
  onChange,
  eventType,
}: IRegistrationDetailsProps) => {
  const options = ['Require', 'Request', 'None'];

  const onMaxTeamsPerDivisionChange = (e: InputTargetValue) =>
    onChange('max_teams_per_division', e.target.value);

  const onMaxPlayersPerDivisionChange = (e: InputTargetValue) =>
    onChange('max_players_per_division', e.target.value);

  const onMaxAthletesOnRosterChange = (e: InputTargetValue) =>
    onChange('max_players_per_roster', e.target.value);

  const onAthleteBirthDateChange = (e: InputTargetValue) =>
    onChange('request_athlete_birthdate', OptionsEnum[e.target.value]);

  const onAthleteJerseyNumberChange = (e: InputTargetValue) =>
    onChange('request_athlete_jersey_number', OptionsEnum[e.target.value]);

  const onAthleteEmailChange = (e: InputTargetValue) =>
    onChange('request_athlete_email', OptionsEnum[e.target.value]);

  const onFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('reg_first_name', e.target.value);
  const onLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('reg_last_name', e.target.value);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('email_address', e.target.value);

  const onMobileNumberChange = (value: string) =>
    onChange('mobile_number', value);

  const onPermissionToTextChange = (e: React.ChangeEvent<any>) =>
    onChange('permission_to_text', e.target.checked ? 1 : 0);

  const onRoleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('role', e.target.value);

  const onDivisionNameLabelChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('division_name_label', e.target.value);

  const onDisclaimerChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('disclaimer', e.target.value);

  const onRegistrationDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => onChange('registration_information', e.target.value);

  return (
    <div className={styles.section}>
      <div className={styles.sectionRow}>
        <div>
          <Input
            fullWidth={true}
            label="Group Name"
            value={data ? data.division_name_label : ''}
            onChange={onDivisionNameLabelChange}
          />
        </div>
        <div className={styles.sectionItem}>
          {eventType === 'Showcase' ? (
            <Input
              fullWidth={true}
              label="Max Players Per Division"
              type="number"
              value={data ? data.max_players_per_division : ''}
              onChange={onMaxPlayersPerDivisionChange}
            />
          ) : (
            <Input
              fullWidth={true}
              label="Max Teams Per Division"
              type="number"
              value={data ? data.max_teams_per_division : ''}
              onChange={onMaxTeamsPerDivisionChange}
            />
          )}
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Max Athletes on Roster"
            type="number"
            value={data ? data.max_players_per_roster : ''}
            onChange={onMaxAthletesOnRosterChange}
          />
        </div>
        <div className={styles.sectionItem} />
      </div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Radio
            options={options}
            formLabel="Athlete Birth Date"
            onChange={onAthleteBirthDateChange}
            checked={
              (data && OptionsEnum[data.request_athlete_birthdate]) ||
              OptionsEnum[3]
            }
          />
        </div>
        <div className={styles.sectionItem}>
          <Radio
            options={options}
            formLabel="Athlete Jersey Number"
            onChange={onAthleteJerseyNumberChange}
            checked={
              (data && OptionsEnum[data.request_athlete_jersey_number]) ||
              OptionsEnum[3]
            }
          />
        </div>
        <div className={styles.sectionItem}>
          <Radio
            options={options}
            formLabel="Athlete Email"
            onChange={onAthleteEmailChange}
            checked={
              (data && OptionsEnum[data.request_athlete_email]) ||
              OptionsEnum[3]
            }
          />
        </div>
        <div className={styles.sectionItem} />
      </div>
      <div className={styles.sectionInfoRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Disclaimer"
            multiline={true}
            rows="4"
            value={data ? data.disclaimer : ''}
            onChange={onDisclaimerChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Registration Details"
            multiline={true}
            rows="4"
            value={data ? data.registration_information : ''}
            onChange={onRegistrationDetailsChange}
          />
        </div>
      </div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="First Name"
            value={data ? data.reg_first_name : ''}
            onChange={onFirstNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Last Name"
            value={data ? data.reg_last_name : ''}
            onChange={onLastNameChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Select
            options={roleOptions}
            label="Role"
            value={data ? data.role : ''}
            onChange={onRoleChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Email"
            value={data ? data.email_address : ''}
            onChange={onEmailChange}
          />
        </div>
      </div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <div className={styles.sectionTitle}>Phone Number</div>
          <PhoneInput
            country={'us'}
            value={data ? String(data.mobile_number) : ''}
            onChange={onMobileNumberChange}
            containerStyle={{ marginTop: '7px' }}
            inputStyle={{
              height: '40px',
              fontSize: '18px',
              color: '#6a6a6a',
              borderRadius: '4px',
              width: '100%',
            }}
          />
        </div>
        <div className={styles.sectionItem} style={{ marginTop: '20px' }}>
          <Checkbox
            formLabel=""
            options={[
              {
                label: 'Permission to Text',
                checked: data ? Boolean(data.permission_to_text) : Boolean(0),
              },
            ]}
            onChange={onPermissionToTextChange}
          />
        </div>
        <div className={styles.sectionItem} />
        <div className={styles.sectionItem} />
      </div>
    </div>
  );
};

export default RegistrationDetails;
