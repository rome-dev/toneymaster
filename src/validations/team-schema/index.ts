import * as Yup from 'yup';

const teamSchema = Yup.object({
  long_name: Yup.string().required('Team long name is required to fill!'),
  short_name: Yup.string().required('Team short name is required to fill!'),
  division_id: Yup.string().required('Division is required to fill!'),
  phone_num: Yup.string()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      'Phone number must specified using the following format: [+][country code][subscriber number including area code].'
    )
    .nullable(),
});

export { teamSchema };
