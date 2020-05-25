import React from 'react';
import styles from './style.module.scss';
import {
  BindingAction,
  BindingCbWithThree,
} from '../../../common/models/callback';
import { Button } from 'components/common';
import hisory from '../../../browserhistory';
import {
  Select,
  TextField,
  Grid,
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';

enum FormFilds {
  EMAIL = 'email',
  OPTION = 'option',
  MESSAGE = 'message',
  HEADER = 'Please leave some feedback here',
  BUTTON_CONTAINED = 'contained',
  BUTTON_TEXT = 'text',
  BUTTON_OUTLINED = 'outlined',
  BUTTON_SUBMIT = 'submit',
  BUTTON_BUTTON = 'button',
  BUTTON_INHERIT = 'inherit',
  BUTTON_PRIMARY = 'primary',
  BUTTON_SECONDARY = 'secondary',
  BUTTON_DEFAULT = 'default',
}

interface Props {
  option: string;
  email: string;
  message: string;
  onChange: BindingAction;
  onSubmit: BindingCbWithThree<string, string, string>;
  isLoading: boolean;
}
const optValue = ['Bugs', 'Suggestions'];
const options = optValue.map((item, index) => (
  <MenuItem value={item} key={index}>{item}</MenuItem>
))
const SupportForm = ({
  email,
  option,
  message,
  onChange,
  onSubmit,
}: Props) => (
    <form onSubmit={
      (evt) => {
        evt.preventDefault();
        console.log(email, option, message)
        onSubmit(email, option, message);
      }
    }>
      <h2 className={styles.supportHeader}>{FormFilds.HEADER}</h2>
      <Grid container spacing={3}>
        <Grid item xs={6} className={styles.inputField}>
          <TextField
            className={styles.FormField}
            onChange={onChange}
            value={email}
            name={FormFilds.EMAIL}
            type="email"
            inputMode="email"
            placeholder="Email"
            variant={'outlined'}
            required />
        </Grid>
        <Grid item xs={6} className={styles.inputField}>
          <Select
            className={styles.selectField}
            onChange={onChange}
            value={option}
            name={FormFilds.OPTION}
            variant={'outlined'}
            required
          >
            {options}
          </Select>
        </Grid>
      </Grid>
      <div className={styles.inputField}>
        <TextField
          className={styles.FormField}
          rows={6}
          multiline
          onChange={onChange}
          value={message}
          name={FormFilds.MESSAGE}
          inputMode="text"
          placeholder="Insert Message here"
          required
          variant={"outlined"}
        />
      </div>
      <div className={styles.buttonGroup}>
        <Button
          label="Cancel"
          onClick={() => hisory.push('/')}
          variant="text"
          color={FormFilds.BUTTON_SECONDARY}
          btnType={FormFilds.BUTTON_BUTTON}
        />
        <Button
          label="Submit"
          variant={FormFilds.BUTTON_CONTAINED}
          color={FormFilds.BUTTON_PRIMARY}
          btnType={FormFilds.BUTTON_SUBMIT}
        />
      </div>
    </form>
  )
export default SupportForm;
