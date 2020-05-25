import React from 'react';
import moment from 'moment';
import styles from './styles.module.scss';
import SeedDrop from '../dnd/drop';
import Seed from '../dnd/seed';
import { IBracketGame } from '../bracketGames';
import { formatTimeSlot, getIcon } from 'helpers';
import { Button } from 'components/common';
import { Icons } from 'common/enums';

interface IProps {
  game: IBracketGame;
  onDrop: any;
  seedRound?: boolean;
  onRemove: (gameIndex: number) => void;
}

const BracketGameSlot = (props: IProps) => {
  const { game, onDrop, seedRound, onRemove } = props;
  const time = formatTimeSlot(game?.startTime || '');
  const date = moment(game?.gameDate).format('MM/DD/YYYY');

  const getDisplayName = (round?: number, depends?: number) => {
    if (round === undefined || !depends) return;
    const key = round > 0 ? 'Winner' : 'Loser';
    return `${key} Game ${depends}`;
  };

  const onRemovePressed = () => onRemove(game.index);

  return (
    <div
      key={game?.index}
      className={`${styles.bracketGame} ${game?.hidden && styles.hidden}`}
    >
      <SeedDrop
        id={game?.index}
        position={1}
        type="seed"
        onDrop={onDrop}
        placeholder={
          !seedRound ? getDisplayName(game.round, game.awayDependsUpon) : ''
        }
      >
        {game?.awaySeedId ? (
          <Seed
            id={game?.awaySeedId}
            name={String(game?.awaySeedId)}
            type="seed"
            dropped={true}
          />
        ) : (
          undefined
        )}
      </SeedDrop>
      <div className={styles.bracketGameDescription}>
        <div className={styles.descriptionInfo}>
          {game.fieldId && game.startTime ? (
            <>
              <span>{`Game ${game?.index}:  ${game?.fieldName}`}</span>
              <span>{`${time}, ${date}`}</span>
            </>
          ) : (
            <>
              <span>{`Game ${game?.index}`}</span>
              <span>Unassigned Game</span>
            </>
          )}
        </div>
        <div className={styles.bracketManage}>
          {game.awaySeedId || game.homeSeedId ? null : (
            <Button
              label={getIcon(Icons.DELETE)}
              variant="text"
              color="default"
              onClick={onRemovePressed}
            />
          )}
        </div>
      </div>
      <SeedDrop
        id={game?.index}
        position={2}
        type="seed"
        onDrop={onDrop}
        placeholder={
          !seedRound ? getDisplayName(game.round, game.homeDependsUpon) : ''
        }
      >
        {game?.homeSeedId ? (
          <Seed
            id={game?.homeSeedId}
            name={String(game?.homeSeedId)}
            type="seed"
            dropped={true}
          />
        ) : (
          undefined
        )}
      </SeedDrop>
    </div>
  );
};

export default BracketGameSlot;
