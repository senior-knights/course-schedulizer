import throttle from "lodash.throttle";
import { createRef, RefObject, useEffect, useState } from "react";

/**
 * Check if an element is in viewport. Adapted from SO user Alex Gusev.
 * TODO: make this take a once prop to only animate once (and to stop adding event listeners)
 *   also, could update to make the offset be a bottom and top offset.
 * Not sure how performant this hook is, so this could be another option:
 *   https://www.npmjs.com/package/react-visibility-sensor
 *   and https://github.com/joshwnj/react-visibility-sensor/issues/117
 * @param {number} offset - Number of pixels up to the observable element from the top
 * @param {number} throttleMilliseconds - Throttle observable listener, in ms
 * ref: https://stackoverflow.com/questions/45514676/react-check-if-element-is-visible-in-dom
 */
export const useVisibility = <Element extends HTMLElement>(
  offset = 0,
  throttleMilliseconds = 100,
): [boolean, RefObject<Element>] => {
  const [isVisible, setIsVisible] = useState(true);
  const currentElement = createRef<Element>();

  const onScroll = throttle(() => {
    if (!currentElement.current) {
      setIsVisible(false);
      return;
    }
    const { top } = currentElement.current.getBoundingClientRect();
    setIsVisible(top + offset >= 0 && top - offset <= window.innerHeight);
  }, throttleMilliseconds);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      return window.removeEventListener("scroll", onScroll);
    };
  });

  return [isVisible, currentElement];
};
