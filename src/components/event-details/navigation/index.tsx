import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Paper } from 'components/common';
import { getIcon } from 'helpers';
import { ButtonColors, ButtonVarian, Icons, Routes } from 'common/enums';
import { BindingAction } from 'common/models';
import styles from '../styles.module.scss';

const ICON_STYLES = {
  marginRight: '5px',
};

interface Props {
  isEventId: boolean;
  onCsvLoaderBtn: BindingAction;
  onCancelClick: BindingAction;
  onAddToLibraryManager: BindingAction;
  onSave: BindingAction;
}

const Navigation = ({
  isEventId,
  onCsvLoaderBtn,
  onCancelClick,
  onAddToLibraryManager,
  onSave,
}: Props) => (
  <Paper sticky={true}>
    <div className={styles.paperWrapper}>
      <div className={styles.loadBtnsWrapper}>
        {isEventId && (
          <Button
            onClick={onAddToLibraryManager}
            icon={getIcon(Icons.PUBLISH, ICON_STYLES)}
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
            label="Save to Library"
          />
        )}
        {!isEventId && (
          <>
            <Link className={styles.libraryBtn} to={Routes.LIBRARY_MANAGER}>
              {getIcon(Icons.GET_APP, ICON_STYLES)} Load From Library
            </Link>
            <Button
              onClick={onCsvLoaderBtn}
              color={ButtonColors.SECONDARY}
              variant={ButtonVarian.TEXT}
              label="Import from CSV"
            />
          </>
        )}
      </div>
      <div className={styles.btnsWrapper}>
        <Button
          color={ButtonColors.SECONDARY}
          variant={ButtonVarian.TEXT}
          onClick={onCancelClick}
          label="Cancel"
        />
        <Button
          color={ButtonColors.PRIMARY}
          variant={ButtonVarian.CONTAINED}
          onClick={onSave}
          label="Save"
        />
      </div>
    </div>
  </Paper>
);

export default Navigation;
