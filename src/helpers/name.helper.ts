const generateAbbrName = (title: string) =>
  title.replace(/(\d*\w)\w*\W*/g, (_, i) => i.toUpperCase());

const getDivisionCutName = (divisionName: string) =>
  Boolean(Number(divisionName))
    ? divisionName.slice(-2)
    : divisionName.slice(0, 3);

export { generateAbbrName, getDivisionCutName };
