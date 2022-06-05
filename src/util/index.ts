import { isNull } from 'lodash-es'

/**
 * index starts at one.
 */
export function regexMatch(
  str: string,
  regexp: RegExp,
  index?: number
): string | null
export function regexMatch(
  str: string,
  regexp: RegExp,
  index: null
): RegExpMatchArray | null
export function regexMatch(
  str: string,
  regexp: RegExp,
  index: number | null = 1
) {
  const r = str.match(regexp)
  if (isNull(r)) return null
  if (index === null) {
    return r as RegExpMatchArray as any
  }
  return r[index] as string as any
}
