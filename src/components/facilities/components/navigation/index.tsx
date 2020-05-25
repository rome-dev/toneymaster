import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'components/common';
import { getIcon } from 'helpers';
import { BindingAction } from 'common/models';
import { ButtonVarian, ButtonColors, Icons, Routes } from 'common/enums';
import styles from './styles.module.scss';

const ICON_STYLES = {
  marginRight: '5px',
};

interface Props {
  onClick: BindingAction;
  onCancelClick: BindingAction;
  onCsvLoaderBtn: BindingAction;
  toggleLibraryPopup: BindingAction;
}

const Navigation = ({
  onClick,
  onCancelClick,
  onCsvLoaderBtn,
  toggleLibraryPopup,
}: Props) => (
  <p className={styles.wrapper}>
    <span className={styles.linkWrapper}>
      <Link className={styles.libraryBtn} to={Routes.LIBRARY_MANAGER}>
        {getIcon(Icons.GET_APP, ICON_STYLES)} Load From Library
      </Link>
      <Button
        onClick={toggleLibraryPopup}
        icon={getIcon(Icons.PUBLISH, ICON_STYLES)}
        variant={ButtonVarian.TEXT}
        color={ButtonColors.SECONDARY}
        label="Save to Library"
      />
      <Button
        onClick={onCsvLoaderBtn}
        variant={ButtonVarian.TEXT}
        color={ButtonColors.SECONDARY}
        label="Import from CSV"
      />
    </span>
    <span className={styles.btnsWrapper}>
      <Button
        onClick={onCancelClick}
        variant={ButtonVarian.TEXT}
        color={ButtonColors.SECONDARY}
        label="Cancel"
      />
      <Button
        onClick={onClick}
        variant={ButtonVarian.CONTAINED}
        color={ButtonColors.PRIMARY}
        label="Save"
      />
    </span>
  </p>
);

export default Navigation;
