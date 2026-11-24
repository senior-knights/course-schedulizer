import { Grid } from "@mui/material";
import { Spring3DHover } from "components";
import React from "react";
import { Spring3DHover } from "components";
import { TeamMember } from "utilities";

interface TeamMemberProfileProps {
  member: TeamMember;
}

export const TeamMemberProfile = ({ member }: TeamMemberProfileProps) => {
  const {name } = member;

  return (
    <Grid alignItems="center" container>
      <Grid alignItems="center" container direction="column" size={{xs: 4}}>
        <Spring3DHover member={member} />
        <h3>{name}</h3>
      </Grid>
      <Grid container size={{xs: 8}}>
        {bio}
      </Grid>
    </Grid>
  );
};