import { IField } from 'common/models';

const getOrderFields = (fields: IField[]) => {
  const sortedFields = fields.reduce(
    (acc, field) => {
      return field.isNew
        ? {
            ...acc,
            newFields: [...acc.newFields, field],
          }
        : {
            ...acc,
            oldFields: [...acc.oldFields, field],
          };
    },
    {
      newFields: [] as IField[],
      oldFields: [] as IField[],
    }
  );

  const sortedOlsFields = getSortedFields(sortedFields.oldFields);

  return [...sortedOlsFields, ...sortedFields.newFields];
};

const getSortedFields = (fields: IField[]) => {
  const sortedFields = fields.sort((a, b) => {
    return (
      Number(b.is_premier_YN) - Number(a.is_premier_YN) ||
      a.field_name.localeCompare(b.field_name, undefined, { numeric: true })
    );
  });

  return sortedFields;
};

const getSortedFieldsByFacility = (fields: IField[]) => {
  const sortedFields = fields.sort((a, b) => {
    return (
      a.facilities_id.localeCompare(b.facilities_id, undefined, {
        numeric: true,
      }) ||
      Number(b.is_premier_YN) - Number(a.is_premier_YN) ||
      a.field_name.localeCompare(b.field_name, undefined, { numeric: true })
    );
  });

  return sortedFields;
};

export { getOrderFields, getSortedFieldsByFacility };
