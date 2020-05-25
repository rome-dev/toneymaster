import React from 'react';
import DropContainer, { IDropParams, MatrixTableDropEnum } from '../dnd/drop';
import TeamDragCard from '../dnd/drag';
import SeedCard from '../dnd/seed';
import styles from '../styles.module.scss';
import { IGame } from '../helper';
import { ITeamCard } from 'common/models/schedule/teams';
import { TableScheduleTypes } from 'common/enums';

interface Props {
  tableType: TableScheduleTypes;
  game: IGame;
  showHeatmap?: boolean;
  onDrop: (dropParams: IDropParams) => void;
  onTeamCardUpdate: (teamCard: ITeamCard) => void;
  isDndMode: boolean;
  isEnterScores?: boolean;
  teamCards: ITeamCard[];
  highlightedGamedId?: number;
}

const RenderGameSlot = (props: Props) => {
  const {
    tableType,
    game,
    onDrop,
    showHeatmap,
    onTeamCardUpdate,
    isDndMode,
    isEnterScores,
    teamCards,
    highlightedGamedId,
  } = props;

  const {
    id,
    awayTeam,
    homeTeam,
    gameDate,
    isPlayoff,
    awaySeedId,
    homeSeedId,
    playoffRound,
    divisionName,
    divisionHex,
    awayDependsUpon,
    homeDependsUpon,
    bracketGameId,
    divisionId,
    playoffIndex,
  } = game;

  const acceptType = [MatrixTableDropEnum.TeamDrop];

  if (isPlayoff) {
    acceptType.push(MatrixTableDropEnum.BracketDrop);
  }

  return (
    <td
      className={`${styles.gameSlotContainer} ${isPlayoff &&
        styles.gameSlotPlayoff}`}
    >
      <div
        className={`${styles.gameSlot} ${highlightedGamedId === game.id &&
          styles.highlighted}`}
      >
        <DropContainer
          acceptType={acceptType}
          gameId={game.id}
          position={1}
          onDrop={onDrop}
          teamCards={teamCards}
        >
          <>
            {awayTeam && (
              <TeamDragCard
                tableType={tableType}
                type={MatrixTableDropEnum.TeamDrop}
                originGameId={game.id}
                originGameDate={gameDate}
                showHeatmap={showHeatmap}
                teamCard={awayTeam}
                onTeamCardUpdate={onTeamCardUpdate}
                isDndMode={isDndMode}
                isEnterScores={isEnterScores}
              />
            )}
            {(awaySeedId || awayDependsUpon) && bracketGameId && (
              <SeedCard
                type={MatrixTableDropEnum.BracketDrop}
                position={1}
                round={playoffRound}
                showHeatmap={true}
                seedId={awaySeedId}
                dependsUpon={awayDependsUpon}
                divisionHex={divisionHex}
                divisionName={divisionName}
                slotId={id}
                bracketGameId={bracketGameId}
                divisionId={divisionId!}
                playoffIndex={playoffIndex!}
              />
            )}
          </>
        </DropContainer>
        <DropContainer
          acceptType={acceptType}
          gameId={game.id}
          position={2}
          onDrop={onDrop}
          teamCards={teamCards}
        >
          <>
            {homeTeam && (
              <TeamDragCard
                tableType={tableType}
                type={MatrixTableDropEnum.TeamDrop}
                originGameId={game.id}
                originGameDate={gameDate}
                showHeatmap={showHeatmap}
                teamCard={homeTeam}
                onTeamCardUpdate={onTeamCardUpdate}
                isDndMode={isDndMode}
                isEnterScores={isEnterScores}
              />
            )}
            {(homeSeedId || homeDependsUpon) && bracketGameId && (
              <SeedCard
                type={MatrixTableDropEnum.BracketDrop}
                position={2}
                round={playoffRound}
                dependsUpon={homeDependsUpon}
                showHeatmap={true}
                seedId={homeSeedId}
                divisionHex={divisionHex}
                divisionName={divisionName}
                slotId={id}
                bracketGameId={bracketGameId}
                divisionId={divisionId!}
                playoffIndex={playoffIndex!}
              />
            )}
          </>
        </DropContainer>
      </div>
    </td>
  );
};

export default RenderGameSlot;
