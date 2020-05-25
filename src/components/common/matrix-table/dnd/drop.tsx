import React from 'react';
import { useDrop } from 'react-dnd';
import styles from './styles.module.scss';
import { ITeamCard } from 'common/models/schedule/teams';

export enum MatrixTableDropEnum {
  TeamDrop = 'teamdrop',
  BracketDrop = 'bracketdrop',
}

export interface IDropParams {
  teamId: string;
  position: number | undefined;
  gameId: number | undefined;
  originGameId?: number;
  originGameDate?: string;
}

interface IProps {
  acceptType: MatrixTableDropEnum[];
  gameId: number;
  position: 1 | 2;
  children?: React.ReactElement;
  onDrop: (dropParams: IDropParams) => void;
  teamCards: ITeamCard[];
}

const DropContainer = (props: IProps) => {
  const { acceptType, position, onDrop, children, gameId, teamCards } = props;

  const isTeamLocked = teamCards
    .map(team => team.games)
    .flat()
    .filter(
      (game: { id: number; position: number; isTeamLocked: boolean }) =>
        game.id === gameId
    )
    .filter(
      (game: { id: number; teamPosition: number; isTeamLocked: boolean }) =>
        game.teamPosition === props.position
    )[0]?.isTeamLocked;

  const canBeDropped =
    !isTeamLocked || acceptType.includes(MatrixTableDropEnum.BracketDrop);

  const [{ isOver }, drop] = useDrop({
    accept: acceptType,
    drop: (item: any) => {
      onDrop({
        teamId: item.id,
        position: props.position,
        gameId: props.gameId,
        originGameId: item.originGameId,
        originGameDate: item.originGameDate,
      });
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
    }),
    canDrop: () => canBeDropped,
  });

  return (
    <div
      ref={drop}
      className={`${styles.dropContainer} ${
        acceptType.includes(MatrixTableDropEnum.BracketDrop)
          ? styles.bracketContainer
          : ''
      } ${
        position === 1 ? styles.dropContainerTop : styles.dropContainerBottom
      }`}
      style={{ opacity: isOver && canBeDropped ? 0.5 : 1 }}
    >
      {children}
    </div>
  );
};

export default DropContainer;
