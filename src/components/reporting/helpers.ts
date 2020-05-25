import moment from 'moment';
import {
  settleTeamsPerGamesDays,
  IGame,
} from 'components/common/matrix-table/helper';
import { mapSchedulesTeamCards } from 'components/schedules/mapScheduleData';
import { calculateTournamentDays } from 'helpers';
import {
  IEventDetails,
  ISchedule,
  ISchedulesDetails,
  IPool,
} from 'common/models';
import { ITeamCard } from 'common/models/schedule/teams';
import { IField } from 'common/models/schedule/fields';
import { IScheduleFacility } from 'common/models/schedule/facilities';

const getScheduleTableRow = (
  schedulesDetails: ISchedulesDetails[],
  facilities: IScheduleFacility[],
  fields: IField[],
  teamCards: ITeamCard[],
  pools: IPool[]
) => {
  const rows = schedulesDetails.reduce((acc, it) => {
    if (!it.away_team_id && !it.home_team_id) {
      return acc;
    }

    const date = it.game_date ? moment(it.game_date).format('L') : '';
    const time = it.game_time;
    const field = fields.find(field => field.id === it.field_id);
    const facility = facilities.find(
      facility => facility.id === field?.facilityId
    );
    const awayTeam = teamCards.find(
      teamCard => teamCard.id === it.away_team_id
    );
    const homeTeam = teamCards.find(
      teamCard => teamCard.id === it.home_team_id
    );
    const divisionName = awayTeam?.divisionShortName;
    const pool = pools.find(pool => pool.pool_id === it.pool_id);

    const row = [
      date,
      time,
      facility?.name,
      field?.name,
      divisionName,
      pool?.pool_name,
      awayTeam?.name,
      homeTeam?.name,
    ];

    return [...acc, row];
  }, [] as Array<string | null | undefined>[]);

  return rows;
};

const getScheduleTableXLSX = async (
  event: IEventDetails,
  schedule: ISchedule,
  games: IGame[],
  teamCards: ITeamCard[],
  facilities: IScheduleFacility[],
  fields: IField[],
  pools: IPool[]
) => {
  const header = [
    'Date',
    'Time',
    'Facility',
    'Field',
    'Division',
    'Pool',
    'Away Team Name',
    'Home Team Name',
  ];

  const tournamentDays = calculateTournamentDays(event);

  let schedulesTableGames = [];
  for (const day of tournamentDays) {
    schedulesTableGames.push(settleTeamsPerGamesDays(games, teamCards, day));
  }
  schedulesTableGames = schedulesTableGames.flat();

  const schedulesDetails = await mapSchedulesTeamCards(
    schedule,
    schedulesTableGames,
    false,
    undefined
  );

  const body = getScheduleTableRow(
    schedulesDetails,
    facilities,
    fields,
    teamCards,
    pools
  );

  return {
    header,
    body,
  };
};

export { getScheduleTableXLSX };
