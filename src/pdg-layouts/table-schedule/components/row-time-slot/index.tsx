import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { formatTimeSlot, getDivisionCutName } from 'helpers';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from 'components/common/matrix-table/helper';
import { ITeamCard } from 'common/models/schedule/teams';
import { getContrastingColor } from 'components/common/matrix-table/helper';
import { styles } from './styles';

const EVEN_COLOR = '#DCDCDC';

interface Props {
  timeSlot: ITimeSlot;
  games: IGame[];
  isEven: boolean;
  isHeatMap?: boolean;
}

const RowTimeSlot = ({ timeSlot, games, isEven, isHeatMap }: Props) => {
  const getTeamColorStyles = (team: ITeamCard) => ({
    backgroundColor: isHeatMap ? team.divisionHex : '',
    color: isHeatMap ? getContrastingColor(team.divisionHex) : '#000000',
  });

  const getTeam = (team: ITeamCard) => (
    <View
      style={{
        ...styles.gameTeamName,
        ...getTeamColorStyles(team),
      }}
    >
      <Text style={styles.teamNameWrapper}>{team.name}</Text>
      <Text style={styles.divisionNameWrapper}>
        {` (${getDivisionCutName(team.divisionShortName!)})`}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        ...styles.timeSlotRow,
        backgroundColor: !isHeatMap && isEven ? EVEN_COLOR : '',
      }}
      wrap={false}
    >
      <Text style={styles.timeSlot}>{formatTimeSlot(timeSlot.time)}</Text>
      {games.map(game => (
        <View style={styles.gameWrapper} key={game.id}>
          {game.awayTeam && game.homeTeam && (
            <>
              {getTeam(game.awayTeam)}
              {getTeam(game.homeTeam)}
            </>
          )}
        </View>
      ))}
    </View>
  );
};

export default RowTimeSlot;
