type SimpleError = { message: string };

export const assertSimpleError = (error: unknown): error is SimpleError => {
  if (typeof error !== "object") return false;

  const e = error as SimpleError;
  if (!e.message) return false;

  return true;
};
