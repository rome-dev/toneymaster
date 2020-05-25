import React from 'react';
import styles from '../styles.module.scss';
import { IField } from 'common/models/schedule/fields';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { getIcon } from 'helpers';
import { Icons, TableScheduleTypes } from 'common/enums';
import { ITeamCard } from 'common/models/schedule/teams';
import { IGame } from '../helper';

interface IProps {
  tableType: TableScheduleTypes;
  field: IField;
  facility?: IScheduleFacility;
  onTeamCardsUpdate: (teamCards: ITeamCard[]) => void;
  games: IGame[];
  teamCards: ITeamCard[];
}

const RenderFieldHeader = (props: IProps) => {
  const {
    tableType,
    field,
    facility,
    games,
    teamCards,
    onTeamCardsUpdate,
  } = props;

  const idsGamesForField = games
    .filter(game => game.fieldId === field.id)
    .map(game => game.id);

  const currentDate = games.find(item => item.gameDate)?.gameDate;

  const isEveryTeamInFieldLocked = teamCards.every(team =>
    team.games
      ?.filter(
        game => idsGamesForField.includes(game.id) && currentDate === game.date
      )
      .every(game => game.isTeamLocked)
  );

  const onLockClick = () => {
    const updatedTeamCards = teamCards.map(teamCard => ({
      ...teamCard,
      games: teamCard.games?.map(item =>
        idsGamesForField.includes(item.id) && currentDate === item.date
          ? { ...item, isTeamLocked: !isEveryTeamInFieldLocked }
          : item
      ),
    }));
    onTeamCardsUpdate(updatedTeamCards);
  };

  return (
    <th
      key={field.id}
      className={styles.fieldTh}
      style={{ opacity: field.isUnused ? 0.4 : 1 }}
    >
      <div className={styles.fieldNameContainer}>
        <div>
          {field.isPremier ? '*' : ''} {field.name} ({facility?.abbr})
        </div>
        {tableType === TableScheduleTypes.SCHEDULES && (
          <button className={styles.lockBtn} onClick={onLockClick}>
            {getIcon(isEveryTeamInFieldLocked ? Icons.LOCK : Icons.LOCK_OPEN, {
              fill: '#00A3EA',
            })}
            <span className="visually-hidden">Unlock/Lock teams</span>
          </button>
        )}
      </div>
    </th>
  );
};

export default RenderFieldHeader;
