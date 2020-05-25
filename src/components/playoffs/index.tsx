import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import moment from 'moment';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { History } from 'history';
import { find } from 'lodash-es';
import { Button, Paper, PopupExposure, PopupConfirm } from 'components/common';
import styles from './styles.module.scss';
import BracketManager from './tabs/brackets';
import ResourceMatrix from './tabs/resources';
import { fetchSchedulesDetails } from 'components/schedules/logic/actions';
import { getAllPools } from 'components/divisions-and-pools/logic/actions';
import { IAppState } from 'reducers/root-reducer.types';
import { ITournamentData } from 'common/models/tournament';
import {
  IEventSummary,
  ISchedule,
  IPool,
  ISchedulesDetails,
} from 'common/models';
import { fetchEventSummary } from 'components/schedules/logic/actions';
import {
  fillSchedulesTable,
  clearSchedulesTable,
} from 'components/schedules/logic/schedules-table/actions';
import { IBracket } from 'common/models/playoffs/bracket';
import { getTimeValuesFromEventSchedule, calculateTimeSlots } from 'helpers';
import {
  sortFieldsByPremier,
  defineGames,
  IGame,
  settleTeamsPerGamesDays,
} from 'components/common/matrix-table/helper';
import {
  mapFieldsData,
  mapTeamsData,
  mapFacilitiesData,
} from 'components/schedules/mapTournamentData';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { mapTeamsFromSchedulesDetails } from 'components/schedules/mapScheduleData';
import { ITeamCard, ITeam } from 'common/models/schedule/teams';
import { IField } from 'common/models/schedule/fields';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import {
  IBracketGame,
  IBracketSeed,
  getFacilityData,
  populateBracketGamesWithData,
  populatePlayoffGames,
  createSeeds,
  createBracketGames,
} from './bracketGames';
import {
  populateDefinedGamesWithPlayoffState,
  adjustPlayoffTimeOnLoad,
} from 'components/schedules/definePlayoffs';
import {
  createPlayoff,
  savePlayoff,
  retrieveBracketsGames,
  retrieveBrackets,
  clearBracketGames,
  fetchBracketGames,
  onUndoBrackets,
} from './logic/actions';
import {
  addGameToExistingBracketGames,
  removeGameFromBracketGames,
  updateBracketGamesDndResult,
  updateGameSlot,
  setReplacementMessage,
} from './helper';
import { IOnAddGame } from './add-game-modal';

interface IMapStateToProps extends Partial<ITournamentData> {
  eventSummary?: IEventSummary[];
  bracket: IBracket | null;
  schedule?: ISchedule;
  pools?: IPool[];
  schedulesTeamCards?: ITeamCard[];
  schedulesDetails?: ISchedulesDetails[];
  playoffSaved?: boolean;
  bracketGames: IBracketGame[] | null;
  historyLength: number;
}

interface IMapDispatchToProps {
  fetchEventSummary: (eventId: string) => void;
  fetchSchedulesDetails: (scheduleId: string) => void;
  getAllPools: (divisionIds: string[]) => void;
  fillSchedulesTable: (teamCards: ITeamCard[]) => void;
  clearSchedulesTable: () => void;
  createPlayoff: (bracketGames: IBracketGame[]) => void;
  savePlayoff: (bracketGames: IBracketGame[]) => void;
  retrieveBracketsGames: (bracketId: string) => void;
  retrieveBrackets: (bracketId: string) => void;
  clearBracketGames: () => void;
  fetchBracketGames: (bracketGames: IBracketGame[]) => void;
  onBracketsUndo: () => void;
}

interface IProps extends IMapStateToProps, IMapDispatchToProps {
  match: any;
  history: History;
}

interface IState {
  activeTab: PlayoffsTabsEnum;
  games?: IGame[];
  teams?: ITeam[];
  timeSlots?: ITimeSlot[];
  fields?: IField[];
  facilities?: IScheduleFacility[];
  bracketGames?: IBracketGame[];
  bracketSeeds?: IBracketSeed[];
  playoffTimeSlots?: ITimeSlot[];
  tableGames?: IGame[];
  cancelConfirmationOpen: boolean;
  highlightedGameId?: number;
  replacementBracketGames?: IBracketGame[];
  replacementMessage?: string;
}

enum PlayoffsTabsEnum {
  ResourceMatrix = 1,
  BracketManager = 2,
}

class Playoffs extends Component<IProps> {
  state: IState = {
    activeTab: PlayoffsTabsEnum.ResourceMatrix,
    cancelConfirmationOpen: false,
    highlightedGameId: undefined,
  };

