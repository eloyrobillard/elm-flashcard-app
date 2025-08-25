type Err<E> = { tag: "error"; value: E };
type Ok<T> = { tag: "ok"; value: T };
export type Result<E, T> = Err<E> | Ok<T>;

export const err = <E>(value: E): Err<E> => ({
  tag: "error",
  value,
});

export const ok = <T>(value: T): Ok<T> => ({ tag: "ok", value });
