import React from 'react';
import { TextField as MuiTextField, MenuItem } from '@material-ui/core';
import { ISelectOption } from 'common/models';
import styles from './style.module.scss';

interface ISelectProps {
  options: ISelectOption[];
  label?: string;
  value: string;
  width?: string;
  onChange?: any;
  name?: string;
  disabled?: boolean;
  align?: string;
  placeholder?: string;
}

const Select: React.FC<ISelectProps> = ({
  options,
  label,
  value,
  onChange,
  width,
  name,
  disabled,
  align,
  placeholder,
}) => (
  <div className={styles.container} style={{ alignItems: align || '' }}>
    <span className={styles.label}>{label}</span>
    {!value ? (
      <span
        className={styles.placeholder}
        style={label?.length ? { top: 40 } : {}}
      >
        {placeholder}
      </span>
    ) : null}
    <MuiTextField
      id="select"
      style={{ width }}
      variant="outlined"
      size="small"
      select={true}
      value={value}
      onChange={onChange}
      fullWidth={true}
      name={name}
      disabled={disabled}
    >
      {options.map((option: ISelectOption, index: number) => (
        <MenuItem key={index} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </MuiTextField>
  </div>
);

export default Select;
