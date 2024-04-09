export function queryString(obj: Record<string, string>): string {
  return Object.keys(obj)
    .reduce((a: string[], k: string) => {
      a.push(`${k}=${obj[k]}`);

      return a;
    }, [])
    .join('&');
}

type RecordKeyValue = (
  Record<string, string>
)

export function removeAllInvalidValues(
  allFilters: RecordKeyValue,
): RecordKeyValue {
  return Object.keys(allFilters).reduce(
    (prev: RecordKeyValue, curr: string) => {
      const filters: RecordKeyValue = { ...prev };

      if (allFilters[curr] !== 'All' && allFilters[curr] !== '') {
        filters[curr] = allFilters[curr];
      }

      return filters;
    },
    {},
  );
}
