import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Button } from 'components/common';
import { getIcon } from 'helpers';
import { BindingAction } from 'common/models';
import { ButtonColors, ButtonVarian, Routes, Icons } from 'common/enums';
import styles from '../styles.module.scss';

const ICON_STYLES = {
  marginRight: '5px',
};

interface Props {
  onCsvLoaderBtn: BindingAction;
  onAddDivision: BindingAction;
  toggleLibraryPopup: BindingAction;
}

const Navigation = ({
  onCsvLoaderBtn,
  onAddDivision,
  toggleLibraryPopup,
}: Props) => (
  <Paper sticky={true}>
    <div className={styles.mainMenu}>
      <div className={styles.btnsWraper}>
        <p className={styles.loadBtsWrapper}>
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
            color={ButtonColors.SECONDARY}
            variant={ButtonVarian.TEXT}
            onClick={onCsvLoaderBtn}
            label="Import from CSV"
          />
        </p>
        <Button
          variant={ButtonVarian.CONTAINED}
          color={ButtonColors.PRIMARY}
          onClick={onAddDivision}
          label="+ Add Division"
        />
      </div>
    </div>
  </Paper>
);

export default Navigation;
