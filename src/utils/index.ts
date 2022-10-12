import { ParsedUrlQuery } from "querystring";

export function getValueFromParams(
  key: string,
  params?: ParsedUrlQuery
): string | undefined {
  if (!params) {
    return undefined;
  }
  if (!(key in params)) {
    return undefined;
  }
  if (Array.isArray(params[key])) {
    return params[key]![0];
  }
  return params[key]! as string;
}
