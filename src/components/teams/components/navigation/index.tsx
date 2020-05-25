import React from 'react';
import Button from 'components/common/buttons/button';
import { BindingAction } from 'common/models';
import styles from './styles.module.scss';
import { History } from 'history';
import { ButtonVarian, ButtonColors } from 'common/enums';

interface Props {
  onSaveClick: BindingAction;
  onCancelClick: BindingAction;
  eventId: string | undefined;
  history: History;
  onImportFromCsv: BindingAction;
}

const Navigation = ({
  onSaveClick,
  onCancelClick,
  eventId,
  history,
  onImportFromCsv,
}: Props) => {
  const onCreateTeam = () => {
    const path = eventId
      ? `/event/teams-create/${eventId}`
      : '/event/teams-create';

    history.push(path);
  };

  return (
    <div className={styles.navWrapper}>
      <Button
        onClick={onImportFromCsv}
        variant={ButtonVarian.TEXT}
        color={ButtonColors.SECONDARY}
        label="Import from CSV"
      />
      <span className={styles.btnsWrapper}>
        <Button
          onClick={onCancelClick}
          variant={ButtonVarian.TEXT}
          color={ButtonColors.SECONDARY}
          label="Cancel"
        />
        <Button
          onClick={onSaveClick}
          variant={ButtonVarian.CONTAINED}
          color={ButtonColors.PRIMARY}
          label="Save"
        />
        <Button
          onClick={onCreateTeam}
          variant={ButtonVarian.CONTAINED}
          color={ButtonColors.PRIMARY}
          label="Create Team"
        />
      </span>
    </div>
  );
};

export default Navigation;
