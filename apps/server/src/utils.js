export const errorf = (...errors) => {
  const error = errors.reduce((acc, cur) => acc + " " + cur);

  return `\x1b[31m[Error]\x1b[0m ${error}`;
};

export const okf = (...args) => {
  const message = args.reduce((acc, cur) => acc + " " + cur);

  return `\x1b[32m[Ok]\x1b[0m ${message}`;
};

export const infof = (...args) => {
  const message = args.reduce((acc, cur) => acc + " " + cur);

  return `\x1b[93m[Info]\x1b[0m ${message}`;
};