  async componentDidMount() {
    const { event, match } = this.props;
    const eventId = event?.event_id!;
    const { scheduleId, bracketId } = match.params;

    this.props.clearBracketGames();
    this.props.clearSchedulesTable();
    this.props.fetchEventSummary(eventId);
    this.props.fetchSchedulesDetails(scheduleId);

    if (bracketId) {
      this.retrieveBracketsData();
    }
  }

  componentDidUpdate(prevProps: IProps) {
    const {
      schedulesDetails,
      schedulesTeamCards,
      match,
      historyLength,
    } = this.props;
    const { teams } = this.state;
    const { bracketId } = match.params;

    if (!schedulesTeamCards && schedulesDetails && teams) {
      const mappedTeams = mapTeamsFromSchedulesDetails(schedulesDetails, teams);
      this.props.fillSchedulesTable(mappedTeams);
    }

    if (!this.state.games) {
      this.calculateNeccessaryData();
    }

    if (!this.state.playoffTimeSlots) {
      this.calculatePlayoffTimeSlots();
    }

    if (
      (bracketId || historyLength) &&
      (!this.state.tableGames ||
        prevProps.bracketGames !== this.props.bracketGames)
    ) {
      this.populateBracketGamesData();
    }

    if (!bracketId && !this.state.tableGames) {
      this.calculateBracketGames();
    }

    if (this.props.playoffSaved && !prevProps.playoffSaved) {
      this.updateUrlWithBracketId();
    }
  }

  updateUrlWithBracketId = () => {
    const { match, bracket } = this.props;
    const { eventId, scheduleId } = match.params;
    const bracketId = bracket?.id;
    this.props.history.push(`/playoffs/${eventId}/${scheduleId}/${bracketId}`);
  };

  calculateNeccessaryData = () => {
    const {
      event,
      schedule,
      fields,
      teams,
      divisions,
      facilities,
    } = this.props;

    if (!event || !schedule || !fields || !teams || !divisions || !facilities)
      return;

    const timeValues = getTimeValuesFromEventSchedule(event, schedule);
    const timeSlots = calculateTimeSlots(timeValues);

    const mappedFields = mapFieldsData(fields, facilities);
    const sortedFields = sortFieldsByPremier(mappedFields);

    const { games } = defineGames(sortedFields, timeSlots!);
    const mappedTeams = mapTeamsData(teams, divisions);

    const mappedFacilities = mapFacilitiesData(facilities);

    this.setState({
      games,
      timeSlots,
      fields: sortedFields,
      teams: mappedTeams,
      facilities: mappedFacilities,
    });
  };

  retrieveBracketsData = () => {
    const { match } = this.props;
    const { bracketId } = match.params;
    this.props.retrieveBracketsGames(bracketId);
    this.props.retrieveBrackets(bracketId);
  };

  calculatePlayoffTimeSlots = () => {
    const { schedulesDetails, divisions, event } = this.props;
    const { timeSlots, fields } = this.state;

    const day = event?.event_enddate;

    if (
      !schedulesDetails ||
      !fields ||
      !timeSlots ||
      !divisions ||
      !event ||
      !day
    )
      return;

    const playoffTimeSlots = adjustPlayoffTimeOnLoad(
      schedulesDetails,
      fields,
      timeSlots,
      divisions,
      event,
      day
    );

    if (playoffTimeSlots) {
      this.setState({ playoffTimeSlots });
    }
  };

  /* CALCULATE BRACKET GAMES */
  calculateBracketGames = () => {
    const { event, divisions, schedulesTeamCards, fields } = this.props;
    const { games, playoffTimeSlots } = this.state;
    const gameDate = moment(event?.event_enddate).toISOString();

    if (
      !divisions ||
      !games ||
      !playoffTimeSlots ||
      !schedulesTeamCards ||
      !fields
    )
      return;

    const bracketTeamsNum = event?.num_teams_bracket || 0;
    const bracketGames = createBracketGames(divisions, bracketTeamsNum);

    const definedGames = populateDefinedGamesWithPlayoffState(
      games,
      playoffTimeSlots
    );

    const facilityData = getFacilityData(schedulesTeamCards, games);
    const mergedGames = populatePlayoffGames(
      definedGames,
      bracketGames,
      divisions,
      facilityData
    );

    const populatedBracketGames = populateBracketGamesWithData(
      bracketGames,
      mergedGames,
      fields,
      gameDate
    );

    this.mapBracketGamesIntoTableGames(mergedGames);
    this.props.fetchBracketGames(populatedBracketGames);
  };

