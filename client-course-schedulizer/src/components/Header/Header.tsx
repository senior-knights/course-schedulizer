import { AppBar, Toolbar, Typography } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import { logo } from "assets";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import "./Header.scss";

/* Header is the top bar that persists across the app */
export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar className="toolbar">
        <RouterLink className="toolbar-group title" to="/">
          <img alt="Org Logo" className="org-logo" src={logo} />
          <Typography variant="h6">Course Schedulizer</Typography>
        </RouterLink>
        <Typography className="toolbar-group links">
          <Link component={RouterLink} to="/">
            Schedulizer
          </Link>
          <Link component={RouterLink} to="/about">
            About
          </Link>
          <Link component={RouterLink} to="/help">
            Help
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
