import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import moment from 'moment';
import TableThead from './components/table-thead';
import TableTbody from './components/table-tbody';
import { HeaderSchedule, PrintedDate } from '../common';
import { IEventDetails, ISchedule } from 'common/models';
import { IGame } from 'components/common/matrix-table/helper';
import { IField } from 'common/models/schedule/fields';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import {
  getFieldsByFacility,
  getGamesByDays,
  getGamesByFacility,
} from '../helpers';
import { DEFAUL_COLUMNS_COUNT } from './common';
import { styles } from './styles';

interface IPDFProps {
  event: IEventDetails;
  games: IGame[];
  fields: IField[];
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
  schedule: ISchedule;
  isHeatMap?: boolean;
}

const PDFScheduleTable = ({
  event,
  fields,
  facilities,
  games,
  timeSlots,
  schedule,
  isHeatMap,
}: IPDFProps) => {
  const gamesByDays = getGamesByDays(games);

  return (
    <Document>
      {Object.keys(gamesByDays).map(day => {
        const gamesByDay = gamesByDays[day];

        return facilities.map(facility => {
          const fieldsByFacility = getFieldsByFacility(fields, facility);
          const gamesByFacility = getGamesByFacility(gamesByDay, facility);

          return fieldsByFacility.reduce((acc, field, idx) => {
            let splitIdx = 0;

            if (idx % DEFAUL_COLUMNS_COUNT === 0 || idx === 0) {
              if (idx > 0) splitIdx += idx;

              return [
                ...acc,
                <Page
                  size="A4"
                  orientation="landscape"
                  style={styles.page}
                  key={field.id}
                >
                  <HeaderSchedule event={event} schedule={schedule} />
                  <View style={styles.tableWrapper} key={facility.id}>
                    <View style={styles.facilityTitle}>
                      <Text style={styles.scheduleDate}>
                        {moment(day).format('l')}
                      </Text>
                      <Text style={styles.scheduleFacility}>
                        {facility.name}
                      </Text>
                    </View>
                    <View key={field.id}>
                      <TableThead
                        facility={facility}
                        fields={fieldsByFacility}
                        splitIdx={splitIdx}
                      />
                      <TableTbody
                        timeSlots={timeSlots}
                        games={gamesByFacility}
                        splitIdx={splitIdx}
                        isHeatMap={isHeatMap}
                      />
                    </View>
                  </View>
                  <PrintedDate />
                  <Text
                    style={styles.pageNumber}
                    render={({ pageNumber, totalPages }) =>
                      `${pageNumber} / ${totalPages}`
                    }
                    fixed
                  />
                </Page>,
              ];
            } else {
              return acc;
            }
          }, [] as JSX.Element[]);
        });
      })}
    </Document>
  );
};

export default PDFScheduleTable;
