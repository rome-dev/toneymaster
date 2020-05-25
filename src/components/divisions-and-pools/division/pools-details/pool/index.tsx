import React from 'react';
import { useDrop } from 'react-dnd';
import styles from '../styles.module.scss';
import { IPool, ITeam, IDivision } from 'common/models';
import { DndItems } from '../../../common';
import ItemTeam from '../../item-team';
import { sortByField } from 'helpers';
import { SortByFilesTypes } from 'common/enums';

interface IPoolProps {
  division: IDivision;
  pool?: Partial<IPool>;
  teams: ITeam[];
  isArrange: boolean;
  changePool: (team: ITeam, divisionId: string, poolId: string | null) => void;
  onDeletePopupOpen: (team: ITeam) => void;
  onEditPopupOpen: (
    team: ITeam,
    divisionName: string,
    poolName: string
  ) => void;
  toggleChangesAreMade: any;
}

const Pool = ({
  pool,
  teams,
  division,
  isArrange,
  changePool,
  onDeletePopupOpen,
  onEditPopupOpen,
  toggleChangesAreMade,
}: IPoolProps) => {
  const [, drop] = useDrop({
    accept: DndItems.TEAM,
    drop: () => {
      toggleChangesAreMade(true);
      return {
        divisionId: division.division_id,
        poolId: pool ? pool.pool_id : null,
      };
    },
  });

  return (
    <div className={styles.pool}>
      <p className={styles.poolTitle}>{pool ? pool.pool_name : 'Unassigned'}</p>
      <ul className={styles.teamList} ref={isArrange ? drop : null}>
        {sortByField(teams, SortByFilesTypes.TEAMS).map(it => (
          <ItemTeam
            team={it}
            divisionName={division ? division.long_name : ''}
            poolName={pool?.pool_name}
            isArrange={isArrange}
            changePool={changePool}
            onDeletePopupOpen={onDeletePopupOpen}
            onEditPopupOpen={onEditPopupOpen}
            key={it.team_id}
          />
        ))}
      </ul>
    </div>
  );
};

export default Pool;
