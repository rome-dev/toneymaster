import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  thead: {
    flexDirection: 'row',

    width: '100%',
    marginLeft: 62,

    borderTop: 1,
    borderBottom: 1,
    borderColor: '#333',
  },
  fieldName: {
    width: 95,

    padding: '5px',

    fontSize: 9,
  },
});

export { styles };
