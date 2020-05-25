import React from 'react';
import styles from './styles.module.scss';
import MultiSelect, {
  IMultiSelectOption,
} from 'components/common/multi-select';

export interface IScheduleFilter {
  divisionsOptions: IMultiSelectOption[];
  poolsOptions: IMultiSelectOption[];
  teamsOptions: IMultiSelectOption[];
}

interface IProps {
  filterValues: IScheduleFilter;
  onChangeFilterValue: (values: IScheduleFilter) => void;
}

const ScoringFilter = (props: IProps) => {
  const { filterValues, onChangeFilterValue } = props;

  const { divisionsOptions, poolsOptions, teamsOptions } = filterValues;

  const onSelectUpdate = (name: string, options: IMultiSelectOption[]) => {
    onChangeFilterValue({
      ...filterValues,
      [name]: options,
    });
  };

  return (
    <section>
      <h3 className="visually-hidden">Scoring filters</h3>
      <form className={styles.scoringForm}>
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
        </div>
      </form>
    </section>
  );
};

export default ScoringFilter;
