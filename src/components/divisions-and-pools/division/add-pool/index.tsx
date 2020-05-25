import React from 'react';
import Input from 'components/common/input';
import styles from './styles.module.scss';
import Button from 'components/common/buttons/button';
import { BindingCbWithOne, BindingAction, IDivision } from 'common/models';
import { PopupExposure } from 'components/common';

interface IAddPoolState {
  divisions_id?: string;
  pool_name: string;
  pool_tag: string;
  isModalConfirmOpen: boolean;
}

interface IAddPoolProps {
  division: IDivision;
  numOfTeams: number;
  savePool: BindingCbWithOne<Partial<IAddPoolState>>;
  onClose: BindingAction;
}

class AddPool extends React.Component<IAddPoolProps, IAddPoolState> {
  state = {
    division_id: this.props.division.division_id,
    pool_name: '',
    pool_tag: '',
    isModalConfirmOpen: false,
  };

  onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ pool_name: e.target.value });
  };

  onTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ pool_tag: e.target.value });
  };

  onModalClose = () => {
    this.setState({ isModalConfirmOpen: false });
  };

  onCancelClick = () => {
    const changesAreMade = !!this.state.pool_name || !!this.state.pool_tag;
    if (changesAreMade) {
      this.setState({ isModalConfirmOpen: true });
    } else {
      this.props.onClose();
    }
  };

  onSave = () => {
    const { division_id, pool_name, pool_tag } = this.state;

    const data = {
      division_id,
      pool_name,
      pool_tag: pool_tag
        ? pool_tag
        : `${this.props.division.short_name}${pool_name}`,
    };
    this.props.savePool(data);
    this.props.onClose();
  };

  render() {
    const { division } = this.props;
    const { pool_name, pool_tag } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.sectionTitle}>Add Pool</div>
        <div className={styles.sectionRow}>
          <Input
            width="221px"
            label="Name"
            value={pool_name || ''}
            autofocus={true}
            onChange={this.onNameChange}
          />
          <Input
            width="221px"
            label="Tag"
            startAdornment="@"
            value={pool_tag || ''}
            onChange={this.onTagChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <span className={styles.title}>Division:</span>{' '}
          {division.short_name || '—'}
        </div>
        <div className={styles.sectionItem}>
          <span className={styles.title}>Teams:</span> {this.props.numOfTeams}
        </div>
        <div className={styles.buttonsGroup}>
          <Button
            label="Cancel"
            variant="text"
            color="secondary"
            onClick={this.onCancelClick}
          />
          <Button
            label="Save"
            variant="contained"
            color="primary"
            onClick={this.onSave}
          />
        </div>
        <PopupExposure
          isOpen={this.state.isModalConfirmOpen}
          onClose={this.onModalClose}
          onExitClick={this.props.onClose}
          onSaveClick={this.onSave}
        />
      </div>
    );
  }
}

export default AddPool;
