import React, { useEffect, useState, Fragment } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { groupBy, keys } from 'lodash-es';
import BracketRound from './round';
import { IBracketSeed, IBracketGame } from '../bracketGames';
import BracketConnector from './connector';
import styles from './styles.module.scss';

const TRANSFORM_WRAPPER_OPTIONS = {
  minScale: 0.3,
  limitToWrapper: true,
  limitToBounds: true,
  centerContent: true,
};

interface IProps {
  seeds: IBracketSeed[];
  games: IBracketGame[];
  onRemove: (gameIndex: number) => void;
}

const Brackets = (props: IProps) => {
  const { games, onRemove } = props;

  const getRoundTitle = (grid: string, round: string, gamesLength: number) => {
    if (grid !== '1') return;
    if (
      grids![grid][round]?.length <
        grids![grid][Number(round) + 1]?.length * 2 ||
      Number(round) <= 0
    ) {
      return '';
    }

    switch (gamesLength) {
      case 8:
        return 'Sweet 16';
      case 4:
        return 'Elite Eight';
      case 2:
        return 'Final Four';
      case 1:
        return 'Championship';
    }
  };

  const [grids, setNewGrids] = useState<
    { [key: string]: { [key: string]: IBracketGame[] } } | undefined
  >(undefined);

  const [playInRound, setPlayInRound] = useState<
    { [key: string]: IBracketGame[] } | undefined
  >();

  const [visualScale, setVisualScale] = useState(0.7);

  const [hidden, setHidden] = useState<any>();

  const getPosByIndex = (index: number, games: IBracketGame[]) => {
    const gameDepend = games.map(v => ({
      index: v.index,
      awayDependsUpon: v.awayDependsUpon,
      homeDependsUpon: v.homeDependsUpon,
    }));

    const thisIndex = index + 1;
    const foundGameIndex = gameDepend.find(
      item =>
        item.awayDependsUpon &&
        item.homeDependsUpon &&
        Math.round((item.awayDependsUpon + item.homeDependsUpon) / 2) / 2 ===
          thisIndex
    )?.index;

    return games.find(item => item.index === foundGameIndex);
  };

  useEffect(() => {
    const grids = groupBy(games, 'gridNum');
    const newGrids = {};

    keys(grids).forEach(key => (newGrids[key] = groupBy(grids[key], 'round')));

    if (newGrids[1][1]?.length < newGrids[1][2]?.length) {
      setPlayInRound({
        1: setInPlayGames(newGrids[1][1], newGrids[1][2]),
      });
      delete newGrids[1][1];
    }

    keys(newGrids).forEach(gridKey =>
      Object.keys(newGrids[gridKey])
        .sort((a, b) => +a - +b)
        .map((key, i, arr) => {
          const thisRound = newGrids[gridKey][key];
          const nextRound = newGrids[gridKey][arr[i + 1]];

          if (
            nextRound &&
            nextRound.length > thisRound.length &&
            nextRound.length - thisRound.length !== 1
          ) {
            const games = [...thisRound].filter((v: any) => !v?.hidden);
            newGrids[gridKey][key] = [];

            [...Array(Math.round(nextRound.length / 2))].map((_, i) =>
              newGrids[gridKey][key].push(
                getPosByIndex(i, games) || { hidden: true }
              )
            );
          }
        })
    );

    setNewGrids(newGrids);
  }, [games]);

  useEffect(() => {
    if (playInRound && grids) {
      const hiddenConnectors = setHiddenConnectors(playInRound[1], grids[1][2]);
      setHidden(hiddenConnectors);
    }
  }, [playInRound, grids]);

  useEffect(() => {
    setVisualScale(0.7);
  }, [grids]);

  const setHiddenConnectors = (leftRound: any[], rightRound: any[]) => {
    console.log(leftRound, rightRound);
    if (!leftRound || !rightRound) return;

    const arr: any[] = [];

    if (leftRound.length < rightRound.length) {
      [...Array(leftRound.length)].forEach((_, i) => {
        arr.push({
          hiddenTop: leftRound[i]?.hidden,
          hiddenBottom: leftRound[i]?.hidden,
        });
      });
    } else {
      [...Array(Math.round(leftRound.length / 2))].forEach((_, i) => {
        arr.push({
          hiddenTop: leftRound[i * 2]?.hidden,
          hiddenBottom: leftRound[i * 2 + 1]?.hidden,
        });
      });
    }

    return arr;
  };

  const setInPlayGames = (games: IBracketGame[], nextGames: IBracketGame[]) => {
    const arr = [...Array(nextGames.length * 2)];
    const order = [1, 3, 5, 7, 6, 4, 2];
    order.forEach((v, i) => (arr[v] = games[i]));

    return arr.map((item, ind) => ({
      ...item,
      hidden: ind === 0 || !item,
    }));
  };

  return (
    <div className={styles.container}>
      <TransformWrapper
        defaultScale={visualScale}
        options={{ ...TRANSFORM_WRAPPER_OPTIONS, disabled: false }}
      >
        <TransformComponent>
          {grids &&
            keys(grids).map(gridKey => (
              <div key={`${gridKey}-grid`} className={styles.bracketContainer}>
                {gridKey === '1' &&
                  keys(playInRound)?.map(roundKey => (
                    <Fragment key={`${roundKey}-playInRound`}>
                      <BracketRound
                        games={playInRound![roundKey]}
                        onDrop={() => {}}
                        title="Play-In Games"
                        onRemove={onRemove}
                      />
                      <BracketConnector
                        hidden={hidden}
                        leftGamesNum={playInRound![roundKey]?.length}
                        rightGamesNum={grids[gridKey][1]?.length}
                      />
                    </Fragment>
                  ))}
                {keys(grids[gridKey])
                  .sort((a, b) => Number(a) - Number(b))
                  .map((roundKey, index, arr) => (
                    <Fragment key={`${roundKey}-playInRound`}>
                      <BracketRound
                        games={grids[gridKey][roundKey]}
                        onDrop={() => {}}
                        title={getRoundTitle(
                          gridKey,
                          roundKey,
                          grids[gridKey][roundKey].length
                        )}
                        onRemove={onRemove}
                      />
                      {index < arr.length - 1 ? (
                        <BracketConnector
                          leftGamesNum={grids[gridKey][roundKey].length}
                          rightGamesNum={grids[gridKey][arr[index + 1]].length}
                          hidden={
                            grids[gridKey][roundKey].some(v => v.hidden)
                              ? setHiddenConnectors(
                                  grids[gridKey][roundKey],
                                  grids[gridKey][arr[index + 1]]
                                )
                              : undefined
                          }
                        />
                      ) : null}
                    </Fragment>
                  ))}
              </div>
            ))}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Brackets;
