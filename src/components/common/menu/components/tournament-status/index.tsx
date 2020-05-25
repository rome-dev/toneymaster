import React from 'react';
import { ProgressBar, Button, Tooltip } from 'components/common';
import { getIcon } from 'helpers';
import { ButtonColors, ButtonVarian, EventStatuses, Icons } from 'common/enums';
import styles from './styles.module.scss';
import { BindingAction } from 'common/models';

interface Props {
  tournamentStatus: EventStatuses;
  percentOfCompleted: number;
  toggleTournamentStatus?: BindingAction;
}

const TournamentStatus = ({
  percentOfCompleted,
  tournamentStatus,
  toggleTournamentStatus,
}: Props) => {
  if (!toggleTournamentStatus) {
    return null;
  }

  return (
    <div className={styles.progressBarWrapper}>
      <div className={styles.progressBarStatusWrapper}>
        <p className={styles.progressBarStatus}>
          <span>Status:</span> {EventStatuses[tournamentStatus]}
        </p>
        {tournamentStatus === EventStatuses.Draft && (
          <p className={styles.progressBarComplete}>
            <output>{`${percentOfCompleted}% `}</output>
            Complete
          </p>
        )}
      </div>
      {tournamentStatus === EventStatuses.Draft ? (
        <>
          <ProgressBar completed={percentOfCompleted} />
          {percentOfCompleted === 100 && (
            <Tooltip
              title="Only click publish when this checklist is 100% complete"
              type="info"
            >
              <span className={styles.doneBtnWrapper}>
                <Button
                  onClick={toggleTournamentStatus}
                  icon={getIcon(Icons.DONE)}
                  label="Publish Tournament"
                  color={ButtonColors.INHERIT}
                  variant={ButtonVarian.CONTAINED}
                />
              </span>
            </Tooltip>
          )}
        </>
      ) : (
        <span className={styles.doneBtnWrapper}>
          <Button
            onClick={toggleTournamentStatus}
            label="Unpublish Tournament"
            color={ButtonColors.INHERIT}
            variant={ButtonVarian.CONTAINED}
          />
        </span>
      )}
    </div>
  );
};

export default TournamentStatus;
