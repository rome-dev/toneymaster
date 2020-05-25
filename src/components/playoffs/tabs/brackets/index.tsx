import React, { Component } from 'react';
import { CardMessageTypes } from 'components/common/card-message/types';
import { getIcon } from 'helpers';
import { Icons } from 'common/enums';
import { Select, CardMessage, Button } from 'components/common';
import Seed from 'components/playoffs/dnd/seed';
import Brackets from 'components/playoffs/brackets';
import { IBracketGame, IBracketSeed } from 'components/playoffs/bracketGames';
import { IDivision } from 'common/models';
import AddGameModal, { IOnAddGame } from '../../add-game-modal';
import RemoveGameModal from '../../remove-game-modal';
import styles from './styles.module.scss';

interface IProps {
  divisions: IDivision[];
  historyLength: number;
  seeds?: IBracketSeed[];
  bracketGames?: IBracketGame[];
  addGame: (selectedDivision: string, data: IOnAddGame) => void;
  removeGame: (selectedDivision: string, data: number) => void;
  onUndoClick: () => void;
}

interface IState {
  selectedDivision?: string;
  divisionsOptions?: { label: string; value: string }[];
  divisionGames?: IBracketGame[];
  addGameModalOpen: boolean;
  removeGameIndex: number | null;
}

class BracketManager extends Component<IProps> {
  dragType = 'seed';
  state: IState = {
    addGameModalOpen: false,
    removeGameIndex: null,
  };

  componentDidMount() {
    const { divisions } = this.props;
    const divisionsOptions = divisions.map(item => ({
      label: item.short_name,
      value: item.division_id,
    }));

    this.setState({
      divisionsOptions,
      selectedDivision: divisionsOptions[0]?.value,
    });
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    const { bracketGames } = this.props;
    const { selectedDivision } = this.state;

    if (
      prevProps.bracketGames !== bracketGames ||
      prevState?.selectedDivision !== this.state.selectedDivision
    ) {
      const divisionGames = bracketGames?.filter(
        game => game.divisionId === selectedDivision
      );
      this.setState({ divisionGames });
    }
  }

  addGamePressed = () => {
    this.setState({ addGameModalOpen: true });
  };

  onAddGame = (game: IOnAddGame) => {
    const { selectedDivision } = this.state;
    this.props.addGame(selectedDivision!, game);
    this.setState({ addGameModalOpen: false });
  };

  removeGamePressed = (gameIndex: number) => {
    this.setState({ removeGameIndex: gameIndex });
  };

  onRemoveGame = () => {
    const { removeGameIndex, selectedDivision } = this.state;
    if (!removeGameIndex || !selectedDivision) return;
    this.props.removeGame(selectedDivision, removeGameIndex);
    this.setState({ removeGameIndex: null });
  };

  onChangeSelect = (e: any) => {
    this.setState({
      selectedDivision: e.target.value,
    });
  };

  renderSeed = (item: any, index: number) => {
    return (
      <div key={`${index}-renderSeed`} className={styles.singleSeedWrapper}>
        <span>{index + 1}.</span>
        <Seed
          key={item.id}
          id={item.id}
          name={item.name}
          type={this.dragType}
        />
      </div>
    );
  };

  render() {
    const { seeds, onUndoClick, historyLength } = this.props;
    const {
      divisionGames,
      divisionsOptions,
      selectedDivision,
      addGameModalOpen,
      removeGameIndex,
    } = this.state;

    const seedsLength = seeds?.length || 0;
    const playInGamesExist = !!(
      seedsLength -
      2 ** Math.floor(Math.log2(seedsLength))
    );

    return (
      <section className={styles.container}>
        <div className={styles.seedsContainer}>
          {divisionsOptions && selectedDivision && (
            <Select
              label="Division"
              options={divisionsOptions}
              value={selectedDivision}
              onChange={this.onChangeSelect}
            />
          )}

          <div className={styles.seedsWrapper}>
            <h4>Seeds</h4>
            <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
              Drag & drop to reorder
            </CardMessage>
            <div className={styles.seedsList}>
              {seeds?.map((v, i) => this.renderSeed(v, i))}
            </div>
          </div>
        </div>

        <div className={styles.bodyWrapper}>
          <div className={styles.bracketActions}>
            <div className={styles.cardMessage}>
              <CardMessage
                type={CardMessageTypes.EMODJI_OBJECTS}
                style={{ maxWidth: 400 }}
              >
                Drag, drop, and zoom to navigate the bracket
              </CardMessage>
              <Button
                label="+ Add Game"
                variant="text"
                color="secondary"
                onClick={this.addGamePressed}
              />
            </div>
            <div className={styles.buttonsWrapper}>
              <Button
                label="Undo"
                icon={getIcon(Icons.SETTINGS_BACKUP_RESTORE)}
                disabled={!historyLength || historyLength < 2}
                variant="text"
                color="secondary"
                onClick={onUndoClick}
              />
              <Button
                label="Go to Bracket Setup"
                variant="text"
                color="secondary"
                icon={getIcon(Icons.EDIT)}
              />
              <Button
                label="See Team Lineup"
                variant="text"
                color="secondary"
                icon={getIcon(Icons.EYE)}
              />
              <Button
                label="Advance Division Teams to Brackets"
                variant="contained"
                color="primary"
              />
            </div>
          </div>
          {addGameModalOpen && (
            <AddGameModal
              isOpen={addGameModalOpen}
              bracketGames={divisionGames?.filter(item => !item.hidden)!}
              playInGamesExist={playInGamesExist}
              onClose={() => this.setState({ addGameModalOpen: false })}
              onAddGame={this.onAddGame}
            />
          )}
          {removeGameIndex && (
            <RemoveGameModal
              isOpen={!!removeGameIndex}
              gameIndex={removeGameIndex}
              onClose={() => this.setState({ removeGameIndex: null })}
              onRemoveGame={this.onRemoveGame}
            />
          )}
          {seeds && divisionGames && (
            <Brackets
              games={divisionGames}
              seeds={seeds}
              onRemove={this.removeGamePressed}
            />
          )}
        </div>
      </section>
    );
  }
}

export default BracketManager;
