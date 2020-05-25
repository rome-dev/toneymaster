import { orderBy, union, min, max } from 'lodash-es';
import { IGame } from 'components/common/matrix-table/helper';
import { IBracketGame } from './bracketGames';
import { IOnAddGame } from './add-game-modal';
import { getVarcharEight } from 'helpers';
import { IDivision, IField } from 'common/models';

interface IBracketMoveWarning {
  gameAlreadyAssigned: boolean;
  gamePlayTimeInvalid: boolean;
  facilitiesDiffer: boolean;
}

export const updateGameBracketInfo = (game: IGame, withGame?: IGame) => ({
  ...game,
  awaySeedId: withGame?.awaySeedId,
  homeSeedId: withGame?.homeSeedId,
  awayDisplayName: withGame?.awayDisplayName,
  homeDisplayName: withGame?.homeDisplayName,
  awayTeam: withGame?.awayTeam,
  homeTeam: withGame?.homeTeam,
  divisionId: withGame?.divisionId,
  divisionName: withGame?.divisionName,
  divisionHex: withGame?.divisionHex,
  playoffIndex: withGame?.playoffIndex,
});

export const addGameToExistingBracketGames = (
  data: IOnAddGame,
  bracketGames: IBracketGame[],
  divisionId: string
) => {
  const { isWinner } = data;
  const awayDependsUpon = Number(data.awayDependsUpon);
  const homeDependsUpon = Number(data.homeDependsUpon);
  let gridNum = data.gridNum;

  // Selected division games
  const divisionGames = bracketGames?.filter(v => v.divisionId === divisionId);

  // Get origin games
  let awayDependent = bracketGames.find(v => v.index === awayDependsUpon)!;
  let homeDependent = bracketGames.find(v => v.index === homeDependsUpon)!;

  const bothOriginAreNotFromMainGrid =
    awayDependent.gridNum !== 1 && homeDependent.gridNum !== 1;

  // Set round for the new game
  let round = 0;
  const roundInceremented =
    Math.max(Math.abs(awayDependent?.round), Math.abs(homeDependent?.round)) +
    1;
  round = isWinner ? roundInceremented : -roundInceremented;

  // Create a new grid or merge existing
  if (bothOriginAreNotFromMainGrid) {
    gridNum = Math.min(awayDependent?.gridNum, homeDependent?.gridNum);
    const dependentRoundMax = Math.max(
      Math.abs(awayDependent.round),
      Math.abs(homeDependent.round)
    );
    const dependentRound =
      awayDependent.round < 0 ? -dependentRoundMax : dependentRoundMax;
    awayDependent = {
      ...awayDependent,
      round: dependentRound,
      gridNum,
    };
    homeDependent = {
      ...homeDependent,
      round: dependentRound,
      gridNum,
    };
  }

  const newBracketGame: IBracketGame = {
    id: getVarcharEight(),
    index: divisionGames.length + 1,
    round,
    gridNum,
    divisionId,
    divisionName: divisionGames[0].divisionName,
    awaySeedId: undefined,
    homeSeedId: undefined,
    awayTeamId: undefined,
    homeTeamId: undefined,
    awayDisplayName: 'Away',
    homeDisplayName: 'Home',
    awayDependsUpon,
    homeDependsUpon,
    fieldId: undefined,
    fieldName: undefined,
    startTime: undefined,
    gameDate: divisionGames[0].gameDate,
    hidden: false,
    createDate: new Date().toISOString(),
  };

  const newBracketGames = bracketGames.map(item => {
    if (item.id === awayDependent.id) return awayDependent;
    if (item.id === homeDependent.id) return homeDependent;
    return item;
  });

  newBracketGames.push(newBracketGame);

  return newBracketGames;
};

