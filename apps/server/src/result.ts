type Err<E> = { tag: "error"; value: E };
type Ok<T> = { tag: "ok"; value: T };
export type Result<E, T> = Err<E> | Ok<T>;

export const err = <E>(value: E): Err<E> => ({
  tag: "error",
  value,
});

export const ok = <T>(value: T): Ok<T> => ({ tag: "ok", value });

export const isErr = <E, T>(result: Result<E, T>): boolean =>
  result.tag === "error";

export const isOk = <E, T>(result: Result<E, T>): boolean =>
  result.tag === "ok";

export const reduce = <E, T, U, V>(
  doErr: (e: E) => U,
  doOk: (t: T) => V,
  result: Result<E, T>,
): U | V => (result.tag === "error" ? doErr(result.value) : doOk(result.value));
