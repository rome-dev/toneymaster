import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import History from 'browserhistory';
import { loadScoresData, saveGames } from './logic/actions';
import Navigation from './components/navigation';
import { Loader, PopupExposure, TableSchedule } from 'components/common';
import {
  IDivision,
  ITeam,
  IEventSummary,
  IFacility,
  IEventDetails,
  IField,
  ISchedule,
  IPool,
  ISchedulesGame,
  BindingCbWithOne,
  BindingAction,
} from 'common/models';
import { Routes, TableScheduleTypes } from 'common/enums';
import styles from './styles.module.scss';
import {
  mapFacilitiesData,
  mapFieldsData,
  mapTeamsData,
  mapDivisionsData,
} from 'components/schedules/mapTournamentData';
import {
  getTimeValuesFromEventSchedule,
  calculateTimeSlots,
  calculateTournamentDays,
} from 'helpers';
import {
  sortFieldsByPremier,
  defineGames,
  IGame,
  settleTeamsPerGamesDays,
} from 'components/common/matrix-table/helper';
import { IAppState } from 'reducers/root-reducer.types';
import {
  ITeam as IScheduleTeam,
  ITeamCard,
} from 'common/models/schedule/teams';
import {
  mapTeamsFromShedulesGames,
  mapTeamCardsToSchedulesGames,
} from 'components/schedules/mapScheduleData';
import {
  fillSchedulesTable,
  updateSchedulesTable,
  clearSchedulesTable,
} from 'components/schedules/logic/schedules-table/actions';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { IScheduleDivision } from 'common/models/schedule/divisions';
import { IField as IScheduleField } from 'common/models/schedule/fields';
import { errorToast } from 'components/common/toastr/showToasts';
import { mapGamesWithSchedulesGamesId } from 'components/scoring/helpers';
import api from 'api/api';

interface MatchParams {
  eventId?: string;
}

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  event: IEventDetails | null;
  facilities: IFacility[];
  fields: IField[];
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
  schedule: ISchedule | null;
  eventSummary: IEventSummary[];
  schedulesGames: ISchedulesGame[];
  schedulesTeamCards?: ITeamCard[];
  isFullScreen: boolean;
  loadScoresData: (eventId: string) => void;
  fillSchedulesTable: BindingCbWithOne<ITeamCard[]>;
  updateSchedulesTable: BindingCbWithOne<ITeamCard>;
  saveGames: BindingCbWithOne<ISchedulesGame[]>;
  onToggleFullScreen: BindingAction;
  clearSchedulesTable: () => void;
}

interface State {
  games?: IGame[];
  timeSlots?: ITimeSlot[];
  teams?: IScheduleTeam[];
  fields?: IScheduleField[];
  facilities?: IScheduleFacility[];
  divisions?: IScheduleDivision[];
  isExposurePopupOpen: boolean;
  isEnterScores: boolean;
  neccessaryDataCalculated: boolean;
  changesAreMade: boolean;
}

class RecordScores extends React.Component<
  Props & RouteComponentProps<MatchParams>,
  State
