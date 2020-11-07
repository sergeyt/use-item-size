import { useCallback, useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import forEach from "lodash/forEach";
import isNumber from "lodash/isNumber";

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
  content: React.ReactElement,
  width?: number | string
) {
  const container = document.getElementById(layerId) || createLayer(layerId);

  if (isNumber(width)) {
    container.style.width = width + "px";
  } else if (width) {
    container.style.width = width;
  }

  container.innerHTML = renderToString(content);
  document.body.appendChild(container);

  const height = container.clientHeight;

  return { height, container };
}

type Options = {
  id?: string;
  width?: number | string;
};

export function useMeasure({ id, width }: Options = {}) {
  const layerId = `${id}-measure-layer`;
  const containerRef = useRef<any>(null);

  const measure = useCallback(
    (content: React.ReactElement) => {
      const { height, container } = measureElement(layerId, content, width);
      containerRef.current = container;
      return height;
    },
    [layerId, width]
  );

  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.parentNode?.removeChild(containerRef.current);
      }
    };
  }, [layerId]);

  return measure;
}
