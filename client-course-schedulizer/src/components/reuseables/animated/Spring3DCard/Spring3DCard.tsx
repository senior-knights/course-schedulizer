import React from "react";
import { animated, useSpring } from "react-spring";
import "./Spring3DCard.scss";

const calc = (x: number, y: number) => {
  // TODO: This makes only things in the center perfectly transform.
  // I can't figure out the math to fix this yet
  // Need to offset for where the div is placed on the screen.
  return [-(y - window.innerHeight / 2) / 50, (x - window.innerWidth / 2) / 50, 1.1];
};
const trans = (x: number, y: number, s: number): string => {
  return `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;
};

interface Spring3DCard {
  photo?: string;
}

// ref: https://codesandbox.io/embed/rj998k4vmm
export const Spring3DCard = ({ photo }: Spring3DCard) => {
  const [springProps, set] = useSpring(() => {
    return { config: { friction: 40, mass: 5, tension: 350 }, xys: [0, 0, 1] };
  });

  const { xys } = springProps;

  return (
    <div className="spring-3d-wrapper">
      <animated.div
        className="spring-3d-card"
        onMouseLeave={() => {
          return set({ xys: [0, 0, 1] });
        }}
        onMouseMove={({ clientX: x, clientY: y }) => {
          return set({ xys: calc(x, y) });
        }}
        style={{ transform: xys.interpolate(trans as never) }}
      >
        <img alt="hi" height="200" src={photo} width="200" />
      </animated.div>
    </div>
  );
};

Spring3DCard.defaultProps = {
  photo:
    "https://avatars2.githubusercontent.com/u/33156025?s=460&u=fb61bdf55f17108f9687c334b4b4abc4b09c7259&v=4",
};
