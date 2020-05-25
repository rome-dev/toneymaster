import React from 'react';
import SectionDropdown from '../../common/section-dropdown';
import DivisionDetails from './division-details';
import PoolsDetails from './pools-details';
import CreateIcon from '@material-ui/icons/Create';
import Button from '../../common/buttons/button';
import {
  IDivision,
  IPool,
  ITeam,
  BindingCbWithOne,
  BindingCbWithTwo,
} from 'common/models';
import styles from '../styles.module.scss';
import history from '../../../browserhistory';

interface IDivisionProps {
  division: IDivision;
  pools: IPool[];
  teams: ITeam[];
  getPools: BindingCbWithOne<string>;
  onAddPool: BindingCbWithOne<IDivision>;
  areDetailsLoading: boolean;
  eventId: string;
  divisions: IDivision[];
  isSectionExpand: boolean;
  saveTeams: BindingCbWithOne<ITeam[]>;
  editPool: BindingCbWithTwo<IPool, IPool[]>;
  deletePool: BindingCbWithTwo<IPool, ITeam[]>;
}

class Division extends React.PureComponent<IDivisionProps> {
  componentDidMount() {
    const { division } = this.props;

    this.props.getPools(division.division_id);
  }

  onEditDivisionDetails = (divisionId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const path = this.props.eventId
      ? `/event/divisions-and-pools-edit/${this.props.eventId}`
      : '/event/divisions-and-pools-edit';
    history.push({
      pathname: path,
      state: { divisionId, pools: this.props.pools, teams: this.props.teams },
    });
  };

  render() {
    const { division, pools, teams, saveTeams } = this.props;

    return (
      <SectionDropdown
        id={division ? division.short_name : ''}
        panelDetailsType="flat"
        expanded={this.props.isSectionExpand}
      >
        <div className={styles.sectionTitle}>
          <div>Division: {division.long_name}</div>
          <div>
            <Button
              label="Edit Division Details"
              variant="text"
              color="secondary"
              icon={<CreateIcon />}
              onClick={this.onEditDivisionDetails(division.division_id)}
            />
          </div>
        </div>
        <div className={styles.sectionContent}>
          <DivisionDetails
            data={division}
            numOfPools={pools.length}
            numOfTeams={teams.length}
          />
          <PoolsDetails
            onAddPool={this.props.onAddPool}
            division={division}
            pools={pools}
            teams={teams}
            areDetailsLoading={this.props.areDetailsLoading}
            saveTeams={saveTeams}
            editPool={this.props.editPool}
            deletePool={this.props.deletePool}
          />
        </div>
      </SectionDropdown>
    );
  }
}

export default Division;
