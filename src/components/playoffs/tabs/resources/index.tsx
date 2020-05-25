import React, { Component } from 'react';
import { MatrixTable, Loader, Button, CardMessage } from 'components/common';
import {
  IEventDetails,
  IDivision,
  IPool,
  IEventSummary,
  ISchedule,
  ISchedulesDetails,
} from 'common/models';
import { IField } from 'common/models/schedule/fields';
import { ITeamCard } from 'common/models/schedule/teams';
import { IGame } from 'components/common/matrix-table/helper';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { TableScheduleTypes } from 'common/enums';
import { IBracketGame } from 'components/playoffs/bracketGames';
import {
  IDropParams,
  MatrixTableDropEnum,
} from 'components/common/matrix-table/dnd/drop';
import MultiSelect, {
  IMultiSelectOption,
} from 'components/common/multi-select';
import BracketGamesList from './bracket-games-list';
import { CardMessageTypes } from 'components/common/card-message/types';
import styles from './styles.module.scss';

interface IProps {
  bracketGames?: IBracketGame[];
  event?: IEventDetails | null;
  divisions?: IDivision[];
  pools?: IPool[];
  teamCards?: ITeamCard[];
  games?: IGame[];
  fields?: IField[];
  timeSlots?: ITimeSlot[];
  scheduleData?: ISchedule;
  facilities?: IScheduleFacility[];
  eventSummary?: IEventSummary[];
  schedulesDetails?: ISchedulesDetails[];
  onTeamCardsUpdate: (teamCard: ITeamCard[]) => void;
  onTeamCardUpdate: (teamCard: ITeamCard) => void;
  onUndo: () => void;
  updateGame: (gameId: string, slotId: number) => void;
  setHighlightedGame?: (id: number) => void;
  highlightedGameId?: number;
}

interface IState {
  tableGames?: IGame[];
  divisionOptions?: IMultiSelectOption[];
  filteredGames?: IGame[];
  isDnd: boolean;
}

class ResourceMatrix extends Component<IProps> {
  state: IState = {
    isDnd: false,
  };

  componentDidMount() {
    const { divisions } = this.props;
    if (divisions) {
      const divisionOptions = divisions.map(item => ({
        label: item.short_name,
        value: item.division_id,
        checked: true,
      }));
      this.setState({ divisionOptions });
    }
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    const { divisionOptions, filteredGames } = this.state;

    if (
      prevState.divisionOptions !== divisionOptions ||
      prevProps.games !== this.props.games ||
      (!filteredGames && this.props.games)
    ) {
      const divisionIds =
        this.state.divisionOptions
          ?.filter(item => item.checked)
          .map(item => item.value) || [];

      const filteredGames = this.props.games?.map(game =>
        divisionIds.includes(
          game.awayTeam?.divisionId! ||
            game.homeTeam?.divisionId! ||
            game.divisionId!
        )
          ? game
          : {
              ...game,
              awayTeam: undefined,
              homeTeam: undefined,
              awayDependsUpon: undefined,
              homeDependsUpon: undefined,
              awaySeedId: undefined,
              homeSeedId: undefined,
            }
      );

      this.setState({
        filteredGames,
      });
    }
  }

  setSelectedDivision = (name: string, data: IMultiSelectOption[]) =>
    this.setState({ [name]: data });

  onMoveCard = (dropParams: IDropParams) => {
    // Send <IBracketGame.id, IGame.id>
    this.props.updateGame(dropParams.teamId, dropParams.gameId!);
  };

  render() {
    const {
      event,
      divisions,
      pools,
      teamCards,
      fields,
      timeSlots,
      facilities,
      scheduleData,
      eventSummary,
      onTeamCardsUpdate,
      onTeamCardUpdate,
      onUndo,
      highlightedGameId,
      bracketGames,
      setHighlightedGame,
    } = this.props;

    const { divisionOptions, filteredGames, isDnd } = this.state;

    return (
      <section className={styles.container}>
        <div className={styles.leftColumn}>
          {bracketGames && divisions && filteredGames && (
            <BracketGamesList
              acceptType={MatrixTableDropEnum.BracketDrop}
              bracketGames={bracketGames}
              divisions={divisions}
              filteredGames={filteredGames}
              onDrop={this.onMoveCard}
              setHighlightedGame={setHighlightedGame!}
            />
          )}
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.filterWrapper}>
            {!!divisionOptions?.length && (
              <fieldset className={styles.selectWrapper}>
                <legend className={styles.selectTitle}>Divisions</legend>
                <MultiSelect
                  placeholder="Select"
                  name="divisionOptions"
                  selectOptions={divisionOptions}
                  onChange={this.setSelectedDivision}
                />
              </fieldset>
            )}
            <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
              Bracket games are painted in dark colors
            </CardMessage>
            <div className={styles.dndToggleWrapper}>
              Mode:
              <Button
                label="Zoom-n-Nav"
                variant="contained"
                color={isDnd ? 'default' : 'primary'}
                onClick={() => this.setState({ isDnd: false })}
              />
              <Button
                label="Drag-n-Drop"
                variant="contained"
                color={isDnd ? 'primary' : 'default'}
                onClick={() => this.setState({ isDnd: true })}
              />
            </div>
          </div>

          {event &&
          divisions &&
          pools &&
          teamCards &&
          filteredGames &&
          fields &&
          timeSlots &&
          facilities &&
          eventSummary &&
          onTeamCardsUpdate &&
          scheduleData &&
          onTeamCardUpdate &&
          onUndo ? (
            <MatrixTable
              tableType={TableScheduleTypes.BRACKETS}
              games={filteredGames}
              fields={fields}
              timeSlots={timeSlots}
              facilities={facilities}
              showHeatmap={true}
              isEnterScores={false}
              moveCard={this.onMoveCard}
              disableZooming={isDnd}
              onTeamCardUpdate={onTeamCardUpdate}
              onTeamCardsUpdate={onTeamCardsUpdate}
              teamCards={teamCards}
              isFullScreen={false}
              onToggleFullScreen={() => {}}
              highlightedGameId={highlightedGameId}
            />
          ) : (
            <Loader styles={{ height: '100%' }} />
          )}
        </div>
      </section>
    );
  }
}

export default ResourceMatrix;
