import { useCallback, useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import forEach from "lodash/forEach";
import isNumber from "lodash/isNumber";

import { useCache } from "./use-cache";

const containerStyle = {
  display: "inline-flex",
  position: "absolute",
  visibility: "hidden",
  zIndex: -1
};

function createLayer(id: string) {
  const container = document.createElement("div");
  container.setAttribute("id", id);
  forEach(containerStyle, (v, k) => {
    container.style[k] = v;
  });
  return container;
}

export function measureElement(
  layerId: string,
  element: React.ReactElement,
  width?: number
) {
  const container = document.getElementById(layerId) || createLayer(layerId);

  if (isNumber(width)) {
    container.style.width = width + "px";
  }
  container.innerHTML = renderToString(element);
  document.body.appendChild(container);

  const height = container.clientHeight;

  return { height, container };
}

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
  const layerId = `${id}-measure-layer`;
  const containerRef = useRef<any>(null);

  const itemSize = useCallback(
    index => {
      const rec = data[index];
      const key = getKey(rec);
      let result: number;
      if (!cache.has(key)) {
        const { height, container } = measureElement(
          layerId,
          children({ index, measuring: true }),
          width
        );
        containerRef.current = container;
        cache.set(key, height);
        result = height;
      } else {
        result = cache.get(key) as number;
      }
      return result;
    },
    [data, getKey, cache, layerId, children, width]
  );

  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.parentNode?.removeChild(containerRef.current);
      }
    };
  }, [layerId]);

  return itemSize;
}
