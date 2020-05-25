import { Auth } from 'aws-amplify';
import api from 'api/api';
import { IBracket, IFetchedBracket } from 'common/models/playoffs/bracket';
import { getVarcharEight } from 'helpers';
import { IMember, IField } from 'common/models';
import { IBracketGame } from './bracketGames';
import { IPlayoffGame } from 'common/models/playoffs/bracket-game';

const YN = (v: boolean) => (!!v ? 1 : 0);

const getMember = async () => {
  const currentSession = await Auth.currentSession();
  const userEmail = currentSession.getIdToken().payload.email;
  const members = await api.get(`/members?email_address=${userEmail}`);
  const member: IMember = members.find(
    (it: IMember) => it.email_address === userEmail
  );
  return member;
};

export const mapBracketData = async (bracket: IBracket, _isDraft: boolean) => {
  const member = await getMember();
  const memberId = member.member_id;

  return {
    bracket_id: bracket.id,
    schedule_id: bracket.scheduleId,
    event_id: bracket.eventId,
    bracket_name: bracket.name,
    bracket_date: bracket.bracketDate,
    align_games: YN(bracket.alignItems),
    adjust_columns: YN(bracket.adjustTime),
    start_timeslot: bracket.startTimeSlot,
    custom_warmup: bracket.warmup,
    end_timeslot: bracket.endTimeSlot,
    fields_excluded: null,
    is_active_YN: 1,
    is_published_YN: bracket.published ? 1 : 0,
    created_by: memberId,
    created_datetime: bracket.createDate || new Date().toISOString(),
    updated_by: memberId,
    updated_datetime: new Date().toISOString(),
  } as IFetchedBracket;
};

export const mapBracketGames = async (
  bracketGames: IBracketGame[],
  bracket: IBracket
) => {
  const member = await getMember();
  const memberId = member.member_id;

  return bracketGames.map(
    (game): IPlayoffGame => ({
      game_id: game.id || getVarcharEight(),
      bracket_id: bracket.id,
      event_id: bracket.eventId,
      division_id: game.divisionId,
      bracket_year: game.divisionName || null,
      grid_num: game.gridNum,
      round_num: game.round,
      field_id: game.fieldId || null,
      game_date: game.gameDate!,
      game_num: game.index,
      away_depends_upon: game.awayDependsUpon || null,
      home_depends_upon: game.homeDependsUpon || null,
      start_time: game.startTime || null,
      seed_num_away: game.awaySeedId || null,
      seed_num_home: game.homeSeedId || null,
      away_team_id: game.awayTeamId || null,
      home_team_id: game.homeTeamId || null,
      away_team_score: null,
      home_team_score: null,
      is_active_YN: 1,
      created_by: memberId,
      created_datetime: game.createDate || new Date().toISOString(),
      updated_by: memberId,
      updated_datetime: new Date().toISOString(),
    })
  );
};

export const mapFetchedBracket = (bracketData: IFetchedBracket) => {
  return {
    id: bracketData.bracket_id,
    name: bracketData.bracket_name,
    scheduleId: bracketData.schedule_id,
    alignItems: !!bracketData.align_games,
    adjustTime: !!bracketData.adjust_columns,
    warmup: bracketData.custom_warmup,
    bracketDate: bracketData.bracket_date,
    eventId: bracketData.event_id,
    published: !!bracketData.is_published_YN,
    createdBy: bracketData.created_by,
    createDate: bracketData.created_datetime,
    updatedBy: bracketData.updated_by,
    updateDate: bracketData.updated_datetime,
  } as IBracket;
};

export const mapFetchedBracketGames = (
  bracketGames: IPlayoffGame[],
  fields: IField[]
) => {
  return bracketGames.map(
    (game): IBracketGame => ({
      id: game.game_id,
      index: game.game_num,
      round: game.round_num,
      gridNum: game.grid_num || 1,
      divisionId: game.division_id,
      divisionName: game.bracket_year || undefined,
      awaySeedId: game.seed_num_away || undefined,
      homeSeedId: game.seed_num_home || undefined,
      awayTeamId: game.away_team_id || undefined,
      homeTeamId: game.home_team_id || undefined,
      awayDependsUpon: game.away_depends_upon || undefined,
      homeDependsUpon: game.home_depends_upon || undefined,
      awayDisplayName: '',
      homeDisplayName: '',
      fieldId: game.field_id || undefined,
      fieldName: fields.find(item => item.field_id === game.field_id)
        ?.field_name,
      startTime: game.start_time || undefined,
      gameDate: game.game_date.toString(),
      hidden: !game.is_active_YN,
      createDate: game.created_datetime,
    })
  );
};
