import { ISchedulesGame } from 'common/models';
import { IGame } from 'components/common/matrix-table/helper';

const mapGamesWithSchedulesGamesId = (
  games: IGame[],
  schedulesGames: ISchedulesGame[]
) => {
  const mappedGames = games?.map(game => ({
    ...game,
    varcharId: schedulesGames.find(
      schedulesGame =>
        game.fieldId === schedulesGame.field_id &&
        game.startTime === schedulesGame.start_time
    )?.game_id,
  }));

  return mappedGames;
};

export { mapGamesWithSchedulesGamesId };
