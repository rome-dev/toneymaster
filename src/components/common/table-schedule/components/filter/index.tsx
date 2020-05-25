import React from 'react';
import { Button } from 'components/common';
import { ButtonTypes } from 'common/enums';
import { IScheduleFilter } from '../../types';
import styles from './styles.module.scss';
import MultiSelect, {
  IMultiSelectOption,
} from 'components/common/multi-select';
import InteractiveTooltip, {
  IModalItem,
} from 'components/common/interactive-tooltip';

interface IProps {
  days: number;
  warnings?: IModalItem[];
  filterValues: IScheduleFilter;
  onChangeFilterValue: (values: IScheduleFilter) => void;
}

const ScoringFilter = (props: IProps) => {
  const { filterValues, onChangeFilterValue, warnings } = props;

  const {
    divisionsOptions,
    poolsOptions,
    teamsOptions,
    fieldsOptions,
  } = filterValues;

  const onDaySelect = (day: string) => {
    onChangeFilterValue({
      ...filterValues,
      selectedDay: day,
    });
  };

  const onSelectUpdate = (name: string, options: IMultiSelectOption[]) => {
    onChangeFilterValue({
      ...filterValues,
      [name]: options,
    });
  };

  const days = [...Array(props.days)].map((_v, i) => `${i + 1}`);

  return (
    <section>
      <h3 className="visually-hidden">Scoring filters</h3>
      <form className={styles.scoringForm}>
        {days?.length > 1 && (
          <div className={styles.buttonsWrapper}>
            {days.map(day => (
              <Button
                onClick={() => onDaySelect(day)}
                label={`Day ${day}`}
                variant="contained"
                color="primary"
                type={
                  filterValues.selectedDay === day
                    ? ButtonTypes.SQUARED
                    : ButtonTypes.SQUARED_OUTLINED
                }
                key={day}
              />
            ))}
          </div>
        )}
        <div className={styles.selectsContainer}>
          <fieldset className={styles.selectWrapper}>
            <legend className={styles.selectTitle}>Divisions</legend>
            <MultiSelect
              name="divisionsOptions"
              selectOptions={divisionsOptions}
              onChange={onSelectUpdate}
            />
          </fieldset>
          <fieldset className={styles.selectWrapper}>
            <legend className={styles.selectTitle}>Pools</legend>
            <MultiSelect
              name="poolsOptions"
              selectOptions={poolsOptions}
              onChange={onSelectUpdate}
            />
          </fieldset>
          <fieldset className={styles.selectWrapper}>
            <legend className={styles.selectTitle}>Teams</legend>
            <MultiSelect
              name="teamsOptions"
              selectOptions={teamsOptions}
              onChange={onSelectUpdate}
            />
          </fieldset>
          <fieldset className={styles.selectWrapper}>
            <legend className={styles.selectTitle}>Fields</legend>
            <MultiSelect
              name="fieldsOptions"
              selectOptions={fieldsOptions}
              onChange={onSelectUpdate}
            />
          </fieldset>
          {warnings?.length ? (
            <InteractiveTooltip title="Scheduling Warning" items={warnings} />
          ) : null}
        </div>
      </form>
    </section>
  );
};

export default ScoringFilter;
