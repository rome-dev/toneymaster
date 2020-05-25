import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ListUnassigned from './components/list-unassigned';
import Filter from './components/filter';
import DivisionHeatmap from './components/division-heatmap';
import TableActions from './components/table-actions';
import PopupSaveReporting from './components/popup-save-reporting';
import { MatrixTable, CardMessage } from 'components/common';
import {
  IDivision,
  IEventSummary,
  IEventDetails,
  ISchedule,
  IPool,
  BindingAction,
} from 'common/models';
import { IScheduleFilter, OptimizeTypes } from './types';
import { getAllTeamCardGames, calculateTournamentDays } from 'helpers';
import {
  IGame,
  settleTeamsPerGames,
  calculateDays,
} from '../matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import PopupConfirm from 'components/common/popup-confirm';
import styles from './styles.module.scss';

import {
  mapGamesByFilter,
  mapFilterValues,
  applyFilters,
  mapUnusedFields,
  moveCardMessages,
  getScheduleWarning,
} from './helpers';

import { IScheduleFacility } from 'common/models/schedule/facilities';
import { ITeamCard } from 'common/models/schedule/teams';
import { IDropParams } from '../matrix-table/dnd/drop';
import moveTeamCard from './moveTeamCard';
import { Button } from 'components/common';
import { TableScheduleTypes } from 'common/enums';
import { CardMessageTypes } from '../card-message/types';
import TeamsDiagnostics from 'components/schedules/diagnostics/teamsDiagnostics';
import DivisionsDiagnostics from 'components/schedules/diagnostics/divisionsDiagnostics';
import { IDiagnosticsInput } from 'components/schedules/diagnostics';
import { populateDefinedGamesWithPlayoffState } from 'components/schedules/definePlayoffs';

interface Props {
  tableType: TableScheduleTypes;
  event: IEventDetails;
  divisions: IDivision[];
  pools: IPool[];
  teamCards: ITeamCard[];
  games: IGame[];
  fields: IField[];
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
  scheduleData: ISchedule;
  eventSummary: IEventSummary[];
  isEnterScores?: boolean;
  historyLength?: number;
  teamsDiagnostics?: IDiagnosticsInput;
  divisionsDiagnostics?: IDiagnosticsInput;
  isFullScreen?: boolean;
  onTeamCardsUpdate: (teamCard: ITeamCard[]) => void;
  onTeamCardUpdate: (teamCard: ITeamCard) => void;
  onUndo: () => void;
  onToggleFullScreen?: BindingAction;
  playoffTimeSlots?: ITimeSlot[];
}

