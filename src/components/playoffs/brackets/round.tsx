import React from 'react';
import styles from './styles.module.scss';
import BracketGameSlot from './game-slot';
import { IBracketGame } from '../bracketGames';

interface IProps {
  games: IBracketGame[];
  onDrop: any;
  title: any;
  seedRound?: boolean;
  onRemove: (gameIndex: number) => void;
}

const BracketRound = (props: IProps) => {
  const { games, onDrop, title, seedRound, onRemove } = props;
  return (
    <div className={styles.bracketRound}>
      <span className={styles.roundTitle}>{title}</span>
      {games.map(game => (
        <BracketGameSlot
          onRemove={onRemove}
          key={`${Math.random()}-round`}
          seedRound={seedRound}
          game={game}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
};

export default BracketRound;
