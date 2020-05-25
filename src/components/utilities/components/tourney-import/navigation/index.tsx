import React from 'react';
import styles from './styles.module.scss';

export const Navigation = () => {
  // function onCommitData() {
  //   const data = getData('events');
  //   console.log(data);
  // }

  // async function getData(dataType: String) {
  //   const data = await Api.get(`/ext_${dataType}?IDTournament=${idTournament}`);
  //   return data;
  // }

  return (
    <div className={styles.wrapper}>
      <div className={styles.buttonGroup}></div>
    </div>
  )
};