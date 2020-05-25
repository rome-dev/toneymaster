import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';

import styles from '../styles.module.scss';
import {
  SectionDropdown,
  HeadingLevelThree,
  Button,
  Select,
  Input,
  Tooltip,
  CardMessage,
} from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import {
  getIcon,
  getTimeFromString,
  timeToString,
  calculateTimeSlots,
  timeToDate,
  getTimeValuesFromSchedule,
} from 'helpers';

import { EventMenuTitles, Icons } from 'common/enums';
import { IConfigurableSchedule, IEventDetails } from 'common/models';
import { BindingAction } from 'common/models';
import { ArchitectFormFields, gameStartOnOptions } from '../types';
import moment from 'moment';

const STYLES_INFO_ICON = {
  marginLeft: '5px',
  fill: '#00A3EA',
};

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IProps {
  schedule: IConfigurableSchedule;
  event?: IEventDetails | null;
  onChange: (name: string, value: any) => void;
  onViewEventMatrix: BindingAction;
  isSectionExpand: boolean;
}

const TourneyArchitect = (props: IProps) => {
  const {
    schedule,
    event,
    isSectionExpand,
    onChange,
    onViewEventMatrix,
  } = props;

  const timeValues = getTimeValuesFromSchedule(schedule);
  const scheduleTimeSlots = calculateTimeSlots(timeValues);

  const totalGameSlots = scheduleTimeSlots?.length! * schedule.num_fields;

  const localChange = ({ target: { name, value } }: InputTargetValue) => {
    onChange(name, value);
  };

  const onTimeChage = ({ target: { name, value } }: InputTargetValue) => {
    onChange(name, timeToString(Number(value)));
  };

  const renderSectionCell = (
    name: string,
    tooltipTitle: string,
    value: any,
    infoIcon?: boolean
  ) => (
    <div className={styles.sectionCell}>
      <p>
        <b>{`${name}: `}</b>
        {value}
      </p>
      {infoIcon && (
        <Tooltip type="info" title={tooltipTitle}>
          {getIcon(Icons.INFO, STYLES_INFO_ICON)}
        </Tooltip>
      )}
    </div>
  );

  return (
    <SectionDropdown
      type="section"
      expanded={isSectionExpand}
      useBorder={true}
      id={EventMenuTitles.TOURNEY_ARCHITECT}
    >
      <HeadingLevelThree>
        <span className={styles.blockHeading}>
          {EventMenuTitles.TOURNEY_ARCHITECT}
        </span>
      </HeadingLevelThree>
      <div className={styles.tourneyArchitect}>
        <div className={styles.taFirst}>
          {renderSectionCell(
            'Number of Fields',
            'Inherited from Facilities and a constant (does not change)',
            `${schedule.num_fields}`,
            true
          )}
          {renderSectionCell(
            'Play Time Window',
            'Inherited from Event Details and is a constant',
            `${schedule.first_game_time &&
              moment(timeToDate(schedule.first_game_time)).format(
                'LT'
              )} - ${schedule.last_game_end_time &&
              moment(timeToDate(schedule.last_game_end_time)).format('LT')}`,
            true
          )}
          {renderSectionCell(
            'Teams Registered/Max',
            'Current # / Max # if timeslots are all full',
            `${schedule.num_teams}/${schedule.num_teams}`,
            true
          )}
        </div>
        <div className={styles.taSecond}>
          <Select
            options={gameStartOnOptions.map(option => ({
              label: option,
              value: option,
            }))}
            onChange={localChange}
            value={schedule.games_start_on}
            name={ArchitectFormFields.GAMES_START_ON}
            label="Games Start On"
            width="100px"
            align="center"
          />
          <fieldset className={styles.numberGames}>
            <legend>Min/Max # of Games/Day</legend>
            <div className={styles.numberGamesWrapper}>
              <Input
                onChange={localChange}
                value={schedule.min_num_games || ''}
                name={ArchitectFormFields.MIN_NUM_GAMES}
                width="50px"
                minWidth="50px"
                type="number"
              />
              <Input
                onChange={localChange}
                value={schedule.max_num_games || ''}
                name={ArchitectFormFields.MAX_NUM_GAMES}
                width="50px"
                minWidth="50px"
                type="number"
              />
            </div>
          </fieldset>
          <Input
            onChange={onTimeChage}
            value={getTimeFromString(
              schedule.pre_game_warmup!,
              'minutes'
            ).toString()}
            name={ArchitectFormFields.PRE_GAME_WARMUP}
            width="100px"
            type="number"
            align="center"
            label="Warmup"
          />
          <Input
            onChange={onTimeChage}
            value={getTimeFromString(
              schedule.period_duration!,
              'minutes'
            ).toString()}
            name={ArchitectFormFields.PERIOD_DURATION}
            width="100px"
            type="number"
            align="center"
            label={`Time Division Duration(${schedule.periods_per_game})`}
          />
          <Input
            onChange={onTimeChage}
            value={getTimeFromString(
              schedule.time_btwn_periods!,
              'minutes'
            ).toString()}
            name={ArchitectFormFields.TIME_BTWN_PERIODS}
            width="100px"
            type="number"
            align="center"
            label="Time Between Periods"
          />
        </div>
        <div className={styles.results}>
          {renderSectionCell(
            'Game Runtime',
            '',
            `${schedule.periods_per_game *
              getTimeFromString(schedule.period_duration!, 'minutes') +
              getTimeFromString(schedule.pre_game_warmup!, 'minutes') +
              getTimeFromString(
                schedule.time_btwn_periods!,
                'minutes'
              )} Minutes`
          )}
          {renderSectionCell('Game Slots/Day', '', `${totalGameSlots}`)}
          {renderSectionCell(
            'AVG # Games/Team',
            '',
            `${((totalGameSlots * 2) / schedule.num_teams).toFixed(1)}`
          )}
          {event &&
            renderSectionCell(
              'Bracket Games Needed',
              '',
              `${(Number(event.num_teams_bracket) - 1) *
                schedule.num_divisions}`
            )}
        </div>
        <div className={styles.resultsBtns}>
          <Button
            label="View Time Slots"
            icon={<FontAwesomeIcon icon={faEye} />}
            color="secondary"
            variant="text"
            onClick={onViewEventMatrix}
          />
        </div>
        <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
          Changing the game time and games start on will affect the total game
          slots and average games per team. Event Details and Facilities can
          also be edited to optimize the schedule.
        </CardMessage>
      </div>
    </SectionDropdown>
  );
};

export default TourneyArchitect;
