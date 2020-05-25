import React, { useEffect } from 'react';
import {
  SectionDropdown,
  HeadingLevelThree,
  Checkbox,
  CardMessage,
  Radio,
  Select,
  Input,
} from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import { EventMenuTitles } from 'common/enums';

import styles from '../styles.module.scss';

import { IEventDetails } from 'common/models';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

const bracketTypeOptions = [
  'Single Elimination',
  'Double Elimination',
  '3 Game Guarantee',
];

const topNumberOfTeams = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
];

enum bracketTypesEnum {
  'Single Elimination' = 1,
  'Double Elimination' = 2,
  '3 Game Guarantee' = 3,
}

enum numTeamsBracketEnum {
  'Top:' = 1,
  'All' = 2,
}

interface Props {
  eventData: Partial<IEventDetails>;
  onChange: any;
  isSectionExpand: boolean;
}

const PlayoffsSection: React.FC<Props> = ({
  eventData,
  onChange,
  isSectionExpand,
}: Props) => {
  const {
    playoffs_exist,
    bracket_type,
    num_teams_bracket,
    bracket_durations_vary,
  } = eventData;

  const bracketGameDurationOpts = [
    {
      label: 'Bracket Games have Different Game Durations',
      checked: Boolean(bracket_durations_vary),
    },
  ];

  const onPlayoffs = () => onChange('playoffs_exist', playoffs_exist ? 0 : 1);

  const onChangeBracketType = (e: InputTargetValue) =>
    onChange('bracket_type', bracketTypesEnum[e.target.value]);

  const onNumberOfTeamsChange = (e: InputTargetValue) =>
    onChange(
      'num_teams_bracket',
      e.target.value === numTeamsBracketEnum[2]
        ? null
        : Number(topNumberOfTeams[topNumberOfTeams.length - 1])
    );

  const onChangeMaxTeamNumber = (e: InputTargetValue) =>
    onChange('num_teams_bracket', Number(e.target.value));

  const onBracketGameDuration = () =>
    onChange('bracket_durations_vary', bracket_durations_vary ? 0 : 1);

  useEffect(() => {
    if (playoffs_exist && !bracket_type)
      onChange('bracket_type', bracketTypesEnum['Single Elimination']);
  });

  return (
    <SectionDropdown
      id={EventMenuTitles.PLAYOFFS}
      type="section"
      panelDetailsType="flat"
      useBorder={true}
      expanded={isSectionExpand}
    >
      <HeadingLevelThree>
        <span className={styles.blockHeading}>Playoffs</span>
      </HeadingLevelThree>
      <div className={styles.playoffsDetails}>
        <div className={styles.pdFirst}>
          <Checkbox
            formLabel=""
            options={[
              { label: 'Event has Playoffs', checked: Boolean(playoffs_exist) },
            ]}
            onChange={onPlayoffs}
          />
          <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
            Playoff settings include Bracket Type, # of Teams, and Ranking
            Factors
          </CardMessage>
        </div>
        {Boolean(playoffs_exist) && (
          <>
            <div className={styles.pdSecond}>
              <Radio
                formLabel="Bracket Type"
                options={bracketTypeOptions}
                onChange={onChangeBracketType}
                checked={bracketTypesEnum[bracket_type!]}
              />
              <Radio
                formLabel="# of Teams"
                options={['Top:', 'All']}
                onChange={onNumberOfTeamsChange}
                checked={numTeamsBracketEnum[num_teams_bracket ? 1 : 2]}
              />
              <Select
                label=""
                disabled={!num_teams_bracket}
                options={topNumberOfTeams.map(type => ({
                  label: type,
                  value: type,
                }))}
                value={String(num_teams_bracket || '')}
                onChange={onChangeMaxTeamNumber}
              />
            </div>
            <div className={styles.pdThird}>
              <Checkbox
                options={bracketGameDurationOpts}
                onChange={onBracketGameDuration}
              />
            </div>
            {Boolean(bracket_durations_vary) && (
              <div className={styles.pdFourth}>
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
          </>
        )}
      </div>
    </SectionDropdown>
  );
};

export default PlayoffsSection;
