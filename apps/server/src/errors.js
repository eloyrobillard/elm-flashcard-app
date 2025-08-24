export const typeError = "typeError";
export const invalidFormat = "invalidFormat";
export const invalidPath = "invalidPath";
export const unknownError = "unknownError";

export const translateError = (e) => {
  if (!e.name || !e.message) return unknownError;

  if (e.name === "Error" && e.message.startsWith("ENOENT")) return invalidPath;
  else if (e.name === "TypeError") return typeError;
  else return unknownError;
};
