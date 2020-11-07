import { useState, useRef, useCallback, useEffect } from "react";
import { shallowEqualObjects as isEqual } from "shallow-equal";

export function useCache(data: any, refresh: () => void) {
  const [cache, setCache] = useState(new Map());
  const ref = useRef(data);

  const resetCache = useCallback(() => {
    setCache(new Map());
    refresh();
  }, [setCache, refresh]);

  useEffect(() => {
    if (!isEqual(ref.current, data)) {
      ref.current = data;
      resetCache();
    }
  }, [data, resetCache]);

  return cache;
}
