import { IField } from 'common/models/schedule/fields';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { IGame } from 'components/common/matrix-table/helper';

const getFieldsByFacility = (fields: IField[], facility: IScheduleFacility) => {
  const filedsByFacility = fields.filter(
    field => field.facilityId === facility.id
  );

  return filedsByFacility;
};

const getGamesByField = (games: IGame[], field: IField) => {
  const gamesByFiled = games.filter(game => game.fieldId === field.id);

  return gamesByFiled;
};

const getGamesByFacility = (games: IGame[], facility: IScheduleFacility) => {
  const gamesByFacility = games.filter(
    (it: IGame) => it.facilityId === facility.id
  );

  return gamesByFacility;
};

const getGamesByDays = (games: IGame[]) => {
  const gamesByDays = games.reduce((acc, game) => {
    const day = game.gameDate;

    acc[day!] = acc[day!] ? [...acc[day!], game] : [game];

    return acc;
  }, {});

  return gamesByDays;
};

export {
  getFieldsByFacility,
  getGamesByField,
  getGamesByFacility,
  getGamesByDays,
};
