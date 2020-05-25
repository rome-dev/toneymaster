import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  rowTimeSlot: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: '5px 10px',
  },
  timeSlot: {
    marginRight: 30,
  },
  gamesWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    width: '280px',
    marginRight: 10,
  },
  team: {
    width: '135px',
  },
  teamName: {
    marginBottom: 3,

    textOverflow: 'ellipsis',
    maxLines: 1,
  },
  teamNum: {
    fontSize: 8,

    textOverflow: 'ellipsis',
    maxLines: 1,
  },
  scoresWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',

    width: '115px',
    margin: '5px 10px 0 0',
    paddingBottom: 5,
  },
  scoresColon: {
    paddingBottom: 3,
  },
  scores: {
    width: '55px',
    height: 15,

    backgroundColor: '#ffffff',
    borderBottom: 1,
  },
  initials: {
    width: '60px',
    height: 15,

    backgroundColor: '#ffffff',
    borderBottom: 1,
  },
});

export { styles };
