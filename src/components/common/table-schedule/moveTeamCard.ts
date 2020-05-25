import { findIndex, find } from 'lodash-es';
import { ITeamCard } from 'common/models/schedule/teams';
import { IDropParams } from '../matrix-table/dnd/drop';
import { IGame } from '../matrix-table/helper';

export default (
  teamCards: ITeamCard[],
  filledGames: IGame[],
  dropParams: IDropParams,
  day?: string
) => {
  const { teamId, position, gameId, originGameId, originGameDate } = dropParams;
  let result = {
    teamCards: [...teamCards],
    divisionUnmatch: false,
    poolUnmatch: false,
    timeSlotInUse: false,
    differentFacility: false,
    playoffSlot: false,
  };

  const newTeamCards = [...teamCards].map(teamCard => {
    const incomingTeam = find(teamCards, { id: teamId });
    const outcomingTeam = find(
      teamCards,
      ({ games }) =>
        findIndex(games, {
          id: gameId,
          teamPosition: position,
          date: day,
        }) >= 0
    );
    const incomingTeamFiltered = {
      ...incomingTeam,
      games: [...incomingTeam?.games?.filter(item => item.id !== originGameId)],
    };

    const gamePlace = filledGames.find(item => item.id === gameId);
    const incomingTeamGames = filledGames.filter(
      item =>
        findIndex(incomingTeamFiltered.games, { id: item.id, date: day }) >= 0
    );

    const timeSlot = gamePlace?.timeSlotId;
    const facility = gamePlace?.facilityId;

    const teamTimeSlots = incomingTeamGames.map(item => item.timeSlotId);
    const teamFacilities = incomingTeamGames.map(item => item.facilityId);

    if (gamePlace?.isPlayoff) {
      result = {
        ...result,
        playoffSlot: true,
      };
    }

    /* When a team placed in used timeslot */
    if (gameId && position && teamTimeSlots.includes(timeSlot!)) {
      result = {
        ...result,
        timeSlotInUse: true,
      };
    }

    /* When a team is placed in another facility */
    if (
      gameId &&
      position &&
      teamFacilities.length &&
      !teamFacilities.includes(facility)
    ) {
      result = {
        ...result,
        differentFacility: true,
      };
    }

    /* When divisions do not match */
    if (
      incomingTeam !== undefined &&
      outcomingTeam !== undefined &&
      incomingTeam.divisionId !== outcomingTeam.divisionId
    ) {
      result = {
        ...result,
        divisionUnmatch: true,
      };
    }

    /* When pools do not match */
    if (
      incomingTeam !== undefined &&
      outcomingTeam !== undefined &&
      incomingTeam.poolId !== outcomingTeam.poolId
    ) {
      result = {
        ...result,
        poolUnmatch: true,
      };
    }

    /* 1. Handle dropping inside the table */
    if (gameId && position && teamId === teamCard.id) {
      let games = [
        ...teamCard.games?.filter(
          item => item.id !== originGameId || item.date !== originGameDate
        ),
        {
          id: gameId,
          teamPosition: position,
          isTeamLocked: false,
          date: day,
        },
      ];

      if (
        findIndex(teamCard.games, {
          id: gameId,
          teamPosition: position === 1 ? 2 : 1,
          date: day,
        }) >= 0
      ) {
        games = [
          ...games.filter(
            item =>
              item.id !== gameId ||
              item.teamPosition !== (position === 1 ? 2 : 1) ||
              item.date !== day
          ),
        ];
      }

      return {
        ...teamCard,
        games,
      };
    }

    /* 2. Handle dropping into the Unassigned table */
    if (!gameId && !position && teamId === teamCard.id) {
      const games = [
        ...teamCard.games?.filter(
          item => item.id !== originGameId || item.date !== originGameDate
        ),
      ];
      return {
        ...teamCard,
        games,
      };
    }

    /* 3. Remove replaced team game */
    if (
      findIndex(teamCard.games, {
        id: gameId,
        teamPosition: position,
        date: day,
      }) >= 0
    ) {
      const games = [
        ...teamCard.games?.filter(
          item =>
            item.id !== gameId ||
            item.teamPosition !== position ||
            item.date !== day
        ),
      ];
      return {
        ...teamCard,
        games,
      };
    }

    return teamCard;
  });

  result = {
    ...result,
    teamCards: [...newTeamCards],
  };

  return result;
};
