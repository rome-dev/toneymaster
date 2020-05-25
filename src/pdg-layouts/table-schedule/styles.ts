import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 15,

    fontSize: 9,
  },
  tableWrapper: {
    flexGrow: 1,

    marginBottom: 15,
  },
  facilityTitle: {
    flexDirection: 'row',

    marginBottom: 5,
    paddingLeft: 10,
  },
  scheduleDate: {
    marginRight: 14,
  },
  scheduleFacility: {
    fontSize: 10,
  },
  pageNumber: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
});

export { styles };