> {
  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props);

    this.state = {
      isExposurePopupOpen: false,
      isEnterScores: false,
      neccessaryDataCalculated: false,
      changesAreMade: false,
    };
  }

  componentDidMount() {
    const { loadScoresData } = this.props;
    const eventId = this.props.match.params.eventId;
    this.props.clearSchedulesTable();

    if (eventId) {
      loadScoresData(eventId);
    }
  }

  componentDidUpdate() {
    const { schedule, schedulesGames, schedulesTeamCards } = this.props;
    const { teams, games, neccessaryDataCalculated } = this.state;

    if (!neccessaryDataCalculated && schedule) {
      this.calculateNeccessaryData();
      return;
    }

    if (
      games?.length &&
      !schedulesTeamCards &&
      schedulesGames &&
      teams &&
      schedule
    ) {
      const mappedGames = mapGamesWithSchedulesGamesId(games, schedulesGames);

      this.setState({ games: mappedGames });

      const mappedTeams = mapTeamsFromShedulesGames(
        schedulesGames,
        teams,
        mappedGames
      );

      this.props.fillSchedulesTable(mappedTeams);
    }
  }

  calculateNeccessaryData = () => {
    const {
      event,
      schedule,
      fields,
      teams,
      divisions,
      facilities,
    } = this.props;

    if (
      !schedule ||
      !event ||
      !Boolean(fields.length) ||
      !Boolean(teams.length) ||
      !Boolean(divisions.length) ||
      !Boolean(facilities.length)
    ) {
      return;
    }

    const timeValues = getTimeValuesFromEventSchedule(event, schedule);

    const timeSlots = calculateTimeSlots(timeValues);

    const mappedFields = mapFieldsData(fields, facilities);
    const sortedFields = sortFieldsByPremier(mappedFields);

    const { games } = defineGames(sortedFields, timeSlots!);

    const mappedTeams = mapTeamsData(teams, divisions);
    const mappedFacilities = mapFacilitiesData(facilities);

    const mappedDivisions = mapDivisionsData(divisions);

    return this.setState({
      games,
      timeSlots,
      divisions: mappedDivisions,
      fields: sortedFields,
      teams: mappedTeams,
      facilities: mappedFacilities,
      neccessaryDataCalculated: true,
    });
  };

  retrieveSchedulesGames = async () => {
    const { games } = this.state;
    const { schedulesTeamCards, schedule, event } = this.props;

    if (!schedule || !games || !schedulesTeamCards) {
      throw errorToast('Failed to retrieve schedules data');
    }

    const tournamentDays = calculateTournamentDays(event!);
    const publishedGames = await api.get('/games', {
      schedule_id: schedule.schedule_id,
    });

    let schedulesTableGames = [];
    for (const day of tournamentDays) {
      schedulesTableGames.push(
        settleTeamsPerGamesDays(games, schedulesTeamCards, day)
      );
    }
    schedulesTableGames = schedulesTableGames.flat();

    return mapTeamCardsToSchedulesGames(
      schedule,
      schedulesTableGames,
      publishedGames
    );
  };

  saveDraft = async () => {
    const schedulesGames = await this.retrieveSchedulesGames();

    if (!schedulesGames) {
      throw errorToast('Failed to save schedules data');
    }

    this.props.saveGames(schedulesGames);

    this.setState({ isExposurePopupOpen: false, changesAreMade: false });
  };

  onChangeView = (flag: boolean) => this.setState({ isEnterScores: flag });

  leavePage = () => {
    const eventId = this.props.match.params.eventId;

    History.push(`${Routes.SCORING}/${eventId || ''}`);
  };

  saveOnExit = () => {
    this.saveDraft();
    this.leavePage();
  };

  onLeavePage = () => {
    if (this.state.changesAreMade) {
      this.setState({ isExposurePopupOpen: true });
    } else {
      this.leavePage();
    }
  };

  onClosePopup = () => this.setState({ isExposurePopupOpen: false });

  onScheduleCardUpdate = (teamCard: ITeamCard) => {
    this.props.updateSchedulesTable(teamCard);
    if (!this.state.changesAreMade) {
      this.setState({ changesAreMade: true });
    }
  };

  render() {
    const {
      isLoading,
      divisions,
      event,
      eventSummary,
      pools,
      schedule,
      schedulesTeamCards,
      isFullScreen,
      onToggleFullScreen,
    } = this.props;

    const {
      fields,
      timeSlots,
      games,
      facilities,
      isEnterScores,
      isExposurePopupOpen,
    } = this.state;

    const loadCondition = !!(
      fields?.length &&
      games?.length &&
      timeSlots?.length &&
      facilities?.length &&
      event &&
      Boolean(divisions.length) &&
      Boolean(pools.length) &&
      Boolean(eventSummary.length) &&
      schedulesTeamCards?.length
    );

    return (
      <div className={isFullScreen ? styles.fullScreenWrapper : ''}>
        <Navigation
          isEnterScores={isEnterScores}
          isFullScreen={isFullScreen}
          onLeavePage={this.onLeavePage}
          onChangeView={this.onChangeView}
          onSaveDraft={this.saveDraft}
        />
        <section className={styles.scoringWrapper}>
          <h2 className="visually-hidden">Scoring</h2>
          {loadCondition && !isLoading ? (
            <TableSchedule
              tableType={TableScheduleTypes.SCORES}
              event={event!}
              fields={fields!}
              games={games!}
              timeSlots={timeSlots!}
              pools={pools}
              divisions={divisions!}
              facilities={facilities!}
              teamCards={schedulesTeamCards!}
              eventSummary={eventSummary!}
              scheduleData={schedule!}
              isEnterScores={isEnterScores}
              isFullScreen={isFullScreen}
              onTeamCardsUpdate={() => {}}
              onTeamCardUpdate={this.onScheduleCardUpdate}
              onUndo={() => {}}
              onToggleFullScreen={onToggleFullScreen}
            />
          ) : (
            <Loader />
          )}
        </section>
        <PopupExposure
          isOpen={isExposurePopupOpen}
          onClose={this.onClosePopup}
          onExitClick={this.leavePage}
          onSaveClick={this.saveOnExit}
        />
      </div>
    );
  }
}

export default connect(
  ({ recordScores, schedulesTable }: IAppState) => ({
    isLoading: recordScores.isLoading,
    isLoaded: recordScores.isLoaded,
    event: recordScores.event,
    facilities: recordScores.facilities,
    fields: recordScores.fields,
    divisions: recordScores.divisions,
    pools: recordScores.pools,
    teams: recordScores.teams,
    schedule: recordScores.schedule,
    eventSummary: recordScores.eventSummary,
    schedulesTeamCards: schedulesTable?.current,
    schedulesGames: recordScores.schedulesGames,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        loadScoresData,
        fillSchedulesTable,
        updateSchedulesTable,
        saveGames,
        clearSchedulesTable,
      },
      dispatch
    )
)(RecordScores);
