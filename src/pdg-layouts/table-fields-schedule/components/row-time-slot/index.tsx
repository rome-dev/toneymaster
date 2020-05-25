import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { formatTimeSlot } from 'helpers';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IGame } from 'components/common/matrix-table/helper';
import { ITeamCard } from 'common/models/schedule/teams';
import { styles } from './styles';

const EVEN_COLOR = '#DCDCDC';

interface Props {
  timeSlot: ITimeSlot;
  games: IGame[];
  isEven: boolean;
}

const RowTimeSlot = ({ timeSlot, games, isEven }: Props) => {
  const getTeam = (team: ITeamCard) => (
    <View style={styles.team}>
      <Text style={styles.teamName}>
        {`${team.name} (${team.divisionShortName})`}
      </Text>
      <Text style={styles.teamNum}>
        {team.contactFirstName
          ? `${team.contactFirstName} ${team.contactLastName || ''}`
          : ''}
        {team.teamPhoneNum
          ? ` - ${team.teamPhoneNum}`
          : 'Team phone number is missing.'}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        ...styles.rowTimeSlot,
        backgroundColor: isEven ? EVEN_COLOR : '',
      }}
    >
      <Text style={styles.timeSlot}>{formatTimeSlot(timeSlot.time)}</Text>
      {games.map(game => (
        <View style={styles.gamesWrapper} key={game.id}>
          {game.awayTeam?.name && game.homeTeam?.name && (
            <>
              {getTeam(game.awayTeam)}
              {getTeam(game.homeTeam)}
            </>
          )}
        </View>
      ))}
      <View style={styles.scoresWrapper}>
        <View style={styles.scores} />
        <Text style={styles.scoresColon}>:</Text>
        <View style={styles.scores} />
      </View>
      <View style={styles.initials} />
    </View>
  );
};

export default RowTimeSlot;
