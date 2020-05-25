import React, { useState } from 'react';
import DivisionItem from '../division-item';
import { SectionDropdown } from '../../../common';
import { IDivision, IPool, ITeam } from '../../../../common/models';
import { EventMenuTitles, SortByFilesTypes } from 'common/enums';
import styles from './styles.module.scss';
import Button from 'components/common/buttons/button';
import { sortByField } from 'helpers';

interface Props {
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
  loadPools: (divisionId: string) => void;
  onEditPopupOpen: (
    team: ITeam,
    divisionName: string,
    poolName: string
  ) => void;
}

const TeamManagement = ({
  divisions,
  teams,
  pools,
  loadPools,
  onEditPopupOpen,
}: Props) => {
  const [isSectionsExpand, toggleSectionCollapse] = useState<boolean>(true);

  const onToggleSectionCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSectionCollapse(!isSectionsExpand);
  };

  const sortedDivisions = sortByField(divisions, SortByFilesTypes.DIVISIONS);

  return (
    <li>
      <SectionDropdown
        id={EventMenuTitles.TEAM_MANAGEMENT}
        type="section"
        isDefaultExpanded={true}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Team Management</div>
          {divisions.length ? (
            <div className={styles.buttonContainer}>
              <Button
                label={isSectionsExpand ? 'Collapse All' : 'Expand All'}
                variant="text"
                color="secondary"
                onClick={onToggleSectionCollapse}
              />
            </div>
          ) : null}
        </div>
        <ul className={styles.divisionList}>
          {sortedDivisions.map(division => (
            <DivisionItem
              division={division}
              pools={pools.filter(
                pool => pool.division_id === division.division_id
              )}
              teams={teams}
              loadPools={loadPools}
              onEditPopupOpen={onEditPopupOpen}
              key={division.division_id}
              isSectionExpand={isSectionsExpand}
            />
          ))}
        </ul>
      </SectionDropdown>
    </li>
  );
};

export default TeamManagement;
