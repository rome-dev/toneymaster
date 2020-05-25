import React from 'react';
import { Button, HeadingLevelThree, Paper, Tooltip } from 'components/common';
import styles from './styles.module.scss';
import { TooltipMessageTypes } from 'components/common/tooltip-message/types';

const publishBtnStyles = {
  width: 180,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

interface IProps {
  scheduleName: string;
  savingInProgress?: boolean;
  schedulePublished?: boolean;
  anotherSchedulePublished?: boolean;
  isFullScreen: boolean;
  onClose: () => void;
  onSaveDraft: () => void;
  onUnpublish: () => void;
  saveAndPublish: () => void;
}

export default (props: IProps) => {
  const {
    scheduleName,
    savingInProgress,
    onClose,
    onSaveDraft,
    onUnpublish,
    saveAndPublish,
    schedulePublished,
    anotherSchedulePublished,
    isFullScreen,
  } = props;

  return (
    <div className={styles.paperWrapper}>
      <Paper>
        <div className={styles.paperContainer}>
          <div>
            <HeadingLevelThree>
              <span>{scheduleName}</span>
            </HeadingLevelThree>
          </div>
          <div className={styles.btnsGroup}>
            {!isFullScreen && (
              <Button
                label="Close"
                variant="text"
                color="secondary"
                onClick={onClose}
              />
            )}
            <Button
              label={'Save'}
              variant="contained"
              color="primary"
              disabled={savingInProgress}
              onClick={onSaveDraft}
            />
            {schedulePublished && false ? (
              <Button
                label="Unpublish"
                variant="contained"
                color="primary"
                disabled={savingInProgress}
                onClick={onUnpublish}
              />
            ) : (
              false && (
                <Tooltip
                  disabled={!anotherSchedulePublished}
                  title="Another Schedule is already published"
                  type={TooltipMessageTypes.INFO}
                >
                  <div
                    style={{
                      display: 'inline',
                      marginLeft: '15px',
                      padding: '10px 0',
                    }}
                  >
                    <Button
                      btnStyles={publishBtnStyles}
                      label={'Save and Publish'}
                      variant="contained"
                      color="primary"
                      disabled={anotherSchedulePublished || savingInProgress}
                      onClick={saveAndPublish}
                    />
                  </div>
                </Tooltip>
              )
            )}
          </div>
        </div>
      </Paper>
    </div>
  );
};
