import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { HeadingLevelFour, Tooltip, Button, Paper } from 'components/common';
import InteractiveTooltip from 'components/common/interactive-tooltip';
import { BindingCbWithOne, ISchedule, IEventDetails } from 'common/models';
import { ISchedulingSchedule } from '../types';
import styles from '../styles.module.scss';
import { Routes } from 'common/enums';
import { getTournamentStatusColor } from 'helpers/getTournamentStatusColor';
import { TooltipMessageTypes } from 'components/common/tooltip-message/types';

const DEFAULT_UPDATED_VALUE = 'Not updated yet.';

interface IProps {
  schedule: ISchedulingSchedule;
  event: IEventDetails;
  eventId: string;
  anotherSchedulePublished?: boolean;
  savingInProgress?: boolean;
  schedulePublished?: boolean;
  onEditSchedule: BindingCbWithOne<ISchedulingSchedule>;
  onPublish: (schedule: ISchedule) => void;
  onUnpublish: (schedule: ISchedule) => void;
}

const TournamentPlayItem = ({
  schedule,
  event,
  eventId,
  onEditSchedule,
  onPublish,
  onUnpublish,
  anotherSchedulePublished,
  schedulePublished,
  savingInProgress,
}: IProps) => {
  const localOnEditSchedule = () => onEditSchedule(schedule);

  const warnings = [];
  if (
    schedule.first_game_time !== event.first_game_time ||
    schedule.last_game_end_time !== event.last_game_end
  ) {
    warnings.push({
      type: 'WARN',
      title:
        'Schedule First Game Start and Last Game End options do not match the Event Details options. Your Schedule data may be corrupted.',
    });
  }

  return (
    <li className={styles.tournamentPlay}>
      <Paper padding={20}>
        <div className={styles.header}>
          <HeadingLevelFour>
            <div className={styles.heading}>
              <span>{schedule.schedule_name}</span>
              {warnings.length ? (
                <InteractiveTooltip
                  title="Scheduling Warning"
                  items={warnings}
                />
              ) : null}
            </div>
          </HeadingLevelFour>
          <Tooltip
            disabled={!anotherSchedulePublished}
            title="You need to unpublish before you can publish this schedule"
            type={TooltipMessageTypes.INFO}
          >
            <div
              style={{
                display: 'inline',
                marginLeft: '15px',
                padding: '10px 0',
              }}
            >
              {schedulePublished ? (
                <Button
                  label="Unpublish"
                  variant="text"
                  color="secondary"
                  disabled={savingInProgress}
                  onClick={() => onUnpublish(schedule)}
                />
              ) : (
                <Button
                  label="Publish"
                  variant="text"
                  color="secondary"
                  disabled={anotherSchedulePublished || savingInProgress}
                  onClick={() => onPublish(schedule)}
                />
              )}
            </div>
          </Tooltip>
        </div>
        <p className={styles.textWrapper}>
          <b>Status:</b> <span>{schedule.schedule_status || '—'}</span>{' '}
          <span
            className={styles.scheduleStatus}
            style={{
              ...getTournamentStatusColor(schedule.schedule_status),
            }}
          />
        </p>
        <p className={styles.textWrapper}>
          <b>Created by:</b>
          <span className={styles.textNameWrapper}>
            <span> {schedule.createdByName}</span>
            <span>{moment(schedule.created_datetime).format('LLL')}</span>
          </span>
        </p>
        <p className={styles.textWrapper}>
          <b>Last Updated By:</b>
          <span className={styles.textNameWrapper}>
            {schedule.updated_by ? (
              <>
                <span>{schedule.updatedByName}</span>
                <span>{moment(schedule.updated_datetime).format('LLL')}</span>
              </>
            ) : (
              DEFAULT_UPDATED_VALUE
            )}
          </span>
        </p>
        <div className={styles.btnsWrapper}>
          <Button
            icon={<FontAwesomeIcon icon={faEdit} />}
            label="Edit Schedule Details"
            color="secondary"
            variant="text"
            onClick={localOnEditSchedule}
          />
          <Link to={`${Routes.SCHEDULES}/${eventId}/${schedule.schedule_id}`}>
            <Button
              icon={<FontAwesomeIcon icon={faCalendar} />}
              label="Manage Tournament Play"
              color="secondary"
              variant="text"
            />
          </Link>
        </div>
        {false && (
          <div className={styles.tnThird}>
            <Tooltip
              type="warning"
              title="TRUE Florida (2020, 2021) cannot play 10:00 AM - 12:00 PM"
            >
              <div className={styles.errorMessage}>
                <FontAwesomeIcon icon={faExclamationCircle} />
                <span>Schedule Requires Revisions</span>
              </div>
            </Tooltip>
          </div>
        )}
      </Paper>
    </li>
  );
};

export default TournamentPlayItem;
