import { AnimateShowAndHide } from "components/reuseables/animated";
import React from "react";
import "./AboutPage.scss";

export const AboutPage = () => {
  return (
    <div style={{ height: "1200px" }}>
      <div style={{ backgroundColor: "blue", height: "800px" }}>hello</div>
      <AnimateShowAndHide>
        <span>Vision.</span>
      </AnimateShowAndHide>
      <div style={{ backgroundColor: "blue", height: "800px" }}>hello</div>
      <AnimateShowAndHide>
        <span>Team.</span>
      </AnimateShowAndHide>
      <AnimateShowAndHide>
        <span>Code.</span>
      </AnimateShowAndHide>
      <AnimateShowAndHide>
        <span>Report.</span>
      </AnimateShowAndHide>
      <div style={{ backgroundColor: "blue", height: "800px" }}>hello</div>
    </div>
  );
};
