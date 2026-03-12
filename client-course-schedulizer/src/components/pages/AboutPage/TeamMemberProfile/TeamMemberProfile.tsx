import { Grid } from "@material-ui/core";
import React from "react";
import { Spring3DHover } from "components";
import { TeamMember } from "utilities";

interface TeamMemberProfileProps {
  member: TeamMember;
}

export const TeamMemberProfile = ({ member }: TeamMemberProfileProps) => {
  const {name } = member;

  return (
    <Grid container direction="column" item>
      <Grid alignItems="center" container direction="column" item>
        <div style={{ transform: "scale(1)", transformOrigin: "center" }}>
          <Spring3DHover member={member} />
        </div>

        <h3 style={{ marginTop: 12, textAlign: "center" }}>{name}</h3>
      </Grid>
    </Grid>
  );
};