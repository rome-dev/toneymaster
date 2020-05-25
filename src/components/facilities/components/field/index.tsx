import React from 'react';
import TextField from '../../../common/input';
import Checkbox from '../../../common/buttons/checkbox';
import { IField } from '../../../../common/models';
import styles from './styles.module.scss';

interface Props {
  field: IField;
  fieldNumber: number;
  isEdit: boolean;
  onChange: (field: IField, evt: React.ChangeEvent<HTMLInputElement>) => void;
}

enum FormFields {
  FIELD_NAME = 'field_name',
  IS_ILLUMINATED_YN = 'is_illuminated_YN',
  IS_PREMIER_YN = 'is_premier_YN',
}

const Field = ({ field, fieldNumber, isEdit, onChange }: Props) => {
  const FIELD_OPTIONS = [
    {
      label: 'Illuminated',
      checked: Boolean(field.is_illuminated_YN),
      name: FormFields.IS_ILLUMINATED_YN,
      disabled: !isEdit,
    },
    {
      label: 'Premier Location',
      checked: Boolean(field.is_premier_YN),
      name: FormFields.IS_PREMIER_YN,
      disabled: !isEdit,
    },
  ];

  return (
    <fieldset className={styles.field}>
      <legend>Field {fieldNumber} Name</legend>
      <TextField
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
          onChange(field, evt)
        }
        value={field.field_name || ''}
        name={FormFields.FIELD_NAME}
        width="250px"
        placeholder={`Field ${fieldNumber}`}
        disabled={!isEdit}
      />
      <Checkbox
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
          onChange(field, evt)
        }
        options={FIELD_OPTIONS}
      />
    </fieldset>
  );
};

export default Field;
