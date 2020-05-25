/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Header from '../header';
import Menu from '../common/menu';
import { MenuList } from './logic/constants';
import Dashboard from '../dashboard';
import LibraryManager from '../library-manager';
import OrganizationsManagement from '../organizations-management';
import Calendar from 'components/calendar';
import Utilities from 'components/utilities';
import Footer from 'components/footer';
import { Routes } from 'common/enums';
import styles from './styles.module.scss';
import GamedayComplexities from 'components/gameday-complexities';
import ScrollTopButton from 'components/common/scroll-top-button';
import Support from '../support';
import EventLink from 'components/event-link';
import {
  getCalendarEvents,
  updateCalendarEvent,
} from 'components/calendar/logic/actions';
import {
  filterCalendarEvents,
  checkIfRemind,
} from 'components/calendar/logic/helper';
import { BindingAction, ICalendarEvent } from 'common/models';
import CreateMessage from 'components/event-link/create-message';

interface Props {
  getCalendarEvents: BindingAction;
  updateCalendarEvent: BindingAction;
  calendarEvents: ICalendarEvent[];
}

const AuthorizedPage = ({
  getCalendarEvents,
  calendarEvents,
  updateCalendarEvent,
}: Props) => {
  React.useEffect(() => {
    getCalendarEvents();
  }, []);

  React.useEffect(() => {
    if (calendarEvents) {
      const filteredCalendarEvents = filterCalendarEvents(calendarEvents);
      const interval = setInterval(() => {
        checkIfRemind(filteredCalendarEvents, updateCalendarEvent);
      }, 1000 * 60);
      return () => clearInterval(interval);
    }
  });

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.page}>
        <Menu list={MenuList} isAllowEdit={true} />
        <main className={styles.content}>
          <Switch>
            <Route path={Routes.DASHBOARD} component={Dashboard} />
            <Route path={Routes.LIBRARY_MANAGER} component={LibraryManager} />
            <Route path={Routes.CREATE_MESSAGE} component={CreateMessage} />
            <Route path={Routes.EVENT_LINK} component={EventLink} />
            <Route
              path={Routes.COLLABORATION}
              component={OrganizationsManagement}
            />
            <Route path={Routes.CALENDAR} component={Calendar} />
            <Route path={Routes.UTILITIES} component={Utilities} />
            <Route
              path={Routes.EVENT_DAY_COMPLEXITIES}
              component={GamedayComplexities}
            />
            <Route
              path={Routes.ORGANIZATIONS_MANAGEMENT}
              component={OrganizationsManagement}
            />
            <Route path={Routes.SUPPORT} component={Support} />
            <Route path={Routes.DEFAULT} component={Dashboard} />
          </Switch>
          <ScrollTopButton />
        </main>
      </div>
      <Footer />
    </div>
  );
};

const mapStateToProps = (state: {
  calendar: { events: ICalendarEvent[] };
}) => ({
  calendarEvents: state.calendar.events,
});

const mapDispatchToProps = {
  getCalendarEvents,
  updateCalendarEvent,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizedPage);