/* Get games indices that depend upon the given BracketGame */
const getDependentGames = (
  dependentInds: number[],
  games: IBracketGame[]
): number[] => {
  const foundGames = games.filter(
    item =>
      dependentInds.includes(item.awayDependsUpon!) ||
      dependentInds.includes(item.homeDependsUpon!)
  );

  const foundGamesInds = foundGames.map(item => item.index);
  const newDependentInds = [...dependentInds, ...foundGamesInds];

  const newGames = games.filter(item => !foundGamesInds.includes(item.index));

  if (!foundGamesInds?.length || !newGames?.length) {
    return union(newDependentInds);
  }

  return getDependentGames(newDependentInds, newGames);
};

/* Get games indices that the given BracketGame depends on */
const getGameDependsUpon = (
  dependentInds: number[],
  games: IBracketGame[]
): number[] => {
  const myGamesDependsUpon = games
    .filter(item => dependentInds.includes(item.index))
    .map(item => [item.awayDependsUpon, item.homeDependsUpon])
    .flat();

  const newDependentInds: number[] = [
    ...dependentInds,
    ...myGamesDependsUpon,
  ].filter(v => v) as number[];

  const newGames = games.filter(item => !dependentInds.includes(item.index));

  if (!myGamesDependsUpon.filter(v => v).length || !newGames.length) {
    return union(newDependentInds);
  }

  return getGameDependsUpon(newDependentInds, newGames);
};

export const removeGameFromBracketGames = (
  gameIndex: number,
  games: IBracketGame[],
  divisionId: string
) => {
  const dependentInds = [gameIndex];
  const divisionGames = games.filter(item => item.divisionId === divisionId);

  const newFound = getDependentGames(dependentInds, divisionGames);

  const removedGames = games
    .filter(
      item => item.divisionId === divisionId && newFound.includes(item.index)
    )
    .map(item => ({ ...item, hidden: true }));

  const updatedDivisionGames = games
    .filter(
      item => item.divisionId === divisionId && !newFound.includes(item.index)
    )
    .map((item, index) => ({ ...item, index: index + 1 }));

  const otherGames = games.filter(item => item.divisionId !== divisionId);

  const allGames = orderBy(
    [...otherGames, ...updatedDivisionGames],
    'divisionId'
  );

  const resultGames: IBracketGame[] = [...allGames, ...removedGames];
  return resultGames;
};

export const updateGameSlot = (
  game: IGame,
  bracketGame?: IBracketGame,
  divisions?: IDivision[]
): IGame => ({
  ...game,
  bracketGameId: bracketGame?.id,
  awaySeedId: bracketGame?.awaySeedId,
  homeSeedId: bracketGame?.homeSeedId,
  awayDisplayName: bracketGame?.awayDisplayName,
  homeDisplayName: bracketGame?.homeDisplayName,
  awayDependsUpon: bracketGame?.awayDependsUpon,
  homeDependsUpon: bracketGame?.homeDependsUpon,
  divisionId: bracketGame?.divisionId,
  divisionName: bracketGame?.divisionName,
  divisionHex: divisions?.find(v => v.division_id === bracketGame?.divisionId)
    ?.division_hex,
  playoffRound: bracketGame?.round,
  playoffIndex: bracketGame?.index,
});

enum BracketMoveWarnEnum {
  gameAlreadyAssigned = 'This bracket game is already assigned. Please confirm your intentions.',
  gamePlayTimeInvalid = 'This bracket game cannot be placed at this time.',
  facilitiesDiffer = 'This division is not playing at this facility on this day. Please confirm your intentions.',
}

export const setReplacementMessage = (
  bracketGames: IBracketGame[],
  warnings: IBracketMoveWarning
): {
  bracketGames?: IBracketGame[];
  message?: string;
} | null => {
  switch (true) {
    case warnings.gamePlayTimeInvalid:
      return {
        message: BracketMoveWarnEnum.gamePlayTimeInvalid,
      };
    case warnings.gameAlreadyAssigned:
      return {
        bracketGames,
        message: BracketMoveWarnEnum.gameAlreadyAssigned,
      };
    case warnings.facilitiesDiffer:
      return {
        bracketGames,
        message: BracketMoveWarnEnum.facilitiesDiffer,
      };
    default:
      return null;
  }
};

