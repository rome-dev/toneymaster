import React from 'react';
import { useDrop } from 'react-dnd';
import { IBracketGame } from 'components/playoffs/bracketGames';
import { orderBy } from 'lodash-es';
import { MatrixTableDropEnum } from 'components/common/matrix-table/dnd/drop';
import BracketGameCard from 'components/playoffs/dnd/bracket-game';
import { IDivision } from 'common/models';
import { IGame } from 'components/common/matrix-table/helper';
import styles from './styles.module.scss';

interface IProps {
  acceptType: string;
  bracketGames: IBracketGame[];
  divisions: IDivision[];
  filteredGames: IGame[];
  onDrop: (dropParams: any) => void;
  setHighlightedGame: (gameId: number) => void;
}

export default (props: IProps) => {
  const { bracketGames, acceptType } = props;
  const [{ isOver }, drop] = useDrop({
    accept: acceptType,
    drop: (item: any) => {
      props.onDrop({
        teamId: item.id,
        gameId: undefined,
      });
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
    }),
  });

  const unassignedBracketGames = bracketGames?.filter(
    item => !item.hidden && !item.fieldId && !item.startTime
  );

  const currentBracketGames = bracketGames?.filter(
    item => !item.hidden && item.fieldId && item.startTime
  );

  const orderedUnassignedBracketGames = orderBy(unassignedBracketGames, [
    'divisionId',
    'index',
    'round',
  ]);

  const orderedBracketGames = orderBy(currentBracketGames, [
    'divisionId',
    'index',
    'round',
  ]);

  const renderGame = (bracketGame: IBracketGame, index: number) => {
    const divisionHex = props.divisions.find(
      item => item.division_id === bracketGame.divisionId
    )?.division_hex;
    const game = props.filteredGames.find(
      item =>
        item.fieldId === bracketGame.fieldId &&
        item.startTime === bracketGame.startTime
    );

    return (
      <BracketGameCard
        key={`${index}-renderGame`}
        game={bracketGame}
        gameSlotId={game?.id}
        divisionHex={divisionHex!}
        type={MatrixTableDropEnum.BracketDrop}
        setHighlightedGame={props.setHighlightedGame}
      />
    );
  };

  return (
    <div ref={drop} style={{ opacity: isOver ? 0.8 : 1 }}>
      {!!orderedUnassignedBracketGames?.length && (
        <>
          <div className={styles.gamesTitle}>Unassigned Games</div>
          {orderedUnassignedBracketGames?.map((v, i) => renderGame(v, i))}
        </>
      )}
      {!!orderedBracketGames?.length && (
        <>
          <div className={styles.separationLine}>Assigned Games</div>
          {orderedBracketGames?.map((v, i) => renderGame(v, i))}
        </>
      )}
    </div>
  );
};
