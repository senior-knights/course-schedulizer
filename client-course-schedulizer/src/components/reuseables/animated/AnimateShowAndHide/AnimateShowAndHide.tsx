import React, { PropsWithChildren, useCallback, useState } from "react";
import { animated, useSpring } from "react-spring";
import ReactVisibilitySensor from "react-visibility-sensor";
import "./AnimateShowAndHide.scss";

interface AnimateShowAndHide {
  /* complete the animation once */
  once?: boolean;
}

/* A component that animates children vertically when it goes into scroll view.
  References:
  - https://codesandbox.io/embed/zn2q57vn13
  - https://stackoverflow.com/questions/56928771/reactjs-react-countup-visible-only-once-in-visibility-sensor
*/

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AnimateShowAndHide = ({ children, once }: PropsWithChildren<AnimateShowAndHide>) => {
  const [isActive, setIsActive] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const springProps = useSpring({
    config: { friction: 200, mass: 5, tension: 2000 },
    from: { height: 0, opacity: 0, x: 20 },
    height: isVisible ? 130 : 0,
    opacity: isVisible ? 1 : 0,
    x: isVisible ? 0 : 20,
  });

  const onVisibilityChange = useCallback(
    (isElemVisible: boolean) => {
      /* Animate once */
      if (once && isElemVisible) {
        setIsVisible(true);
        setIsActive(false);
        /* Animate on every view */
      } else {
        setIsVisible(isElemVisible);
      }
    },
    [once],
  );

  const { height } = springProps;

  return (
    <ReactVisibilitySensor active={isActive} onChange={onVisibilityChange}>
      <div className="show-and-hide-main">
        <animated.div className="show-and-hide-text" style={springProps}>
          <animated.div style={{ height, paddingRight: 20 }}>{children}</animated.div>
        </animated.div>
      </div>
    </ReactVisibilitySensor>
  );
};

AnimateShowAndHide.defaultProps = {
  once: true,
};
