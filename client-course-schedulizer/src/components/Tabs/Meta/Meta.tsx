import React, { useState, useEffect } from "react";
import { Container, Paper, Typography } from "@material-ui/core";
import "./Meta.scss";

/* Creates a Meta tab for notes, version, year, and time display
 */
export const Meta = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <div>
        <h3>Meta</h3>
      </div>
      <Paper>
        <div className="meta-content">
          <div className="meta-field">
            <span>Date: </span>
            {currentTime.toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
          <div className="meta-field">
            <span>Time: </span>
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </Paper>
    </>
  );
};
