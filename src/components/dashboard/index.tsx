import React from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import NotificationsIcon from '@material-ui/icons/Notifications';
import styles from './style.module.scss';
import Button from '../common/buttons/button';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Paper from '../common/paper';
import TimelineCard from './timeline-card';
import NotificationsCard from './notifications-card';
import InfoCard from './info-card';
import TournamentCard from './tournament-card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { getEvents, getCalendarEvents } from './logic/actions';
import { Loader } from 'components/common';
import {
  ITeam,
  IField,
  BindingAction,
  ICalendarEvent,
  IOrganization,
  IEventDetails,
  IFacility,
  ISchedule,
} from 'common/models';
import OnboardingWizard from 'components/onboarding-wizard';
import { loadOrganizations } from 'components/organizations-management/logic/actions';
import { EventStatuses } from 'common/enums';

interface IFieldWithEventId extends IField {
  event_id: string;
}

interface IDashboardProps {
  history: History;
  events: IEventDetails[];
  teams: ITeam[];
  fields: IFieldWithEventId[];
  facilities: IFacility[];
  schedules: ISchedule[];
  isLoading: boolean;
  isDetailLoading: boolean;
  areCalendarEventsLoading: boolean;
  getEvents: () => void;
  getCalendarEvents: BindingAction;
  calendarEvents: ICalendarEvent[];
  loadOrganizations: BindingAction;
  organizations: IOrganization[];
}

interface IDashboardState {
  order: number;
  filters: { status: number[]; historical: boolean };
  isOnboardingWizardOpen: boolean;
}

