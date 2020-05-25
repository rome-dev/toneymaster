import React, { useState } from 'react';
import { Modal, HeadingLevelTwo, Input, Button } from 'components/common';
import { BindingAction, BindingCbWithOne } from 'common/models';
import { getIcon } from 'helpers';
import {
  Icons,
  ButtonColors,
  ButtonVarian,
  ButtonFormTypes,
} from 'common/enums';
import { ISchedulingSchedule, ArchitectFormFields } from '../types';
import styles from './styles.module.scss';
import DeletePopupConfrim from 'components/common/delete-popup-confirm';

const DELETE_ICON_STYLES = {
  marginRight: '5px',
  fill: '#FF0F19',
};

interface Props {
  schedule: ISchedulingSchedule | null;
  onClose: BindingAction;
  onSubmit: BindingCbWithOne<ISchedulingSchedule>;
  onDelete: BindingCbWithOne<ISchedulingSchedule>;
}

const PopupEditSchedule = ({
  schedule,
  onClose,
  onSubmit,
  onDelete,
}: Props) => {
  const [editedSchedule, onChange] = React.useState<ISchedulingSchedule>(
    schedule!
  );

  const [isDeleteModalOpen, onDeleteModal] = useState(false);

  const onModalClose = () => {
    onDeleteModal(false);
  };

  const onDeleteClick = () => {
    onDeleteModal(true);
  };

  const localChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...editedSchedule, [name]: value });

  const localSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();

    onSubmit(editedSchedule);

    if (editedSchedule.schedule_name) {
      onClose();
    }
  };

  const localDelete = () => {
    onDelete(editedSchedule);
    onClose();
  };

  const deleteMessage = `You are about to delete this schedule and this cannot be undone. Deleting this schedule will also delete any brackets that use it.
  Please, enter the name of the schedule to continue.`;

  return (
    <Modal isOpen={Boolean(schedule)} onClose={onClose}>
      <section className={styles.popupWrapper}>
        <div className={styles.titleWrapper}>
          <HeadingLevelTwo>Edit Schedule</HeadingLevelTwo>
        </div>
        <form onSubmit={localSubmit}>
          <div className={styles.inputWrapper}>
            <Input
              onChange={localChange}
              value={editedSchedule.schedule_name || ''}
              name={ArchitectFormFields.SCHEDULE_NAME}
              label="Name"
              autofocus={true}
              width="220px"
            />
            <Input
              onChange={localChange}
              value={editedSchedule.schedule_tag || ''}
              name={ArchitectFormFields.SCHEDULT_TAG}
              label="Tag"
              width="220px"
              startAdornment="@"
            />
          </div>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <td>
                  <b>Divisions: </b>
                  {editedSchedule.num_divisions}
                </td>
                <td>
                  <b>Teams: </b>
                  {editedSchedule.num_teams}
                </td>
              </tr>
              <tr>
                <td>
                  <b>Playoffs: </b>
                  Yes
                </td>
                <td>
                  <b>Bracket Type: </b>
                  Single Elimination
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.btnsWrapper}>
            <p className={styles.dellBtnWrapper}>
              <Button
                onClick={onDeleteClick}
                icon={getIcon(Icons.DELETE, DELETE_ICON_STYLES)}
                variant={ButtonVarian.TEXT}
                color={ButtonColors.INHERIT}
                btnType={ButtonFormTypes.BUTTON}
                label="Delete Schedule &amp; Associated Brackets"
              />
            </p>
            <div className={styles.navBtnWrapper}>
              <p className={styles.cancelBtnWrapper}>
                <Button
                  onClick={onClose}
                  variant={ButtonVarian.TEXT}
                  color={ButtonColors.SECONDARY}
                  btnType={ButtonFormTypes.BUTTON}
                  label="Cancel"
                />
              </p>
              <Button
                variant={ButtonVarian.CONTAINED}
                color={ButtonColors.PRIMARY}
                btnType={ButtonFormTypes.SUBMIT}
                label="Save"
              />
            </div>
          </div>
        </form>
        <DeletePopupConfrim
          type={'schedule'}
          message={deleteMessage}
          deleteTitle={schedule?.schedule_name!}
          isOpen={isDeleteModalOpen}
          onClose={onModalClose}
          onDeleteClick={localDelete}
        />
      </section>
    </Modal>
  );
};

export default PopupEditSchedule;
