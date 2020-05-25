import { ISchedule, IConfigurableSchedule } from 'common/models/schedule';
import { IGame } from 'components/common/matrix-table/helper';
import { Auth } from 'aws-amplify';
import api from 'api/api';
import { IMember } from 'common/models';
import { ISchedulesDetails } from 'common/models/schedule/schedules-details';
import { getVarcharEight } from 'helpers';
import { ITeam, ITeamCard } from 'common/models/schedule/teams';
import { ISchedulesGame } from 'common/models/schedule/game';
import { ISchedulingSchedule } from 'components/scheduling/types';
import { unionWith, isEqual } from 'lodash-es';

export const mapScheduleData = (
  scheduleData: IConfigurableSchedule
): ISchedule => {
  const data = {
    ...scheduleData,
  };

  delete data?.num_fields;
  delete data?.periods_per_game;
  delete data?.isManualScheduling;
  return data;
};

export const mapSchedulingScheduleData = (
  scheduleData: ISchedulingSchedule
) => {
  const data = { ...scheduleData };
  delete data?.createdByName;
  delete data?.updatedByName;
  return data;
};

const getVersionId = (
  gameId: number,
  gameDate?: string,
  schedulesDetails?: ISchedulesDetails[]
) => {
  if (schedulesDetails) {
    return schedulesDetails.find(
      item =>
        Number(item.game_id) === Number(gameId) &&
        gameDate &&
        item.game_date === gameDate
    )?.schedule_version_id;
  }
  return false;
};

const getMember = async () => {
  const currentSession = await Auth.currentSession();
  const userEmail = currentSession.getIdToken().payload.email;
  const members = await api.get(`/members?email_address=${userEmail}`);
  const member: IMember = members.find(
    (it: IMember) => it.email_address === userEmail
  );
  return member;
};

const getLockedValue = (team?: ITeamCard, game?: IGame) =>
  team &&
  game &&
  team?.games?.find(
    teamGame => teamGame.id === game?.id && teamGame.date === game?.gameDate
  )?.isTeamLocked
    ? 1
    : 0;

export const mapSchedulesTeamCards = async (
  scheduleData: ISchedule,
  games: IGame[],
  isDraft: boolean,
  schedulesDetails?: ISchedulesDetails[]
) => {
  const member = await getMember();
  const memberId = member.member_id;

  const scheduleId = scheduleData.schedule_id;
  const eventId = scheduleData.event_id;

  const scheduleDetails: ISchedulesDetails[] = games.map(game => ({
    schedule_version_id:
      getVersionId(game.id, game.gameDate, schedulesDetails) ||
      getVarcharEight(),
    schedule_version_desc: null,
    schedule_id: scheduleId,
    schedule_desc: null,
    event_id: eventId,
    division_id: game.homeTeam?.divisionId || null,
    pool_id: game.homeTeam?.poolId || null,
    game_id: game.id,
    game_date: game.gameDate || null,
    game_time: game.startTime || null,
    field_id: game.fieldId,
    away_team_id: game.awayTeam?.id || null,
    home_team_id: game.homeTeam?.id || null,
    game_locked_YN: null,
    away_team_locked: getLockedValue(game.awayTeam, game),
    home_team_locked: getLockedValue(game.homeTeam, game),
    is_draft_YN: isDraft ? 1 : 0,
    is_published_YN: isDraft ? 0 : 1,
    created_by: memberId,
    created_datetime: game.createDate || new Date().toISOString(),
    updated_by: memberId,
    updated_datetime: new Date().toISOString(),
  }));

  return scheduleDetails;
};

const getGameIdFromPublished = (game: IGame, games?: ISchedulesGame[]) => {
  return games
    ? games.find(
        item =>
          (item.start_time === game.startTime &&
            item.game_date === game.gameDate &&
            item.field_id === game.fieldId) ||
          (item.away_team_id === game.awayTeam?.id &&
            item.game_date === game.gameDate &&
            item.home_team_id === game.homeTeam?.id)
      )?.game_id
    : null;
};

