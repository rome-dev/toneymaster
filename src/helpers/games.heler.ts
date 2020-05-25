import {
  settleTeamsPerGames,
  IGame,
} from 'components/common/matrix-table/helper';
import { ITeamCard } from 'common/models/schedule/teams';
import { DefaultSelectValues } from 'common/enums';

const getAllTeamCardGames = (
  teamCards: ITeamCard[],
  games: IGame[],
  eventDays: string[]
) => {
  const allGamesByTeamCards = eventDays
    .map((_, idx) =>
      settleTeamsPerGames(games, teamCards, eventDays, `Day ${idx + 1}`)
    )
    .flat();

  return allGamesByTeamCards;
};

const getGamesByDays = (games: IGame[], activeDay: string[]) => {
  const gamesByDays = games.filter(
    it =>
      activeDay.includes(it.gameDate!) ||
      activeDay.includes(DefaultSelectValues.ALL)
  );

  return gamesByDays;
};

export { getAllTeamCardGames, getGamesByDays };
