import {
  ISchedulesGame,
  IField,
  ITeam,
  ISchedulesGameWithNames,
} from 'common/models';

const findTeam = (teamId: string, teams: ITeam[]) => {
  const currentTeam = teams.find(team => team.team_id === teamId);

  return currentTeam;
};

const mapScheduleGamesWithNames = (
  teams: ITeam[],
  fields: IField[],
  games: ISchedulesGame[]
) => {
  const mappedGames = games.map(
    (game): ISchedulesGameWithNames => {
      const currentField = fields.find(
        (field: IField) => field.field_id === game.field_id
      );

      return {
        id: game.game_id,
        fieldId: game.field_id,
        fieldName: currentField?.field_name || 'Field',
        awayTeamId: game.away_team_id,
        awayTeamName: game.away_team_id
          ? findTeam(game.away_team_id, teams)!.short_name
          : null,
        awayTeamScore: game.away_team_score,
        homeTeamId: game.home_team_id,
        homeTeamName: game.home_team_id
          ? findTeam(game.home_team_id, teams)!.short_name
          : null,
        homeTeamScore: game.home_team_score,
        gameDate: game.game_date,
        startTime: game.start_time!,
        createTime: game.created_datetime,
        updatedTime: game.updated_datetime,
      };
    }
  );

  return mappedGames;
};

export { mapScheduleGamesWithNames };
