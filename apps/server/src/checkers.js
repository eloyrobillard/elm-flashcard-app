/**
 * @param {string} input
 */
export const isValidFormat = (input) => {
  if (!input) return false;

  const byNewline = input.split("\n");
  const byComma = byNewline.map((subs) => subs.split(","));

  return byComma.every((entry) => entry.length === 2);
};
