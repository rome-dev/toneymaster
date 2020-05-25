import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import {
  loadScoringData,
  loadPools,
  editTeam,
  deleteTeam,
} from './logic/actions';
import { IAppState } from 'reducers/root-reducer.types';
import Navigation from './components/navigation';
import ListStatistic from './components/list-statistic';
import ScoringItem from './components/scoring-Item';
import {
  HeadingLevelTwo,
  Modal,
  Loader,
  PopupTeamEdit,
  HazardList,
} from 'components/common';
import {
  IDivision,
  IPool,
  ITeamWithResults,
  BindingCbWithOne,
  ISchedulesGameWithNames,
  IMenuItem,
  ITeam,
  IEventDetails,
} from 'common/models';
import styles from './styles.module.scss';
import Button from 'components/common/buttons/button';
import { SortByFilesTypes } from 'common/enums';
import { sortByField } from 'helpers';

interface MatchParams {
  eventId: string;
}

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeamWithResults[];
  games: ISchedulesGameWithNames[];
  event: IEventDetails | null;
  incompleteMenuItems: IMenuItem[];
  loadScoringData: (eventId: string) => void;
  loadPools: (divisionId: string) => void;
  editTeam: BindingCbWithOne<ITeamWithResults>;
  deleteTeam: (teamId: string) => void;
}

interface State {
  changeableTeam: ITeamWithResults | null;
  currentDivision: string | null;
  currentPool: string | null;
  isModalOpen: boolean;
  isSectionsExpand: boolean;
}

class Sсoring extends React.Component<
  Props & RouteComponentProps<MatchParams>,
  State
> {
  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props);

    this.state = {
      currentDivision: null,
      currentPool: null,
      changeableTeam: null,
      isModalOpen: false,
      isSectionsExpand: true,
    };
  }

  componentDidMount() {
    const { loadScoringData } = this.props;
    const eventId = this.props.match.params.eventId;

    if (eventId) {
      loadScoringData(eventId);
    }
  }

  onSaveTeam = () => {
    const { changeableTeam } = this.state;
    const { editTeam } = this.props;

    if (changeableTeam) {
      editTeam(changeableTeam);
    }

    this.onCloseModal();
  };

  onDeleteTeam = (team: ITeamWithResults | ITeam) => {
    const { deleteTeam } = this.props;

    deleteTeam(team.team_id);

    this.onCloseModal();
  };

  onChangeTeam = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value, name },
    } = evt;

    this.setState(({ changeableTeam }) => ({
      changeableTeam: {
        ...(changeableTeam as ITeamWithResults),
        [name]: value,
      },
    }));
  };

  onOpenTeamDetails = (
    team: ITeamWithResults,
    divisionName: string,
    poolName: string
  ) => {
    this.setState({
      isModalOpen: true,
      changeableTeam: team,
      currentDivision: divisionName,
      currentPool: poolName,
    });
  };

  onCloseModal = () =>
    this.setState({
      isModalOpen: false,
      changeableTeam: null,
      currentDivision: null,
      currentPool: null,
    });

  toggleSectionCollapse = () => {
    this.setState({ isSectionsExpand: !this.state.isSectionsExpand });
  };

  render() {
    const {
      isModalOpen,
      changeableTeam,
      currentDivision,
      currentPool,
    } = this.state;

    const {
      isLoading,
      pools,
      teams,
      divisions,
      loadPools,
      games,
      event,
      incompleteMenuItems,
    } = this.props;

    const isAllowViewPage = incompleteMenuItems.length === 0;

    if (!isAllowViewPage) {
      return (
        <HazardList
          incompleteMenuItems={incompleteMenuItems}
          eventId={this.props.match.params.eventId}
        />
      );
    }

    if (isLoading) {
      return <Loader />;
    }

    const sortedDivisions = sortByField(divisions, SortByFilesTypes.DIVISIONS);

    return (
      <section>
        <Navigation eventId={this.props.match.params.eventId} />
        <div className={styles.headingWrapper}>
          <HeadingLevelTwo>Scoring</HeadingLevelTwo>
          {divisions?.length ? (
            <Button
              label={
                this.state.isSectionsExpand ? 'Collapse All' : 'Expand All'
              }
              variant="text"
              color="secondary"
              onClick={this.toggleSectionCollapse}
            />
          ) : null}
        </div>
        <ListStatistic games={games} />
        <ul className={styles.scoringList}>
          {sortedDivisions.map(division => (
            <ScoringItem
              event={event}
              division={division}
              pools={pools.filter(
                pool => pool.division_id === division.division_id
              )}
              teams={teams}
              games={games}
              loadPools={loadPools}
              onOpenTeamDetails={this.onOpenTeamDetails}
              key={division.division_id}
              isSectionExpand={this.state.isSectionsExpand}
            />
          ))}
        </ul>

        <Modal isOpen={isModalOpen} onClose={this.onCloseModal}>
          <PopupTeamEdit
            team={changeableTeam}
            division={currentDivision}
            pool={currentPool}
            onSaveTeamClick={this.onSaveTeam}
            onDeleteTeamClick={this.onDeleteTeam}
            onChangeTeam={this.onChangeTeam}
            onCloseModal={this.onCloseModal}
            games={games}
          />
        </Modal>
      </section>
    );
  }
}

export default connect(
  ({ scoring, pageEvent }: IAppState) => ({
    isLoading: scoring.isLoading,
    isLoaded: scoring.isLoaded,
    divisions: scoring.divisions,
    pools: scoring.pools,
    teams: scoring.teams,
    games: scoring.games,
    event: pageEvent.tournamentData.event,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      { loadScoringData, loadPools, deleteTeam, editTeam },
      dispatch
    )
)(Sсoring);
