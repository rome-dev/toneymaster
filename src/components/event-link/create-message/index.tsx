import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Paper,
  Button,
  HeadingLevelTwo,
  Radio,
  Input,
  Select,
} from 'components/common';
import styles from './styles.module.scss';
import history from 'browserhistory';
import { getData, sendMessages, saveMessages } from '../logic/actions';
import {
  BindingAction,
  BindingCbWithOne,
  IEventDetails,
  IDivision,
  IPool,
  ITeam,
} from 'common/models';
import Filter from './filter';
import { IScheduleFilter } from './filter';
import { applyFilters, mapFilterValues, mapTeamsByFilter } from '../helpers';
import { IInputEvent } from 'common/types/events';

export interface IMessageToSend {
  type: string;
  title: string;
  message: string;
  recipients: any[];
  senderName: string;
}

interface Props {
  getData: BindingAction;
  sendMessages: BindingCbWithOne<IMessageToSend>;
  saveMessages: BindingCbWithOne<IMessageToSend>;
  events: IEventDetails[];
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
}

const CreateMessage = ({
  getData,
  sendMessages,
  saveMessages,
  events,
  divisions,
  pools,
  teams,
}: Props) => {
  useEffect(() => {
    getData();
  }, []);

  const [data, setMessage] = useState<IMessageToSend>({
    type: 'Text',
    title: '',
    message: '',
    recipients: [''],
    senderName: '',
  });

  const eventOptions = events.length
    ? events.map(e => ({
        label: e.event_name,
        value: e.event_id,
      }))
    : [];

  const typeOptions = ['Text', 'Email'];
  const recipientOptions = ['One', 'Many'];

  const [event, setEvent] = useState();

  const [recipientType, setRecipientType] = useState('One');

  const [filterValues, changeFilterValues] = useState<IScheduleFilter>(
    applyFilters({ divisions, pools, teams })
  );

  useEffect(() => {
    changeFilterValues(applyFilters({ divisions, pools, teams }, event));
  }, [event]);

  const onCancelClick = () => {
    history.push('/event-link');
  };

  const onTypeChange = (e: IInputEvent) => {
    setMessage({ ...data, recipients: [''], type: e.target.value });
  };

  const onTitleChange = (e: IInputEvent) => {
    setMessage({ ...data, title: e.target.value });
  };

  const onContentChange = (e: IInputEvent) => {
    setMessage({ ...data, message: e.target.value });
  };

  const onEventSelect = (e: any) => {
    setEvent(e.target.value);
  };

  const onRecipientTypeChange = (e: IInputEvent) => {
    setRecipientType(e.target.value);
  };

  const onRecipientChange = (e: IInputEvent) => {
    setMessage({ ...data, recipients: [e.target.value] });
  };

  const onSenderNameChange = (e: IInputEvent) => {
    setMessage({ ...data, senderName: e.target.value });
  };

  const onSend = () => {
    if (recipientType === 'Many') {
      const recipients = mapTeamsByFilter([...teams], filterValues, data.type);
      sendMessages({
        ...data,
        recipients: recipients.length ? recipients : [''],
      });
    } else {
      sendMessages(data);
    }
  };

  const onSave = () => {
    if (recipientType === 'Many') {
      const recipients = mapTeamsByFilter([...teams], filterValues, data.type);
      saveMessages({
        ...data,
        recipients: recipients.length ? recipients : [''],
      });
    } else {
      saveMessages(data);
    }
  };

  const onFilterChange = (data: IScheduleFilter) => {
    const newData = mapFilterValues({ teams, pools }, data);
    changeFilterValues({ ...newData });
  };

  const renderOneRecipientInput = () => {
    return (
      <div className={styles.recipientWrapper}>
        <span className={styles.title}>
          {data.type === 'Text' ? 'Number:' : 'Email:'}{' '}
        </span>
        <Input
          width="250px"
          placeholder={
            data.type === 'Text' ? '+11234567890' : 'example@example.com'
          }
          onChange={onRecipientChange}
          value={data.recipients[0] || ''}
        />
        <span className={styles.additionalInfo}>
          {data.type === 'Text' &&
            'Format: [+][country code][subscriber number including area code]'}
        </span>
      </div>
    );
  };

  const renderRecipientFilter = () => {
    return (
      <div className={styles.recipientsFilterWrapper}>
        <div className={styles.selectContainer}>
          <Select
            label="Event"
            width={'168px'}
            options={eventOptions}
            onChange={onEventSelect}
            value={event || ''}
          />
        </div>
        {event && (
          <Filter
            filterValues={filterValues}
            onChangeFilterValue={onFilterChange}
          />
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Paper sticky={true}>
        <div className={styles.btnsWrapper}>
          <Button
            color="secondary"
            variant="text"
            onClick={onCancelClick}
            label="Cancel"
          />
          <Button
            color="primary"
            variant="contained"
            onClick={onSave}
            label="Send Later"
          />
          <Button
            color="primary"
            variant="contained"
            onClick={onSend}
            label="Send Now"
          />
        </div>
      </Paper>
      <HeadingLevelTwo margin="24px 0">New Message</HeadingLevelTwo>
      <div className={styles.btnsGroup}>
        <div className={styles.radioBtns}>
          <Radio
            options={typeOptions}
            formLabel="Type"
            onChange={onTypeChange}
            checked={data.type}
          />
          <Radio
            options={recipientOptions}
            formLabel="Recipient"
            onChange={onRecipientTypeChange}
            checked={recipientType}
          />
        </div>
        {data.type === 'Text' && (
          <Input
            label="Message Name"
            fullWidth={true}
            onChange={onTitleChange}
            value={data.title}
          />
        )}
      </div>
      <div className={styles.recipientsWrapper}>
        {recipientType === 'One'
          ? renderOneRecipientInput()
          : renderRecipientFilter()}
      </div>
      <div className={styles.inputGroup}>
        <div>
          {data.type === 'Email' && (
            <>
              <Input
                label="From"
                fullWidth={true}
                onChange={onSenderNameChange}
                value={data.senderName}
              />
              <Input
                label="Title"
                fullWidth={true}
                onChange={onTitleChange}
                value={data.title}
              />
            </>
          )}
          <Input
            label="Message"
            placeholder=""
            multiline={true}
            rows="10"
            onChange={onContentChange}
            value={data.message}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: {
  eventLink: {
    data: {
      events: IEventDetails[];
      divisions: IDivision[];
      pools: IPool[];
      teams: ITeam[];
    };
  };
}) => {
  return {
    events: state.eventLink.data.events,
    divisions: state.eventLink.data.divisions,
    pools: state.eventLink.data.pools,
    teams: state.eventLink.data.teams,
  };
};

const mapDispatchToProps = {
  getData,
  sendMessages,
  saveMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateMessage);
