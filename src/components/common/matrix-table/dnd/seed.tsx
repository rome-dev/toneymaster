import React from 'react';
import styles from './styles.module.scss';
import { getContrastingColor } from '../helper';
import { useDrag } from 'react-dnd';

interface Props {
  position: 1 | 2;
  seedId?: number;
  round?: number;
  showHeatmap: boolean;
  divisionId: string;
  divisionHex?: string;
  divisionName?: string;
  playoffIndex: number;
  dependsUpon?: number;
  slotId: number;
  bracketGameId: string;
  type: string;
}

export default (props: Props) => {
  const {
    position,
    seedId,
    showHeatmap,
    divisionId,
    divisionHex,
    divisionName,
    round,
    playoffIndex,
    dependsUpon,
    type,
    bracketGameId,
  } = props;

  const [{ isDragging }, drag] = useDrag({
    item: { id: bracketGameId, type, divisionId, playoffIndex },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const getDisplayName = (round?: number, depends?: number) => {
    if (!round || !depends) return;
    const key = round >= 0 ? 'Winner' : 'Loser';
    return `${key} Game ${depends}`;
  };

  return (
    <div
      ref={drag}
      className={`${styles.seedContainer} ${
        position === 1 ? styles.seedContainerTop : styles.seedContainerBottom
      } ${showHeatmap && styles.heatmap}`}
      style={{
        background: divisionHex ? `#${divisionHex}` : '#fff',
        color: getContrastingColor(divisionHex),
        opacity: isDragging ? 0.8 : 1,
      }}
    >
      {seedId
        ? `Seed ${seedId} (${divisionName})`
        : getDisplayName(round, dependsUpon)}
    </div>
  );
};
