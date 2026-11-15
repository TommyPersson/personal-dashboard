import { DateTime, Duration } from "luxon"

/**
 * TanStack Query's structural sharing (`replaceEqualDeep`) with Luxon values: an equal `DateTime` or `Duration` keeps
 * its old instance, so refetched data that didn't change keeps its identity.
 *
 * The default only shares plain JSON values. Since queries parse their timestamps into Luxon instances, which are
 * never plain, every refetch would otherwise replace them and everything containing them.
 */
export function replaceEqualDeepWithLuxon<T>(prev: unknown, next: T): T {
  if (prev === next) {
    return prev as T
  }

  if (next instanceof DateTime) {
    return prev instanceof DateTime && prev.equals(next) ? prev as T : next
  }

  if (next instanceof Duration) {
    return prev instanceof Duration && prev.equals(next) ? prev as T : next
  }

  if (isPlainArray(prev) && isPlainArray(next)) {
    let isEqual = prev.length === next.length
    const result = next.map((item, i) => {
      const shared = replaceEqualDeepWithLuxon(prev[i], item)
      isEqual &&= shared === prev[i]
      return shared
    })
    return (isEqual ? prev : result) as T
  }

  if (isPlainObject(prev) && isPlainObject(next)) {
    const prevKeys = Object.keys(prev)
    const nextKeys = Object.keys(next)
    let isEqual = prevKeys.length === nextKeys.length && nextKeys.every(key => Object.hasOwn(prev, key))
    const result: Record<string, unknown> = {}
    for (const key of nextKeys) {
      const shared = replaceEqualDeepWithLuxon(prev[key], next[key])
      isEqual &&= shared === prev[key]
      result[key] = shared
    }
    return (isEqual ? prev : result) as T
  }

  return next
}

function isPlainArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && Object.keys(value).length === value.length
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return false
  }
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}
