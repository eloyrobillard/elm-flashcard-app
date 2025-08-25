/**
 * @param {string} input
 */
export const isValidFormat = (input) => {
  if (!input) return { succeeded: false, errorOn: "empty body" };

  const byNewline = input.split("\n");
  const byComma = byNewline.map((subs) => subs.split(/","/));

  // byCommaの最後の要素は空の文字列になっている
  for (let i = 0; i < byComma.length - 1; i++) {
    if (byComma[i].length != 2) {
      return { succeeded: false, errorOn: byComma[i] };
    }
  }

  return { succeeded: true };
};