export const mapTeamCardsToSchedulesGames = async (
  scheduleData: ISchedule,
  games: IGame[],
  publishedGames?: ISchedulesGame[]
) => {
  const member = await getMember();
  const memberId = member.member_id;

  const scheduleId = scheduleData.schedule_id;
  const eventId = scheduleData.event_id;

  const schedulesGames: ISchedulesGame[] = games.map(game => ({
    game_id: getGameIdFromPublished(game, publishedGames) || getVarcharEight(),
    event_id: eventId,
    schedule_id: scheduleId,
    sport_id: 1,
    facilities_id: game.facilityId || '',
    field_id: game.fieldId,
    game_date: game.gameDate || '',
    start_time: game.startTime || '',
    division_id: game.awayTeam?.divisionId || null,
    pool_id: game.awayTeam?.poolId || null,
    away_team_id: game.awayTeam?.id || null,
    home_team_id: game.homeTeam?.id || null,
    away_team_score:
      game.awayTeam?.games?.find(
        g => g.id === game.id && game.gameDate === g.date
      )?.teamScore || null,
    home_team_score:
      game.homeTeam?.games?.find(
        g => g.id === game.id && game.gameDate === g.date
      )?.teamScore || null,
    is_active_YN: 1,
    is_final_YN: null,
    finalized_by: null,
    finalized_datetime: null,
    is_bracket_YN: null,
    created_by: memberId,
    created_datetime: game.createDate || new Date().toISOString(),
    updated_by: memberId,
    updated_datetime: new Date().toISOString(),
  }));

  return schedulesGames;
};

export const mapTeamsFromSchedulesDetails = (
  schedulesDetails: ISchedulesDetails[],
  teams: ITeam[]
) => {
  const sd = schedulesDetails.map(item => ({
    gameId: item.game_id,
    awayTeamId: item.away_team_id,
    homeTeamId: item.home_team_id,
    date: item.game_date || undefined,
    awayTeamLocked: item.away_team_locked,
    homeTeamLocked: item.home_team_locked,
  }));

  const runGamesSelection = (team: ITeam) => {
    const games = [
      ...sd
        .filter(
          ({ awayTeamId, homeTeamId }) =>
            awayTeamId === team.id || homeTeamId === team.id
        )
        .map(
          ({ gameId, awayTeamId, date, awayTeamLocked, homeTeamLocked }) => ({
            id: Number(gameId),
            teamPosition: awayTeamId === team.id ? 1 : 2,
            isTeamLocked:
              awayTeamId === team.id
                ? Boolean(awayTeamLocked)
                : Boolean(homeTeamLocked),
            date,
          })
        ),
    ];

    return unionWith(games, isEqual);
  };

  const teamCards = teams.map(team => ({
    ...team,
    games: runGamesSelection(team),
  }));

  return teamCards;
};

export const mapTeamsFromShedulesGames = (
  schedulesGames: ISchedulesGame[],
  teams: ITeam[],
  games: IGame[]
) => {
  const sg = schedulesGames.map(item => ({
    awayTeamId: item.away_team_id,
    homeTeamId: item.home_team_id,
    awayTeamScore: item.away_team_score,
    homeTeamScore: item.home_team_score,
    startTime: item.start_time,
    fieldId: item.field_id,
    date: item.game_date,
  }));

  const runGamesSelection = (team: ITeam) => {
    const localGames = [
      ...sg
        .filter(
          ({ awayTeamId, homeTeamId }) =>
            awayTeamId === team.id || homeTeamId === team.id
        )
        .map(scheduleGame => ({
          id: games.find(
            game =>
              game.startTime === scheduleGame.startTime &&
              game.fieldId === scheduleGame.fieldId
          )?.id!,
          date: scheduleGame.date,
          teamPosition: scheduleGame.awayTeamId === team.id ? 1 : 2,
          teamScore:
            scheduleGame.awayTeamId === team.id
              ? scheduleGame.awayTeamScore
              : scheduleGame.homeTeamScore,
        })),
    ];

    return unionWith(localGames, isEqual);
  };

  const teamCards = teams.map(team => ({
    ...team,
    games: runGamesSelection(team),
  }));

  return teamCards;
};