  /* PUT BRACKET GAMES INTO GAMES */
  populateBracketGamesData = () => {
    const { bracketGames, divisions } = this.props;
    const { games, playoffTimeSlots } = this.state;

    if (!games || !playoffTimeSlots || !divisions) return;

    const definedGames = populateDefinedGamesWithPlayoffState(
      games,
      playoffTimeSlots
    );

    const updatedGames = definedGames.map(item => {
      const foundBracketGame = find(bracketGames, {
        fieldId: item.fieldId,
        startTime: item.startTime,
      });

      return foundBracketGame
        ? updateGameSlot(item, foundBracketGame, divisions)
        : item;
    });

    this.mapBracketGamesIntoTableGames(updatedGames);
  };

  /* MAP TABLE GAMES DATA */
  mapBracketGamesIntoTableGames = (mergedGames: IGame[]) => {
    const { schedulesTeamCards, event } = this.props;
    const gameDate = moment(event?.event_enddate).toISOString();
    const bracketTeamsNum = event?.num_teams_bracket || 0;

    if (!schedulesTeamCards) return;

    const tableGames = settleTeamsPerGamesDays(
      mergedGames,
      schedulesTeamCards,
      gameDate
    );

    const bracketSeeds = createSeeds(bracketTeamsNum);
    this.setState({ tableGames, bracketSeeds });
  };

  updateMergedGames = (gameId: string, slotId: number) => {
    const { bracketGames, fields } = this.props;
    const { tableGames } = this.state;

    if (!bracketGames || !tableGames || !fields)
      return console.error('Error happened during a dnd process.');

    const updatedResult = updateBracketGamesDndResult(
      gameId,
      slotId,
      bracketGames,
      tableGames,
      fields
    );

    const warningResult = setReplacementMessage(
      updatedResult.bracketGames,
      updatedResult.warnings
    );

    if (warningResult) {
      return this.setState({
        replacementBracketGames: warningResult.bracketGames,
        replacementMessage: warningResult.message,
      });
    }

    this.props.fetchBracketGames(updatedResult.bracketGames);
  };

  openCancelConfirmation = () =>
    this.setState({ cancelConfirmationOpen: true });

  closeCancelConfirmation = () =>
    this.setState({ cancelConfirmationOpen: false });

  onGoBack = () => {
    const { historyLength } = this.props;

    if (historyLength) {
      this.openCancelConfirmation();
    } else {
      this.onExit();
    }
  };

  onExit = () => {
    const { eventId } = this.props.match.params;
    this.props.history.push(`/event/scheduling/${eventId}`);
  };

  addGame = (selectedDivision: string, data: IOnAddGame) => {
    const { bracketGames } = this.props;

    if (!bracketGames?.length) return;

    const newBracketGames = addGameToExistingBracketGames(
      data,
      bracketGames,
      selectedDivision
    );

    this.props.fetchBracketGames(newBracketGames);
  };

  removeGame = (selectedDivision: string, gameIndex: number) => {
    const { bracketGames } = this.props;
    if (!bracketGames?.length) return;

    const newBracketGames = removeGameFromBracketGames(
      gameIndex,
      bracketGames,
      selectedDivision
    );

    this.props.fetchBracketGames(newBracketGames);
  };

  onSeedsUsed = () => {};

  onSavePressed = () => {
    const { match, bracketGames } = this.props;
    const { cancelConfirmationOpen } = this.state;
    const { bracketId } = match.params;

    if (bracketId) {
      this.props.savePlayoff(bracketGames!);
    } else {
      this.props.createPlayoff(bracketGames!);
    }

    if (cancelConfirmationOpen) {
      this.closeCancelConfirmation();
      this.onExit();
    }
  };

  toggleReplacementMessage = () =>
    this.setState({
      replacementBracketGames: undefined,
      replacementMessage: undefined,
    });

  confirmReplacement = () => {
    const { replacementBracketGames } = this.state;

    if (replacementBracketGames) {
      this.props.fetchBracketGames(replacementBracketGames);
    }

    this.toggleReplacementMessage();
  };

  setHighlightedGame = (id: number) => {
    this.setState({
      highlightedGameId: this.state.highlightedGameId === id ? undefined : id,
    });
  };

