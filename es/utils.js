/* eslint-disable  */
export function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}
export function stableCopy(value) {
  if (!value || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(stableCopy);
  }

  const keys = Object.keys(value).sort();
  const stable = {};

  for (let i = 0; i < keys.length; i++) {
    stable[keys[i]] = stableCopy(value[keys[i]]);
  }

  return stable;
}
export function getCacheKey(queryID, variables) {
  return JSON.stringify(stableCopy({
    queryID,
    variables
  }));
}