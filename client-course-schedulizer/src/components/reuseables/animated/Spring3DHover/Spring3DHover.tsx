import { NewTabLink } from "components";
import Image from "material-ui-image";
import React from "react";
import { animated, useSpring } from "react-spring";
import { TeamMember } from "utilities";
import { calc, trans } from ".";
import "./Spring3DHover.scss";

interface Spring3DCard {
  member: TeamMember;
}

/* Transforms and Reanimates an image when a mouse is hovered.
  Ref: https://codesandbox.io/embed/rj998k4vmm
*/
export const Spring3DHover = ({ member }: Spring3DCard) => {
  const [springProps, set] = useSpring(() => {
    return { config: { friction: 40, mass: 5, tension: 350 }, xys: [0, 0, 1] };
  });

  const { xys } = springProps;
  const { photo, website, name } = member;

  return (
    <div className="spring-3d-wrapper">
      <NewTabLink href={website}>
        <animated.div
          className="spring-3d-content"
          onMouseLeave={() => {
            return set({ xys: [0, 0, 1] });
          }}
          onMouseMove={({ clientX: x, clientY: y }) => {
            return set({ xys: calc(x, y) });
          }}
          style={{ transform: xys.interpolate(trans as never) }}
        >
          <Image
            alt={`image of ${name}`}
            className="spring-3d-image"
            src={photo}
            style={{ borderRadius: "100%" }}
          />
        </animated.div>
      </NewTabLink>
    </div>
  );
};
