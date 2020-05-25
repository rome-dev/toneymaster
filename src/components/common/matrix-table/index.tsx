import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { selectProperGamesPerTimeSlot, IGame } from './helper';
import RenderFieldHeader from './field-header';
import RenderTimeSlot from './time-slot';
import NavControls from './nav-controls';
import { IField } from 'common/models/schedule/fields';
import styles from './styles.module.scss';
import './styles.scss';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { IDropParams } from './dnd/drop';
import { ITeamCard } from 'common/models/schedule/teams';
import { TableScheduleTypes } from 'common/enums';
import { BindingAction } from 'common/models';

const TRANSFORM_WRAPPER_OPTIONS = {
  minScale: 0.1,
  limitToWrapper: true,
};

interface IProps {
  tableType: TableScheduleTypes;
  games: IGame[];
  fields: IField[];
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
  disableZooming: boolean;
  moveCard: (dropParams: IDropParams) => void;
  showHeatmap: boolean;
  isEnterScores?: boolean;
  onTeamCardUpdate: (teamCard: ITeamCard) => void;
  onTeamCardsUpdate: (teamCards: ITeamCard[]) => void;
  teamCards: ITeamCard[];
  isFullScreen?: boolean;
  onToggleFullScreen?: BindingAction;
  highlightedGameId?: number;
}

interface IPinchProps {
  zoomIn: BindingAction;
  zoomOut: BindingAction;
}

const SchedulesMatrix = (props: IProps) => {
  const {
    tableType,
    fields,
    timeSlots,
    games,
    facilities,
    showHeatmap,
    isEnterScores,
    moveCard,
    disableZooming,
    onTeamCardUpdate,
    onTeamCardsUpdate,
    teamCards,
    isFullScreen,
    onToggleFullScreen,
    highlightedGameId,
  } = props;

  const takeFacilityByFieldId = (facilityId: string) =>
    facilities.find(facility => facility.id === facilityId);

  return (
    <section className={styles.section}>
      <h3 className="visually-hidden">Table</h3>
      <div className={`matrix-table__table-wrapper ${styles.tableWrapper}`}>
        <TransformWrapper
          defaultPositionX={0.01}
          defaultPositionY={20}
          defaultScale={0.3}
          options={{ ...TRANSFORM_WRAPPER_OPTIONS, disabled: disableZooming }}
        >
          {({ zoomIn, zoomOut }: IPinchProps) => (
            <>
              <NavControls
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                isFullScreen={isFullScreen}
                onToggleFullScreen={onToggleFullScreen}
              />
              <TransformComponent>
                <table className={styles.table}>
                  <tbody>
                    <tr>
                      <td />
                      {fields
                        .filter(field => !field.isUnused)
                        .map((field: IField) => (
                          <RenderFieldHeader
                            tableType={tableType}
                            key={field.id}
                            field={field}
                            facility={takeFacilityByFieldId(field.facilityId)}
                            onTeamCardsUpdate={onTeamCardsUpdate}
                            games={games}
                            teamCards={teamCards}
                          />
                        ))}
                    </tr>
                    {timeSlots.map((timeSlot: ITimeSlot) => (
                      <RenderTimeSlot
                        tableType={tableType}
                        key={timeSlot.id}
                        timeSlot={timeSlot}
                        fields={fields}
                        games={selectProperGamesPerTimeSlot(timeSlot, games)}
                        moveCard={moveCard}
                        showHeatmap={showHeatmap}
                        isEnterScores={isEnterScores}
                        onTeamCardUpdate={onTeamCardUpdate}
                        teamCards={teamCards}
                        onTeamCardsUpdate={onTeamCardsUpdate}
                        isDndMode={disableZooming}
                        highlightedGamedId={highlightedGameId}
                      />
                    ))}
                  </tbody>
                </table>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </section>
  );
};

export default SchedulesMatrix;
