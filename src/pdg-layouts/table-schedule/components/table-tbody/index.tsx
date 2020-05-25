import React from 'react';
import { View } from '@react-pdf/renderer';
import RowTimeSlot from '../row-time-slot';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from 'components/common/matrix-table/helper';
import { selectProperGamesPerTimeSlot } from 'components/common/matrix-table/helper';
import { DEFAUL_COLUMNS_COUNT } from '../../common';

interface Props {
  timeSlots: ITimeSlot[];
  games: IGame[];
  splitIdx: number;
  isHeatMap?: boolean;
}

const TableTbody = ({ timeSlots, games, splitIdx, isHeatMap }: Props) => {
  const timeSlotsWithGames = timeSlots.map((timeSlot, idx) => {
    const gamesPerTimeSlot = selectProperGamesPerTimeSlot(
      timeSlot,
      games
    ).slice(splitIdx, splitIdx + DEFAUL_COLUMNS_COUNT);

    return (
      <RowTimeSlot
        games={gamesPerTimeSlot}
        timeSlot={timeSlot}
        isEven={(idx + 1) % 2 === 0}
        isHeatMap={isHeatMap}
        key={timeSlot.id}
      />
    );
  });

  return <View>{timeSlotsWithGames}</View>;
};

export default TableTbody;
