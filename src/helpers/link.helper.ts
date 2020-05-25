const stringToLink = (string: string) =>
  string
    .trim()
    .toLocaleLowerCase()
    .replace(/ /g, '-');

export { stringToLink };
