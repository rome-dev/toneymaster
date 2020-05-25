import { orderBy, findIndex, union } from 'lodash-es';
import { IField } from 'common/models/schedule/fields';
import { ITeamCard } from 'common/models/schedule/teams';
import ITimeSlot from 'common/models/schedule/timeSlots';

export enum TeamPositionEnum {
  'awayTeam' = 1,
  'homeTeam' = 2,
}

export interface IGame {
  id: number;
  varcharId?: string | number;
  startTime?: string;
  facilityId?: string;
  homeTeam?: ITeamCard;
  awayTeam?: ITeamCard;
  timeSlotId: number;
  fieldId: string;
  isPremier?: boolean;
  // PLAYOFFS
  awayDependsUpon?: number;
  homeDependsUpon?: number;
  isPlayoff?: boolean;
  playoffRound?: number;
  playoffIndex?: number;
  awaySeedId?: number;
  homeSeedId?: number;
  awayDisplayName?: string;
  homeDisplayName?: string;
  divisionName?: string;
  divisionHex?: string;
  divisionId?: string;
  bracketGameId?: string;
  gameDate?: string;
  scheduleVersionId?: string;
  createDate?: string;
}

export interface IDefinedGames {
  gameTimeSlots: number;
  gameFields: number;
  games: IGame[];
}

export const sortFieldsByPremier = (fields: IField[]) => {
  return fields.sort(
    (a, b): any =>
      (b.isPremier ? 1 : 0) - (a.isPremier ? 1 : 0) ||
      a.facilityName.localeCompare(b.facilityName, undefined, {
        numeric: true,
      }) ||
      a.name?.localeCompare(b.name!, undefined, { numeric: true })
  );
};

export const defineGames = (
  fields: IField[],
  timeSlots: ITimeSlot[]
): IDefinedGames => {
  const fieldsNumber = fields.length;
  const timeSlotsNumber = timeSlots.length;
  const gamesNumber = fieldsNumber * timeSlotsNumber;

  const games: IGame[] = [];
  for (let i = 1; i <= gamesNumber; i++) {
    const timeSlotId = Math.ceil(i / fieldsNumber) - 1;
    const startTime = timeSlots.find(timeSlot => timeSlot.id === timeSlotId)
      ?.time;
    const field = fields[i - Math.ceil(timeSlotId * fieldsNumber) - 1];
    const fieldId = field.id;
    const facilityId = field.facilityId;

    games.push({
      id: i,
      startTime,
      timeSlotId,
      fieldId,
      facilityId,
    });
  }

  return {
    gameTimeSlots: timeSlotsNumber,
    gameFields: gamesNumber <= fieldsNumber ? gamesNumber : fieldsNumber,
    games,
  };
};

export const selectProperGamesPerTimeSlot = (
  timeSlot: ITimeSlot,
  games: IGame[]
) => games.filter((game: IGame) => game.timeSlotId === timeSlot.id);

export const settleTeamsPerGamesDays = (
  games: IGame[],
  teamCards: ITeamCard[],
  day: string
) => {
  return games.map(game => ({
    ...game,
    gameDate: day,
    awayTeam: teamCards.find(
      team =>
        findIndex(team.games, {
          id: game.id,
          teamPosition: 1,
          date: day,
        }) >= 0
    ),
    homeTeam: teamCards.find(
      team =>
        findIndex(team.games, {
          id: game.id,
          teamPosition: 2,
          date: day,
        }) >= 0
    ),
  }));
};

export const settleTeamsPerGames = (
  games: IGame[],
  teamCards: ITeamCard[],
  days?: string[],
  selectedDay?: string
) => {
  if (days?.length && days?.length > 1 && selectedDay) {
    return games.map(game => ({
      ...game,
      gameDate: days[+selectedDay - 1],
      awayTeam: teamCards.find(
        team =>
          findIndex(team.games, {
            id: game.id,
            teamPosition: 1,
            date: days[+selectedDay - 1],
          }) >= 0
      ),
      homeTeam: teamCards.find(
        team =>
          findIndex(team.games, {
            id: game.id,
            teamPosition: 2,
            date: days[+selectedDay - 1],
          }) >= 0
      ),
    }));
  }

  return games.map(game => ({
    ...game,
    awayTeam: teamCards.find(
      team => findIndex(team.games, { id: game.id, teamPosition: 1 }) >= 0
    ),
    homeTeam: teamCards.find(
      team => findIndex(team.games, { id: game.id, teamPosition: 2 }) >= 0
    ),
  }));
};

export const arrayAverageOccurrence = (array: any[]) => {
  if (array.length === 0) return null;
  const modeMap = {};
  let maxCount = 1;
  let modes = [];

  for (const el of array) {
    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;

    if (modeMap[el] > maxCount) {
      modes = [el];
      maxCount = modeMap[el];
    } else if (modeMap[el] === maxCount) {
      modes.push(el);
      maxCount = modeMap[el];
    }
  }

  return modes[0];
};

export const getSortedByGamesNum = (data: any) =>
  Object.keys(data).sort((a, b) =>
    data[a].gamesNum < data[b].gamesNum ? 1 : -1
  );

export const getSortedDesc = (data: any) =>
  Object.keys(data).sort((a, b) => (data[a] < data[b] ? 1 : -1));

export const calculateDays = (teamCards: ITeamCard[]) => {
  const games = teamCards.map(item => item.games).flat();
  const gamesDates = games
    .map(item => item.date)
    .filter(date => date !== undefined);
  const uniqueDates = union(gamesDates);
  const sortedUniqueDates = orderBy(uniqueDates, [], 'asc');

  return sortedUniqueDates;
};

const hexToRgb = (hex?: string) => {
  if (!hex) {
    return null;
  }
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const getContrastingColor = (color?: string) => {
  const colorRGB = hexToRgb(color);
  if (colorRGB) {
    const luminance =
      // Original: 0.299 + 0.587 + 0.114.
      colorRGB.r * 0.29 + colorRGB.g * 0.58 + colorRGB.b * 0.1;
    return luminance >= 123 ? '#000' : '#FFF';
  }
  return '#FFF';
};
