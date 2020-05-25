import { MenuTitles, Icons, Routes } from 'common/enums';

export const MenuList = [
  {
    title: 'My Dashboard',
    icon: Icons.PERSON,
    link: Routes.DASHBOARD,
    children: [],
  },
  {
    title: MenuTitles.LIBRARY_MANAGER,
    icon: Icons.INSERT_DRIVE,
    link: Routes.LIBRARY_MANAGER,
    children: [
      MenuTitles.EVENTS,
      MenuTitles.FACILITIES,
      MenuTitles.REGISTRATION,
      MenuTitles.DIVISIONS_AND_POOLS,
      MenuTitles.SCHEDULING,
    ],
  },
  {
    title: 'EventLink',
    icon: Icons.EMAIL,
    link: Routes.EVENT_LINK,
    children: ['Messaging', 'Schedule Review'],
  },
  {
    title: 'Collaboration',
    icon: Icons.PEOPLE,
    link: Routes.COLLABORATION,
    children: [],
  },
  {
    title: 'Calendar',
    icon: Icons.CALENDAR,
    link: Routes.CALENDAR,
    children: [],
  },
  {
    title: MenuTitles.UTILITIES,
    icon: Icons.SETTINGS,
    link: Routes.UTILITIES,
    children: [
      MenuTitles.USER_PROFILE,
      MenuTitles.TOURNEY_IMPORT,
      // MenuTitles.EMAIL_SETUP
    ],
  },
  {
    title: 'Event Day Complexities',
    link: Routes.EVENT_DAY_COMPLEXITIES,
    icon: Icons.ERROR,
    children: [],
  },
];