  render() {
    const {
      activeTab,
      timeSlots,
      fields,
      facilities,
      bracketSeeds,
      tableGames,
      cancelConfirmationOpen,
      replacementBracketGames,
      replacementMessage,
    } = this.state;

    const {
      bracket,
      event,
      divisions,
      pools,
      schedulesTeamCards,
      eventSummary,
      schedule,
      schedulesDetails,
      onBracketsUndo,
      historyLength,
      bracketGames,
    } = this.props;

    const saveButtonCondition = bracket && bracketGames;

    return (
      <div className={styles.container}>
        <DndProvider backend={HTML5Backend}>
          <div className={styles.paperWrapper}>
            <Paper>
              <div className={styles.paperContainer}>
                <div className={styles.bracketName}>
                  <span>{bracket?.name}</span>
                </div>
                <div>
                  <Button
                    label="Close"
                    variant="text"
                    color="secondary"
                    onClick={this.onGoBack}
                  />
                  <Button
                    label="Save"
                    variant="contained"
                    color="primary"
                    disabled={!saveButtonCondition}
                    onClick={this.onSavePressed}
                  />
                </div>
              </div>
            </Paper>
          </div>

          <section className={styles.tabsContainer}>
            <div className={styles.tabToggle}>
              <div
                className={activeTab === 1 ? styles.active : ''}
                onClick={() => this.setState({ activeTab: 1 })}
              >
                Resource Matrix
              </div>
              <div
                className={activeTab === 2 ? styles.active : ''}
                onClick={() => this.setState({ activeTab: 2 })}
              >
                Bracket Manager
              </div>
            </div>
            {activeTab === PlayoffsTabsEnum.ResourceMatrix ? (
              <ResourceMatrix
                bracketGames={bracketGames!}
                event={event}
                divisions={divisions}
                pools={pools}
                teamCards={schedulesTeamCards}
                games={tableGames}
                fields={fields}
                timeSlots={timeSlots}
                facilities={facilities}
                scheduleData={schedule}
                eventSummary={eventSummary}
                schedulesDetails={schedulesDetails}
                onTeamCardsUpdate={() => {}}
                onTeamCardUpdate={() => {}}
                onUndo={() => {}}
                updateGame={this.updateMergedGames}
                setHighlightedGame={this.setHighlightedGame}
                highlightedGameId={this.state.highlightedGameId}
              />
            ) : (
              <BracketManager
                historyLength={historyLength}
                divisions={divisions!}
                seeds={bracketSeeds}
                bracketGames={bracketGames!}
                addGame={this.addGame}
                removeGame={this.removeGame}
                onUndoClick={onBracketsUndo}
              />
            )}
          </section>
        </DndProvider>
        <PopupExposure
          isOpen={cancelConfirmationOpen}
          onClose={this.closeCancelConfirmation}
          onExitClick={this.onExit}
          onSaveClick={this.onSavePressed}
        />
        <PopupConfirm
          type="warning"
          showYes={!!replacementBracketGames}
          isOpen={!!replacementMessage}
          message={replacementMessage || ''}
          onClose={this.toggleReplacementMessage}
          onCanceClick={this.toggleReplacementMessage}
          onYesClick={this.confirmReplacement}
        />
      </div>
    );
  }
}

const mapStateToProps = ({
  pageEvent,
  schedules,
  scheduling,
  divisions,
  schedulesTable,
  playoffs,
}: IAppState): IMapStateToProps => ({
  event: pageEvent.tournamentData.event,
  facilities: pageEvent.tournamentData.facilities,
  divisions: pageEvent.tournamentData.divisions,
  teams: pageEvent.tournamentData.teams,
  fields: pageEvent.tournamentData.fields,
  schedules: pageEvent.tournamentData.schedules,
  eventSummary: schedules.eventSummary,
  bracket: scheduling.bracket,
  schedule: schedules.schedule,
  pools: divisions?.pools,
  schedulesTeamCards: schedulesTable.current,
  schedulesDetails: schedules?.schedulesDetails,
  playoffSaved: playoffs?.playoffSaved,
  bracketGames: playoffs?.bracketGames,
  historyLength: playoffs?.bracketGamesHistory?.length,
});

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps =>
  bindActionCreators(
    {
      fetchEventSummary,
      fetchSchedulesDetails,
      getAllPools,
      fillSchedulesTable,
      clearSchedulesTable,
      createPlayoff,
      savePlayoff,
      retrieveBracketsGames,
      retrieveBrackets,
      clearBracketGames,
      fetchBracketGames,
      onBracketsUndo: onUndoBrackets,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Playoffs);