class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
  state = {
    order: 1,
    filters: { status: [1, 0], historical: false },
    isOnboardingWizardOpen: false,
  };

  componentDidMount() {
    this.props.loadOrganizations();
    this.props.getEvents();
    this.props.getCalendarEvents();
  }

  componentDidUpdate(prevProps: IDashboardProps) {
    if (
      !prevProps.organizations.length &&
      prevProps.organizations !== this.props.organizations
    ) {
      this.setState({
        isOnboardingWizardOpen: !this.props.organizations.length,
      });
    }
  }

  onCreateTournament = () => {
    this.props.history.push('/event/event-details');
  };
  onOrderChange = (order: number) => {
    this.setState({ order });
  };

  filterEvents = (status: number) => {
    const { filters } = this.state;
    if (filters.status.includes(status)) {
      this.setState({
        filters: {
          historical: false,
          status: filters.status.filter((filter: number) => filter !== status),
        },
      });
    } else {
      this.setState({
        filters: {
          historical: false,
          status: [...filters.status, status],
        },
      });
    }
  };

  onPublishedFilter = () => {
    this.filterEvents(EventStatuses.Published);
  };

  onDraftFilter = () => {
    this.filterEvents(EventStatuses.Draft);
  };

  onHistoricalFilter = () => {
    this.setState({
      filters: {
        status: [],
        historical: !this.state.filters.historical,
      },
    });
  };

  renderEvents = () => {
    const filteredEvents = this.state.filters.historical
      ? this.props.events.filter(
          event => new Date(event.event_enddate) < new Date()
        )
      : this.props.events.filter(event =>
          this.state.filters.status.includes(event.is_published_YN)
        );

    const numOfPublished = this.props.events?.filter(
      event => event.is_published_YN === EventStatuses.Published
    ).length;
    const numOfDraft = this.props.events?.filter(
      event => event.is_published_YN === EventStatuses.Draft
    ).length;

    const numOfHistorical = this.props.events?.filter(
      event => new Date(event.event_enddate) < new Date()
    ).length;

    return (
      <div className={styles.tournamentsContainer} key={1}>
        <div className={styles.tournamentsHeading}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <FontAwesomeIcon
                size="xs"
                icon={faTrophy}
                style={{ marginRight: '5px' }}
              />
              Events
            </div>
          </div>
          <div className={styles.buttonsGroup}>
            <Button
              label={`Published (${numOfPublished})`}
              variant="contained"
              color="primary"
              type={
                this.state.filters.status.includes(EventStatuses.Published) &&
                !this.state.filters.historical
                  ? 'squared'
                  : 'squaredOutlined'
              }
              onClick={this.onPublishedFilter}
            />
            <Button
              label={`Draft (${numOfDraft})`}
              variant="contained"
              color="primary"
              type={
                this.state.filters.status.includes(EventStatuses.Draft) &&
                !this.state.filters.historical
                  ? 'squared'
                  : 'squaredOutlined'
              }
              onClick={this.onDraftFilter}
            />
            <Button
              label={`Historical (${numOfHistorical})`}
              variant="contained"
              color="primary"
              type={
                this.state.filters.historical ? 'squared' : 'squaredOutlined'
              }
              onClick={this.onHistoricalFilter}
            />
          </div>
        </div>
        <div className={styles.tournamentsListContainer}>
          {this.props.isLoading && (
            <div className={styles.loaderContainer}>
              <Loader />
            </div>
          )}
          {filteredEvents?.length && !this.props.isLoading
            ? filteredEvents.map((event: IEventDetails) => (
                <TournamentCard
                  key={event.event_id}
                  event={event}
                  history={this.props.history}
                  numOfTeams={
                    this.props.teams.filter(
                      team => team.event_id === event.event_id
                    )?.length
                  }
                  numOfFields={
                    this.props.fields.filter(
                      field => field.event_id === event.event_id
                    )?.length
                  }
                  numOfLocations={
                    this.props.facilities.filter(
                      facility => facility.event_id === event.event_id
                    )?.length
                  }
                  lastScheduleRelease={this.props.schedules.filter(
                    schedule =>
                      schedule.event_id === event.event_id &&
                      schedule.schedule_status === 'Published'
                  )[0]?.updated_datetime}
                  isDetailLoading={this.props.isDetailLoading}
                />
              ))
            : !this.props.isLoading && (
                <div className={styles.noFoundWrapper}>
                  <span>There are no events yet.</span>
                </div>
              )}
        </div>
      </div>
    );
  };

  renderNotifications = () => {
    return (
      <div className={styles.notificationsContainer} key={2}>
        <NotificationsCard
          data={this.props.calendarEvents.filter(
            event =>
              event.cal_event_type === 'reminder' &&
              event.status_id === 1 &&
              new Date(event.cal_event_datetime) > new Date()
          )}
          areCalendarEventsLoading={this.props.areCalendarEventsLoading}
        />
      </div>
    );
  };

  renderTimeline = () => {
    return (
      <div className={styles.timelineContainer} key={3}>
        <TimelineCard
          data={this.props.calendarEvents.filter(event => event.cal_event_id)}
          areCalendarEventsLoading={this.props.areCalendarEventsLoading}
        />
      </div>
    );
  };

  renderDashbaordInOrder = () => {
    const { order } = this.state;
    switch (order) {
      case 1:
        return [
          this.renderEvents(),
          this.renderNotifications(),
          this.renderTimeline(),
        ];
      case 2:
        return [
          this.renderNotifications(),
          this.renderEvents(),
          this.renderTimeline(),
        ];
      case 3:
        return [
          this.renderTimeline(),
          this.renderNotifications(),
          this.renderEvents(),
        ];
      default:
        return [
          this.renderEvents(),
          this.renderNotifications(),
          this.renderTimeline(),
        ];
    }
  };

  render() {
    return (
      <div className={styles.main}>
        <Paper sticky={true}>
          <div className={styles.mainMenu}>
            <Button
              label="Create Tournament"
              variant="contained"
              color="primary"
              onClick={this.onCreateTournament}
            />
          </div>
        </Paper>
        <div className={styles.heading}>
          <HeadingLevelTwo>My Dashboard</HeadingLevelTwo>
        </div>
        <div className={styles.dashboardCardsContainer}>
          <InfoCard
            icon={<FontAwesomeIcon size="lg" icon={faTrophy} />}
            info={`${this.props.events?.length} Events`}
            order={1}
            changeOrder={this.onOrderChange}
          />
          <InfoCard
            icon={<NotificationsIcon fontSize="large" />}
            info={`${
              this.props.calendarEvents.filter(
                event =>
                  event.cal_event_type === 'reminder' &&
                  event.status_id === 1 &&
                  new Date(event.cal_event_datetime) > new Date()
              ).length
            } Pending Reminders`}
            order={2}
            changeOrder={this.onOrderChange}
          />
          <InfoCard
            icon={<FormatListBulletedIcon fontSize="large" />}
            info={`${
              this.props.calendarEvents.filter(
                event =>
                  event.cal_event_type === 'task' && event.status_id === 1
              ).length
            } Pending/Open Tasks`}
            order={3}
            changeOrder={this.onOrderChange}
          />
        </div>
        {this.renderDashbaordInOrder()}
        <OnboardingWizard isOpen={this.state.isOnboardingWizardOpen} />
      </div>
    );
  }
}
interface IState {
  events: {
    data: IEventDetails[];
    teams: ITeam[];
    fields: IFieldWithEventId[];
    facilities: IFacility[];
    schedules: ISchedule[];
    calendarEvents: ICalendarEvent[];
    isLoading: boolean;
    isDetailLoading: boolean;
    areCalendarEventsLoading: boolean;
  };
  organizationsManagement: { organizations: IOrganization[] };
}

const mapStateToProps = (state: IState) => ({
  events: state.events.data,
  teams: state.events.teams,
  fields: state.events.fields,
  facilities: state.events.facilities,
  schedules: state.events.schedules,
  calendarEvents: state.events.calendarEvents,
  isLoading: state.events.isLoading,
  isDetailLoading: state.events.isDetailLoading,
  areCalendarEventsLoading: state.events.areCalendarEventsLoading,
  organizations: state.organizationsManagement.organizations,
});

const mapDispatchToProps = {
  getEvents,
  getCalendarEvents,
  loadOrganizations,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