const TableSchedule = ({
  tableType,
  event,
  divisions,
  pools,
  teamCards,
  games,
  fields,
  facilities,
  scheduleData,
  timeSlots,
  eventSummary,
  isEnterScores,
  onTeamCardsUpdate,
  onTeamCardUpdate,
  onUndo,
  historyLength,
  teamsDiagnostics,
  divisionsDiagnostics,
  isFullScreen,
  onToggleFullScreen,
  playoffTimeSlots,
}: Props) => {
  const minGamesNum = event.min_num_of_games;

  const [filterValues, changeFilterValues] = useState<IScheduleFilter>(
    applyFilters({ divisions, pools, teamCards, eventSummary })
  );

  const [optimizeBy, onOptimizeClick] = useState<OptimizeTypes>(
    OptimizeTypes.MIN_RANK
  );

  const [zoomingDisabled, changeZoomingAction] = useState(false);

  const [showHeatmap, onHeatmapChange] = useState(true);

  const [replacementTeamCards, replacementTeamCardsChange] = useState<
    ITeamCard[] | undefined
  >();
  const [replacementWarning, onReplacementWarningChange] = useState<
    string | undefined
  >();
  const [days, setDays] = useState(calculateDays(teamCards));

  const manageGamesData = useCallback(() => {
    let definedGames = [...games];
    const day = filterValues.selectedDay!;

    if (+day === days.length && playoffTimeSlots) {
      definedGames = populateDefinedGamesWithPlayoffState(
        games,
        playoffTimeSlots
      );
    }

    const filledGames = settleTeamsPerGames(
      definedGames,
      teamCards,
      days,
      filterValues.selectedDay!
    );
    const filteredGames = mapGamesByFilter([...filledGames], filterValues);
    return filteredGames;
  }, [games, teamCards, days, filterValues, playoffTimeSlots]);

  const [tableGames, setTableGames] = useState<IGame[]>(manageGamesData());

  useEffect(() => {
    const newDays = calculateTournamentDays(event);
    setDays(newDays);
  }, [event]);

  useEffect(() => setTableGames(manageGamesData()), [manageGamesData]);

  const updatedFields = mapUnusedFields(fields, tableGames, filterValues);

  const onFilterChange = (data: IScheduleFilter) => {
    const newData = mapFilterValues({ teamCards, pools }, data);
    changeFilterValues({ ...newData });
  };

  const toggleZooming = () => changeZoomingAction(!zoomingDisabled);

  const moveCard = (dropParams: IDropParams) => {
    const day = filterValues.selectedDay!;
    const result = moveTeamCard(
      teamCards,
      tableGames,
      dropParams,
      days?.length ? days[+day - 1] : undefined
    );

    switch (true) {
      case result.playoffSlot:
        return onReplacementWarningChange(moveCardMessages.playoffSlot);
      case result.timeSlotInUse:
        return onReplacementWarningChange(moveCardMessages.timeSlotInUse);
      case result.differentFacility: {
        onReplacementWarningChange(moveCardMessages.differentFacility);
        return replacementTeamCardsChange(result.teamCards);
      }
      case result.divisionUnmatch: {
        onReplacementWarningChange(moveCardMessages.divisionUnmatch);
        return replacementTeamCardsChange(result.teamCards);
      }
      case result.poolUnmatch: {
        onReplacementWarningChange(moveCardMessages.poolUnmatch);
        return replacementTeamCardsChange(result.teamCards);
      }
      default:
        onTeamCardsUpdate(result.teamCards);
    }
  };

  const toggleReplacementWarning = () => {
    replacementTeamCardsChange(undefined);
    onReplacementWarningChange(undefined);
  };

  const confirmReplacement = () => {
    if (replacementTeamCards) {
      onTeamCardsUpdate(replacementTeamCards);
      toggleReplacementWarning();
    }
  };

  const onLockAll = () => {
    const lockedTeams = teamCards.map(team => ({
      ...team,
      games: team!.games?.map(game => ({ ...game, isTeamLocked: true })),
    }));
    onTeamCardsUpdate(lockedTeams);
  };

  const onUnlockAll = () => {
    const unLockedTeams = teamCards.map(team => ({
      ...team,
      games: team!.games?.map(game => ({ ...game, isTeamLocked: false })),
    }));
    onTeamCardsUpdate(unLockedTeams);
  };
  const [isPopupSaveReportOpen, onPopupSaveReport] = useState<boolean>(false);

  const togglePopupSaveReport = () => onPopupSaveReport(!isPopupSaveReportOpen);

  const allTeamCardGames = getAllTeamCardGames(teamCards, games, days);

  const warnings =
    tableType === TableScheduleTypes.SCORES
      ? undefined
      : getScheduleWarning(scheduleData, event, teamCards, teamsDiagnostics!);

  return (
    <section className={styles.section}>
      <h2 className="visually-hidden">Schedule table</h2>
      <div className={styles.scheduleTableWrapper}>
        {tableType === TableScheduleTypes.SCHEDULES && (
          <div className={styles.topAreaWrapper}>
            <div className={styles.topBtnsWrapper}>
              <h3>Mode:</h3>
              <Button
                label="Zoom-n-Nav"
                variant="contained"
                color="primary"
                type={zoomingDisabled ? 'squaredOutlined' : 'squared'}
                onClick={toggleZooming}
              />
              <Button
                label="Drag-n-Drop"
                variant="contained"
                color="primary"
                type={zoomingDisabled ? 'squared' : 'squaredOutlined'}
                onClick={toggleZooming}
              />
            </div>
            <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
              Zoom-n-Nav to navigate the schedule. Drag-n-Drop to move teams
              within games.
            </CardMessage>
            {teamsDiagnostics && divisionsDiagnostics && (
              <div className={styles.diagnosticsWrapper}>
                Diagnostics:
                <TeamsDiagnostics teamsDiagnostics={teamsDiagnostics} />
                <DivisionsDiagnostics
                  divisionsDiagnostics={divisionsDiagnostics}
                />
              </div>
            )}
          </div>
        )}
        <DndProvider backend={HTML5Backend}>
          {tableType === TableScheduleTypes.SCHEDULES && (
            <ListUnassigned
              pools={pools}
              tableType={tableType}
              teamCards={teamCards}
              minGamesNum={minGamesNum}
              showHeatmap={showHeatmap}
              onDrop={moveCard}
            />
          )}
          <div className={styles.tableWrapper}>
            <Filter
              warnings={warnings}
              days={days.length}
              filterValues={filterValues}
              onChangeFilterValue={onFilterChange}
            />
            <MatrixTable
              tableType={tableType}
              games={tableGames}
              fields={updatedFields}
              timeSlots={timeSlots}
              facilities={facilities}
              showHeatmap={showHeatmap}
              isEnterScores={isEnterScores}
              moveCard={moveCard}
              disableZooming={zoomingDisabled}
              onTeamCardUpdate={onTeamCardUpdate}
              onTeamCardsUpdate={onTeamCardsUpdate}
              teamCards={teamCards}
              isFullScreen={isFullScreen}
              onToggleFullScreen={onToggleFullScreen}
            />
          </div>
        </DndProvider>
      </div>
      <DivisionHeatmap
        divisions={divisions}
        showHeatmap={showHeatmap}
        onHeatmapChange={onHeatmapChange}
      />
      <>
        {tableType === TableScheduleTypes.SCHEDULES && (
          <>
            <TableActions
              historyLength={historyLength}
              zoomingDisabled={zoomingDisabled}
              toggleZooming={toggleZooming}
              optimizeBy={optimizeBy}
              onUndoClick={onUndo}
              onLockAllClick={onLockAll}
              onUnlockAllClick={onUnlockAll}
              onOptimizeClick={onOptimizeClick}
              togglePopupSaveReport={togglePopupSaveReport}
            />
            <PopupSaveReporting
              event={event}
              games={allTeamCardGames}
              fields={updatedFields}
              timeSlots={timeSlots}
              facilities={facilities}
              schedule={scheduleData}
              eventDays={days}
              isOpen={isPopupSaveReportOpen}
              onClose={togglePopupSaveReport}
            />
          </>
        )}
        <PopupConfirm
          type="warning"
          showYes={!!replacementTeamCards}
          isOpen={!!replacementWarning}
          message={replacementWarning || ''}
          onClose={toggleReplacementWarning}
          onCanceClick={toggleReplacementWarning}
          onYesClick={confirmReplacement}
        />
      </>
    </section>
  );
};

export default TableSchedule;
