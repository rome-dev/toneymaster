/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { ITeamCard } from 'common/models/schedule/teams';
import styles from './styles.module.scss';
import TeamDragCard from 'components/common/matrix-table/dnd/drag';
import { useDrop } from 'react-dnd';
import { IDropParams } from 'components/common/matrix-table/dnd/drop';
import { TableScheduleTypes } from 'common/enums';
import { getUnsatisfiedTeams, getSatisfiedTeams } from '../../helpers';
import Checkbox from 'components/common/buttons/checkbox';
import { TableSortLabel } from '@material-ui/core';
import { orderBy } from 'lodash-es';
import { IPool } from 'common/models';

interface IProps {
  pools: IPool[];
  tableType: TableScheduleTypes;
  teamCards: ITeamCard[];
  showHeatmap?: boolean;
  minGamesNum: number | null;
  onDrop: (dropParams: IDropParams) => void;
}

const UnassignedList = (props: IProps) => {
  const {
    teamCards,
    onDrop,
    showHeatmap,
    tableType,
    minGamesNum,
    pools,
  } = props;
  const acceptType = 'teamdrop';

  const [unsatisfiedTeamCards, setUnsatisfiedTeamCards] = useState(teamCards);
  const [satisfiedTeamCards, setSatisfiedTeamCards] = useState<
    ITeamCard[] | undefined
  >(undefined);
  const [showAllTeams, setShowAllTeams] = useState(true);
  const [showPools, setShowPools] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortData = (by: string) => {
    setSortBy(by);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setUnsatisfiedTeamCards(
      orderBy(unsatisfiedTeamCards, by, sortOrder === 'asc' ? 'asc' : 'desc')
    );
    setSatisfiedTeamCards(
      orderBy(satisfiedTeamCards, by, sortOrder === 'asc' ? 'asc' : 'desc')
    );
  };

  const onCheck = () => {
    setShowAllTeams(!showAllTeams);
  };

  const [{ isOver }, drop] = useDrop({
    accept: acceptType,
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
    drop: (item: any) => {
      onDrop({
        gameId: undefined,
        position: undefined,
        teamId: item.id,
        originGameId: item.originGameId,
        originGameDate: item.originGameDate,
      });
    },
  });

  useEffect(() => {
    const newUnsatisfiedTeamCards = getUnsatisfiedTeams(teamCards, minGamesNum);
    const newSatisfiedTeamCards = getSatisfiedTeams(teamCards, minGamesNum);

    const orderedUnsatisfiedTeamCards = orderBy(
      newUnsatisfiedTeamCards,
      'divisionId'
    );
    const orderedSatisfiedTeamCards = orderBy(
      newSatisfiedTeamCards,
      'divisionId'
    );

    setUnsatisfiedTeamCards(orderedUnsatisfiedTeamCards);
    setSatisfiedTeamCards(orderedSatisfiedTeamCards);
  }, [teamCards, showAllTeams]);

  return (
    <div
      className={styles.container}
      style={{ background: isOver ? '#fcfcfc' : '#ececec' }}
    >
      <h3 className={styles.title}>Needs Assignment</h3>
      <div className={styles.checkboxWrapper}>
        <Checkbox
          options={[{ label: 'All Teams', checked: showAllTeams }]}
          onChange={onCheck}
        />
        <Checkbox
          options={[{ label: 'Show Pools', checked: showPools }]}
          onChange={() => setShowPools(!showPools)}
        />
      </div>
      <div ref={drop} className={styles.dropArea}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={!showPools ? styles.collapsed : undefined}>
                Games{' '}
              </th>
              {showPools ? (
                <th className={styles.poolName}>
                  Pool
                  <TableSortLabel
                    className={styles.sortButton}
                    active={sortBy === 'poolId'}
                    direction={
                      sortOrder === 'desc' && sortBy === 'poolId'
                        ? 'asc'
                        : 'desc'
                    }
                    onClick={() => sortData('poolId')}
                  />
                </th>
              ) : null}
              <th>Team Name</th>
            </tr>
          </thead>
          <tbody className={!showPools ? styles.collapsed : undefined}>
            {unsatisfiedTeamCards.map((teamCard, ind) => (
              <tr key={`tr-${ind}`}>
                <td className={styles.gamesNum}>{teamCard.games?.length}</td>
                {showPools ? (
                  <td className={styles.poolName}>
                    {
                      pools.find(pool => teamCard.poolId === pool.pool_id)
                        ?.pool_name
                    }
                  </td>
                ) : null}
                <td>
                  <TeamDragCard
                    tableType={tableType}
                    showHeatmap={showHeatmap}
                    key={ind}
                    teamCard={teamCard}
                    type={acceptType}
                  />
                </td>
              </tr>
            ))}
            {!!(showAllTeams && unsatisfiedTeamCards.length) && (
              <tr className={styles.emptyRow}>
                <td />
                <td>Completed Teams</td>
              </tr>
            )}
            {showAllTeams &&
              satisfiedTeamCards?.map((teamCard, ind) => (
                <tr key={`tctr-${ind}`}>
                  <td className={styles.gamesNum}>{teamCard.games?.length}</td>
                  {showPools ? (
                    <td className={styles.poolName}>
                      {
                        pools.find(pool => teamCard.poolId === pool.pool_id)
                          ?.pool_name
                      }
                    </td>
                  ) : null}
                  <td>
                    <TeamDragCard
                      tableType={tableType}
                      showHeatmap={showHeatmap}
                      key={ind}
                      teamCard={teamCard}
                      type={acceptType}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnassignedList;
