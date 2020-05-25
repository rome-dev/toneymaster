import React from 'react';
import TournamentPlayItem from '../tournament-play-item';
import {
  SectionDropdown,
  HeadingLevelThree,
  CardMessage,
  Button,
} from 'components/common';
import { BindingCbWithOne, ISchedule, IEventDetails } from 'common/models';
import { EventMenuTitles } from 'common/enums';
import { ISchedulingSchedule } from '../types';
import styles from '../styles.module.scss';
import { CardMessageTypes } from 'components/common/card-message/types';
import { orderBy } from 'lodash-es';
import { IMouseEvent } from 'common/types';

const CARD_MESSAGE_STYLES = {
  marginBottom: 30,
  width: '100%',
};

interface IProps {
  event: IEventDetails;
  schedules: ISchedulingSchedule[];
  eventId: string;
  savingInProgress?: boolean;
  isSectionExpand: boolean;
  isAllowCreate: boolean;
  onEditSchedule: BindingCbWithOne<ISchedulingSchedule>;
  onPublish: (schedule: ISchedule) => void;
  onUnpublish: (schedule: ISchedule) => void;
  onCreatePressed: (evt: IMouseEvent) => void;
}

export default (props: IProps) => {
  const {
    onPublish,
    onUnpublish,
    savingInProgress,
    schedules,
    eventId,
    isSectionExpand,
    onEditSchedule,
    onCreatePressed,
    isAllowCreate,
    event,
  } = props;

  const sortedSchedules = orderBy(
    schedules,
    ({ schedule_status, updated_datetime, created_datetime }) =>
      updated_datetime
        ? [schedule_status, updated_datetime, created_datetime]
        : [schedule_status, created_datetime],
    ['desc', 'desc', 'desc']
  );

  const isSchedulePublished = (id: string) => {
    const schedule = schedules.find(
      item => item.schedule_status === 'Published'
    );
    return schedule && schedule.schedule_id === id;
  };

  const isAnotherSchedulePublished = (id: string) => {
    const schedule = schedules.find(
      item => item.schedule_status === 'Published'
    );
    return schedule && schedule.schedule_id !== id;
  };

  return (
    <SectionDropdown
      type="section"
      isDefaultExpanded={true}
      expanded={isSectionExpand}
      useBorder={true}
      id={EventMenuTitles.TOURNAMENT_PLAY}
    >
      <>
        <HeadingLevelThree>
          <span className={styles.blockHeading}>
            {EventMenuTitles.TOURNAMENT_PLAY}
          </span>
        </HeadingLevelThree>
        <Button
          btnStyles={{ float: 'right' }}
          label="Create New Schedule Version"
          color="primary"
          variant="contained"
          onClick={onCreatePressed}
          disabled={!isAllowCreate}
        />
      </>
      {schedules.length !== 0 ? (
        <ul className={styles.tournamentList}>
          <CardMessage
            style={CARD_MESSAGE_STYLES}
            type={CardMessageTypes.EMODJI_OBJECTS}
          >
            Schedules are sorted first on Status then on Last Update Date
          </CardMessage>
          {sortedSchedules.map(it => (
            <TournamentPlayItem
              event={event}
              schedule={it}
              eventId={eventId}
              onEditSchedule={onEditSchedule}
              key={it.schedule_id}
              onPublish={onPublish}
              onUnpublish={onUnpublish}
              anotherSchedulePublished={isAnotherSchedulePublished(
                it?.schedule_id
              )}
              schedulePublished={isSchedulePublished(it?.schedule_id)}
              savingInProgress={savingInProgress}
            />
          ))}
        </ul>
      ) : (
        <CardMessage
          style={CARD_MESSAGE_STYLES}
          type={CardMessageTypes.EMODJI_OBJECTS}
        >
          Please create the first schedule by clicking on the button to
          continue...
        </CardMessage>
      )}
    </SectionDropdown>
  );
};
