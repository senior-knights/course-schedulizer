import React, { PropsWithChildren } from "react";
import { animated, useSpring } from "react-spring";
import { useVisibility } from "utilities";
import "./AnimateShowAndHide.scss";

/* Returns a component that animates children vertically when it goes into scroll view
ref: https://codesandbox.io/embed/zn2q57vn13
*/
export const AnimateShowAndHide = ({ children }: PropsWithChildren<{}>) => {
  const [isFirstVisible, firstRef] = useVisibility<HTMLDivElement>(-50, 100);
  const springProps = useSpring({
    config: { friction: 200, mass: 5, tension: 2000 },
    from: { height: 0, opacity: 0, x: 20 },
    height: isFirstVisible ? 110 : 0,
    opacity: isFirstVisible ? 1 : 0,
    x: isFirstVisible ? 0 : 20,
  });

  const { height } = springProps;

  return (
    <div
      ref={firstRef}
      className="trails-main"
      style={{ display: "flex", justifyContent: "flex-start" }}
    >
      <animated.div className="trails-text" style={springProps}>
        <animated.div style={{ height }}>{children}</animated.div>
      </animated.div>
    </div>
  );
};
