import { Grid } from "@material-ui/core";
import { Spring3DHover } from "components";
import React from "react";
import { TeamMember } from "utilities";

/* Display information about the Team Member */
export const TeamMemberProfile = ({ name, bio, photo }: TeamMember) => {
  return (
    <Grid alignItems="center" container item>
      <Grid alignItems="center" container direction="column" item xs={4}>
        <Spring3DHover photo={photo} />
        <h3>{name}</h3>
      </Grid>
      <Grid container item xs={8}>
        {bio}
      </Grid>
    </Grid>
  );
};
