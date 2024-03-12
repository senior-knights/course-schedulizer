import { Grid } from "@material-ui/core";
import { Spring3DHover } from "components";
import React from "react";
import { TeamMember } from "utilities";

interface TeamMemberProfile {
  member: TeamMember;
}

/* Display information about the Team Member */
// Turned off "eslint/no-redeclare" and "eslint/no-unused-vars"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TeamMemberProfile = ({ member }: TeamMemberProfile) => { // eslint-disable-line @typescript-eslint/no-redeclare
  const { name, bio } = member;

  return (
    <Grid alignItems="center" container item>
      <Grid alignItems="center" container direction="column" item xs={4}>
        <Spring3DHover member={member} />
        <h3>{name}</h3>
      </Grid>
      <Grid container item xs={8}>
        {bio}
      </Grid>
    </Grid>
  );
};
