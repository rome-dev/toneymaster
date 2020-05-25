import React from 'react';
import { View } from '@react-pdf/renderer';
import RowTimeSlot from '../row-time-slot';
import { selectProperGamesPerTimeSlot } from 'components/common/matrix-table/helper';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from 'components/common/matrix-table/helper';
interface Props {
  timeSlots: ITimeSlot[];
  games: IGame[];
}

const TableTbody = ({ timeSlots, games }: Props) => {
  return (
    <View>
      {timeSlots.map((timeSlot, idx) => (
        <RowTimeSlot
          timeSlot={timeSlot}
          games={selectProperGamesPerTimeSlot(timeSlot, games)}
          isEven={idx % 2 === 0}
          key={timeSlot.id}
        />
      ))}
    </View>
  );
};

export default TableTbody;
