import { useCallback } from "react";

import { useCache } from "./use-cache";
import { useMeasure } from "./use-measure";

function defaultGetKey(rec: any) {
  return rec._id;
}

type RenderFn = ({
  index,
  measuring
}: Partial<{ index: number; measuring: boolean }>) => any;

type Options = {
  id: string;
  data: any[];
  children: RenderFn;
  width: number;
  getKey?: (rec: any) => any;
  refresh: () => void;
  cacheDeps?: any;
};

export function useItemSize({
  id,
  data,
  children,
  width,
  getKey = defaultGetKey,
  refresh,
  cacheDeps
}: Options) {
  const cache = useCache({ data, width, ...cacheDeps }, refresh);
  const measure = useMeasure({ id, width });

  const itemSize = useCallback(
    index => {
      const rec = data[index];
      const key = getKey(rec);
      let result: number;
      if (!cache.has(key)) {
        const height = measure(children({ index, measuring: true }));
        cache.set(key, height);
        result = height;
      } else {
        result = cache.get(key) as number;
      }
      return result;
    },
    [data, getKey, cache, children, measure]
  );

  return itemSize;
}
