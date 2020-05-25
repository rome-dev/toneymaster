import React from 'react';
import styles from './styles.module.scss';

interface IProps {
  leftGamesNum: number;
  rightGamesNum: number;
  hidden?: any[];
}

const selectStyle = (num: number) => {
  switch (num) {
    case 8:
      return styles.connectors8;
    case 4:
      return styles.connectors4;
    case 2:
      return styles.connectors2;
    default:
      return styles.connectors2;
  }
};

const getHiddenStyle = (hiddenTop: boolean, hiddenBottom: boolean) => {
  switch (true) {
    case hiddenTop && hiddenBottom:
      return styles.hidden;
    case hiddenTop && !hiddenBottom:
      return styles.hiddenTop;
    case !hiddenTop && hiddenBottom:
      return styles.hiddenBottom;
  }
};

const BracketConnector = (props: IProps) => {
  const { hidden, leftGamesNum, rightGamesNum } = props;

  const negative =
    leftGamesNum && rightGamesNum && leftGamesNum < rightGamesNum;

  const step = (negative ? rightGamesNum : leftGamesNum) || 0;

  const renderConnector = () => (
    <div
      key={Math.random()}
      className={`${styles.connector} ${negative && styles.negativeConnector}`}
    />
  );

  return (
    <div className={selectStyle(step)}>
      {hidden &&
        hidden.map(({ hiddenTop, hiddenBottom }) => (
          <div
            key={Math.random()}
            className={`${styles.connector} ${getHiddenStyle(
              hiddenTop,
              hiddenBottom
            )} ${negative && styles.negativeConnector}`}
          />
        ))}

      {!hidden && [...Array(Math.round(step / 2))].map(renderConnector)}
    </div>
  );
};

export default BracketConnector;