export const updateBracketGame = (
  bracketGame: IBracketGame,
  gameSlot?: IGame,
  fieldName?: string
) => ({
  ...bracketGame,
  fieldId: gameSlot?.fieldId,
  fieldName: fieldName || 'Empty',
  startTime: gameSlot?.startTime,
  gameDate: gameSlot?.gameDate,
});

export const updateBracketGamesDndResult = (
  gameId: string,
  slotId: number,
  bracketGames: IBracketGame[],
  games: IGame[],
  fields: IField[]
) => {
  const warnings: IBracketMoveWarning = {
    gameAlreadyAssigned: false,
    gamePlayTimeInvalid: false,
    facilitiesDiffer: false,
  };
  /* 1. Find a bracket game that is being dragged */
  const bracketGame = bracketGames.find(item => item.id === gameId);
  /* 2. Find a game slot where the bracket game is gonna be placed */
  const gameSlot = games.find(item => item.id === slotId);
  /* 3. Check if the bracket game is not placed anywhere else */
  /*  3.1. If so - return a warning popup */
  /* 4. Populate the bracket data with the game slot data */
  const fieldName = fields.find(item => item.field_id === gameSlot?.fieldId)
    ?.field_name;

  bracketGames = bracketGames.map(item =>
    /* First - unassign existing bracket game */
    /* Then - assign our bracket game to that place */
    item.fieldId === gameSlot?.fieldId && item.startTime === gameSlot?.startTime
      ? updateBracketGame(item)
      : item.id === bracketGame?.id
      ? updateBracketGame(item, gameSlot, fieldName)
      : item
  );

  /* WARNINGS SETUP */
  /* Check assignment for the given BracketGame */
  const bracketGameToUpdate = bracketGames.find(
    item => item.id === bracketGame?.id
  );

  warnings.gameAlreadyAssigned = Boolean(
    bracketGame?.fieldId &&
      bracketGame?.startTime &&
      bracketGameToUpdate?.fieldId &&
      bracketGameToUpdate.startTime
  );

  /* Check play time for the given BracketGame */
  const divisionGames = [...bracketGames].filter(
    item => item.divisionId === bracketGame?.divisionId
  );

  const dependentInds = getDependentGames(
    [bracketGame?.index || -1],
    divisionGames
  );

  const gameDependsUpon = getGameDependsUpon(
    [bracketGame?.index || -1],
    divisionGames
  );

  const nextDependentStartTimes = divisionGames
    .filter(item => item.index !== bracketGame?.index)
    .filter(item => dependentInds.includes(item.index))
    .map(item => item.startTime);

  const previousDependentStartTimes = divisionGames
    .filter(item => item.index !== bracketGame?.index)
    .filter(item => gameDependsUpon.includes(item.index))
    .map(item => item.startTime);

  const minStartTimeAvailable = min(nextDependentStartTimes);
  const maxStartTimeAvailable = max(previousDependentStartTimes);

  const bracketNewTime = divisionGames.find(
    item => item.index === bracketGame?.index
  )?.startTime;

  warnings.gamePlayTimeInvalid =
    !!bracketNewTime &&
    (!!(minStartTimeAvailable && bracketNewTime >= minStartTimeAvailable) ||
      !!(maxStartTimeAvailable && bracketNewTime <= maxStartTimeAvailable));

  /* Check for Facilities consistency for the given BracketGame */
  const divisionGamesFacilitiesIds = games
    .filter(item => divisionGames.some(dg => dg.id === item.bracketGameId))
    .map(item => item.facilityId);

  warnings.facilitiesDiffer = Boolean(
    gameSlot && !divisionGamesFacilitiesIds.includes(gameSlot.facilityId)
  );

  return { bracketGames, warnings };
};
