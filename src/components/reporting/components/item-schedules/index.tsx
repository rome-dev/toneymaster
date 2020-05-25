import React from 'react';
import PDFTableSchedule from 'pdg-layouts/table-schedule';
import PDFTableFieldsSchedule from 'pdg-layouts/table-fields-schedule';
import {
  HeadingLevelThree,
  ButtonLoad,
  SelectMultiple,
  CardMessage,
} from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import {
  onPDFSave,
  onXLSXSave,
  getAllTeamCardGames,
  getSelectDayOptions,
  getGamesByDays,
} from 'helpers';
import { ButtonVarian, ButtonColors, DefaultSelectValues } from 'common/enums';
import { IEventDetails, ISchedule, IPool } from 'common/models';
import { getScheduleTableXLSX } from '../../helpers';
import { IGame, calculateDays } from 'components/common/matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { ITeamCard } from 'common/models/schedule/teams';
import styles from './styles.module.scss';

const STYLES_ICOM_WARNING = {
  fill: '#FFCB00',
  height: '25px',
  width: '30px',
};

interface Props {
  event: IEventDetails;
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
  games: IGame[];
  fields: IField[];
  schedule: ISchedule;
  teamCards: ITeamCard[];
  pools: IPool[];
}

const ItemSchedules = ({
  event,
  facilities,
  timeSlots,
  games,
  fields,
  schedule,
  teamCards,
  pools,
}: Props) => {
  const [isAllowDownload, changeAllowDownload] = React.useState<boolean>(true);
  const [activeDay, changeActiveDay] = React.useState<string[]>([
    DefaultSelectValues.ALL,
  ]);

  React.useEffect(() => {
    changeAllowDownload(activeDay.length > 0);
  }, [activeDay]);

  const eventDays = calculateDays(teamCards);
  const allTeamCardGames = getAllTeamCardGames(teamCards, games, eventDays);
  const gamesByDay = getGamesByDays(allTeamCardGames, activeDay);
  const selectDayOptions = getSelectDayOptions(eventDays);

  const onChangeActiveDay = (avtiveDay: string[] | null) => {
    if (activeDay) {
      changeActiveDay(avtiveDay as string[]);
    }
  };

  const onScheduleTableSave = () =>
    onPDFSave(
      <PDFTableSchedule
        event={event}
        games={gamesByDay}
        fields={fields}
        timeSlots={timeSlots}
        facilities={facilities}
        schedule={schedule}
      />,
      event.event_name ? `${event.event_name} Master Schedule` : 'Schedule'
    );

  const onHeatmapScheduleTableSave = () =>
    onPDFSave(
      <PDFTableSchedule
        event={event}
        games={gamesByDay}
        fields={fields}
        timeSlots={timeSlots}
        facilities={facilities}
        schedule={schedule}
        isHeatMap={true}
      />,
      event.event_name
        ? `${event.event_name} Master Schedule (HeatMap)`
        : 'Schedule'
    );

  const onScheduleFieldsSave = () =>
    onPDFSave(
      <PDFTableFieldsSchedule
        event={event}
        games={gamesByDay}
        fields={fields}
        timeSlots={timeSlots}
        facilities={facilities}
        schedule={schedule}
      />,
      event.event_name
        ? `${event.event_name} Master Fields Schedule`
        : 'FieldsSchedule'
    );

  const onScheduleTableXLSXSave = async () => {
    const { header, body } = await getScheduleTableXLSX(
      event,
      schedule,
      games,
      teamCards,
      facilities,
      fields,
      pools
    );

    onXLSXSave(header, body, 'Master Schedule');
  };

  return (
    <li>
      <section>
        <header className={styles.headerWrapper}>
          <HeadingLevelThree>
            <span>Schedules</span>
          </HeadingLevelThree>
          <SelectMultiple
            options={selectDayOptions}
            value={activeDay}
            onChange={onChangeActiveDay}
            primaryValue={DefaultSelectValues.ALL}
            isFormControlRow={true}
            label="Event day: "
          />
        </header>
        <ul className={styles.scheduleList}>
          <li>
            <ButtonLoad
              loadFunc={onScheduleTableSave}
              variant={ButtonVarian.TEXT}
              color={ButtonColors.SECONDARY}
              isDisabled={!isAllowDownload}
              label="Master Schedule"
            />
          </li>
          <li>
            <ButtonLoad
              loadFunc={onHeatmapScheduleTableSave}
              variant={ButtonVarian.TEXT}
              color={ButtonColors.SECONDARY}
              isDisabled={!isAllowDownload}
              label="Master Schedule (with Heatmap)"
            />
          </li>
          <li>
            <ButtonLoad
              loadFunc={onScheduleFieldsSave}
              variant={ButtonVarian.TEXT}
              color={ButtonColors.SECONDARY}
              isDisabled={!isAllowDownload}
              label="Master Schedule (by fields)"
            />
          </li>
          <li>
            <ButtonLoad
              loadFunc={onScheduleTableXLSXSave}
              variant={ButtonVarian.TEXT}
              color={ButtonColors.SECONDARY}
              label="Master Schedule (XLSX)"
            />
          </li>
        </ul>
        {!isAllowDownload && (
          <CardMessage
            type={CardMessageTypes.WARNING}
            iconStyle={STYLES_ICOM_WARNING}
          >
            Select day to download PDF-files
          </CardMessage>
        )}
      </section>
    </li>
  );
};

export default ItemSchedules;
