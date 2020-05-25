import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: '0 10px',
  },
  timeSlot: {
    marginRight: 10,

    fontSize: 10,
  },
  gameWrapper: {
    flexDirection: 'column',

    width: 95,
    minHeight: 30,

    padding: '5px 1px',
  },
  gameTeamName: {
    flexDirection: 'row',
  },
  teamNameWrapper: {
    maxWidth: 65,

    paddingLeft: 2,

    maxLines: 1,
  },
  divisionNameWrapper: {
    width: 20,
    paddingLeft: 1,
  },
});

export { styles };
