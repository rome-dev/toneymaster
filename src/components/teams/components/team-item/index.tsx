import React from 'react';
import Button from 'components/common/buttons/button';
import { getIcon } from 'helpers/get-icon.helper';
import { ITeam } from 'common/models';
import { Icons, ButtonColors, ButtonVarian, ButtonTypes } from 'common/enums';
import styles from './styles.module.scss';

const EDIT_ICON_STYLES = {
  width: '21px',
  marginRight: '5px',
  fill: '#00a3ea',
};

interface Props {
  team: ITeam;
  divisionName: string;
  poolName?: string;
  onEditPopupOpen: (
    team: ITeam,
    divisionName: string,
    poolName: string
  ) => void;
}

const TeamItem = ({ team, divisionName, poolName, onEditPopupOpen }: Props) => {
  const onEdit = () => onEditPopupOpen(team, divisionName, poolName || '');

  return (
    <tr className={styles.team}>
      <td className={styles.teamName}>{team.short_name}</td>
      <td className={styles.contactName}>{`${team.contact_first_name ||
        ''} ${team.contact_last_name || ''}`}</td>
      <td className={styles.phone_num}>{team.phone_num || ''}</td>
      <td className={styles.btnsWrapper}>
        <Button
          onClick={onEdit}
          icon={getIcon(Icons.EDIT, EDIT_ICON_STYLES)}
          variant={ButtonVarian.TEXT}
          color={ButtonColors.SECONDARY}
          type={ButtonTypes.ICON}
          label="Edit team"
        />
      </td>
    </tr>
  );
};

export default TeamItem;
