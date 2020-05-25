import React, { useState } from 'react';
import { Modal, HeadingLevelTwo, Input, Button } from 'components/common';
import { getIcon, getTimeFromString } from 'helpers';
import {
  Icons,
  ButtonColors,
  ButtonVarian,
  ButtonFormTypes,
} from 'common/enums';
import styles from '../popup-edit-schedule/styles.module.scss';
import DeletePopupConfrim from 'components/common/delete-popup-confirm';
import { ISchedulingBracket } from 'common/models/playoffs/bracket';
import moment from 'moment';

const DELETE_ICON_STYLES = {
  marginRight: '5px',
  fill: '#FF0F19',
};

interface Props {
  bracket: ISchedulingBracket;
  onClose: () => void;
  onSubmit: (bracket: ISchedulingBracket) => void;
  onDelete: (bracketId: string) => void;
}

const PopupEditBracket = ({ bracket, onClose, onSubmit, onDelete }: Props) => {
  const [editedBracket, setEditedBracket] = React.useState<ISchedulingBracket>(
    bracket
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
    setEditedBracket({ ...editedBracket, [name]: value });

  const localSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();

    onSubmit(editedBracket);

    if (editedBracket.name) {
      onClose();
    }
  };

  const localDelete = () => {
    onDelete(editedBracket.id);
    onClose();
  };

  const deleteMessage = `You are about to delete this bracket and this cannot be undone.
  Please, enter the name of the bracket to continue.`;

  return (
    <Modal isOpen={Boolean(bracket)} onClose={onClose}>
      <section className={styles.popupWrapper}>
        <div className={styles.titleWrapper}>
          <HeadingLevelTwo>Edit Bracket</HeadingLevelTwo>
        </div>
        <form onSubmit={localSubmit}>
          <div className={styles.inputWrapper}>
            <Input
              onChange={localChange}
              value={editedBracket.name || ''}
              name={'name'}
              label="Name"
              autofocus={true}
              width="220px"
            />
            {/* <Input
              onChange={localChange}
              value={editedBracket.schedule_tag || ''}
              name={ArchitectFormFields.SCHEDULT_TAG}
              label="Tag"
              width="220px"
              startAdornment="@"
            /> */}
          </div>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <td>
                  <b>Warmup: </b>
                  {getTimeFromString(editedBracket.warmup, 'minutes')} mins
                </td>
                <td>
                  <b>Brackets Date: </b>
                  {moment(editedBracket.bracketDate).format('LLL')}
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
                label="Delete Bracket"
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
          type={'bracket'}
          message={deleteMessage}
          deleteTitle={editedBracket.name}
          isOpen={isDeleteModalOpen}
          onClose={onModalClose}
          onDeleteClick={localDelete}
        />
      </section>
    </Modal>
  );
};

export default PopupEditBracket;
