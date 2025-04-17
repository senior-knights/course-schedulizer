import { Grid } from "@material-ui/core";
import { NewTabLink, Page } from "components/reuseables";
import React from "react";
import { team2020, team2021, team2022, team2023, team2024, teamAdvisors, TeamMember } from "utilities";
import { TeamMemberProfile, TextSection } from ".";
import "./AboutPage.scss";

/* A page with information about the project
  with references */
export const AboutPage = () => {
  return (
    <Page>
      <AboutVision />
      <AboutTeam2024 />
      <AboutTeam2023 />
      <AboutTeam2022 />
      <AboutTeam2021 />
      <AboutTeam2020 />
      <AboutTeamAdvisors />
      <AboutCode />
      <AboutReport />
      <AboutResources />
    </Page>
  );
};

const AboutVision = () => {
  return (
    <TextSection
      body={
        <>
          Every year, all department chairs at Calvin must develop a schedule for their department’s
          classes based on a spreadsheet provided to them by the Registrar. The schedule must
          contain the times, professors, and rooms for every class section in the department and the
          schedule must satisfy the following constraints:
          <ul>
            <li>Only one section can be in a room at a time</li>
            <li>A professor can only teach one section at a time</li>
            <li>
              Two sections taken together cannot be offered at the same time (e.g. CS 212 is often
              taken together with MATH 251 and ENGR 220)
            </li>
            <li>Professors can only teach courses when they are available</li>
            <li>Professors can only teach courses they are qualified to teach</li>
            <li>Professors must/cannot teach consecutive classes depending on their preferences</li>
            <li>A room’s capacity cannot be exceeded by the expected enrollment in the class</li>
            <li>Faculty teaching loads cannot be “too high” or “too low”</li>
          </ul>
          These constraints make it extremely difficult for the department chair to create a
          schedule without a tool to help them. We are building and adding on to a web application,
          named the Course Schedulizer, that will allow department chairs to visualize and
          manipulate their department course schedules. It will provide:
          <ul>
            <li>The ability to upload and export department schedules via CSV</li>
            <li>Integration with the spreadsheets provided and required by the Registrar</li>
            <li>Two views to visualize the schedule data (by location and by instructor)</li>
            <li>Options to color the data by level, instructor, location, or prefix</li>
            <li>Functionality to create, read, update, and delete class sections</li>
            <li>A load summary for each instructor in the department</li>
            <li>Schedule conflict detection and resolution suggestions</li>
            <li>An optimized user interface with an efficient use of screen space</li>
            <li>An extensible interface to integrate with future systems (e.g. Workday)</li>
          </ul>
          By offering these features and developing continuous improvements on the functionality
          previously implemented by Professor Pruim and Professor VanderLinden, the Course
          Schedulizer will allow department chairs to easily create their schedules.
          <br />
          <br />
          There was also a component developed for an Honors Project completed in year 2020 by
          Charles Kornoelje. It allowed users to upload a list of classes, professors, rooms, and
          times into the Schedulizer and then employed constraint satisfaction techniques to create
          a schedule with no conflicts. This component has been removed.
        </>
      }
      title="Vision"
    />
  );
};

const AboutTeam2020 = () => {
  return (
    <TextSection
      body={
        <Grid container direction="column" justify="flex-start" spacing={2}>
          {team2020.map((member: TeamMember) => {
            return <TeamMemberProfile key={member.name} member={member} />;
          })}
        </Grid>
      }
      title="Team of 2020"
    />
  );
};

const AboutTeam2021 = () => {
  return (
    <TextSection
      body={
        <Grid container direction="column" justify="flex-start" spacing={2}>
          {team2021.map((member: TeamMember) => {
            return <TeamMemberProfile key={member.name} member={member} />;
          })}
        </Grid>
      }
      title="Team of 2021"
    />
  );
};

const AboutTeam2022 = () => {
  return (
    <TextSection
      body={
        <Grid container direction="column" justify="flex-start" spacing={2}>
          {team2022.map((member: TeamMember) => {
            return <TeamMemberProfile key={member.name} member={member} />;
          })}
        </Grid>
      }
      title="Team of 2022"
    />
  );
};

const AboutTeam2023 = () => {
  return (
    <TextSection
      body={
        <Grid container direction="column" justify="flex-start" spacing={2}>
          {team2023.map((member: TeamMember) => {
            return <TeamMemberProfile key={member.name} member={member} />;
          })}
        </Grid>
      }
      title="Team of 2023"
    />
  );
};

const AboutTeam2024 = () => {
  return (
    <TextSection
      body={
        <Grid container direction="column" justify="flex-start" spacing={2}>
          {team2024.map((member: TeamMember) => {
            return <TeamMemberProfile key={member.name} member={member} />;
          })}
        </Grid>
      }
      title="Team of 2024"
    />
  );
};

const AboutTeamAdvisors = () => {
  return (
    <TextSection
      body={
        <Grid container direction="column" justify="flex-start" spacing={2}>
          {teamAdvisors.map((member: TeamMember) => {
            return <TeamMemberProfile key={member.name} member={member} />;
          })}
        </Grid>
      }
      title="Team Advisors"
    />
  );
};

const AboutCode = () => {
  return (
    <TextSection
      body={
        <>
          <p></p>For details on the Schedulizer codebase and development process, see the{" "}
          <NewTabLink href="https://github.com/senior-knights/course-schedulizer">
            GitHub code repository
          </NewTabLink>
          . <br />
          <br />
          The original release of the Schedulizer included{" "}
          <NewTabLink href="https://github.com/charkour/harmoniously">Harmoniously</NewTabLink>, an
          honors project that automatically generated schedules using{" "}
          <NewTabLink href="https://github.com/charkour/csps">CSPS</NewTabLink>, a TypeScript port
          of Russell &amp; Norvig&rsquo;s constraint satisfaction algorithm.
        </>
      }
      title="Code"
    />
  );
};

const AboutReport = () => {
  return (
    <TextSection
      body={
        <ul>
          <li>
            <NewTabLink href="https://docs.google.com/document/d/e/2PACX-1vS3Tn3OXVt5XVv9jBAjcJO81BWtXvZreZDOkvkH5WCU7oUyhlqe2EWZ4S51RJ9sqTfKC1SjiECRuNr5/pub">
            2024 Project Proposal
            </NewTabLink>{" "}
            - 10.1.2024
          </li>
          <hr />
          <li>
            <NewTabLink href="https://docs.google.com/document/d/1l0ChWMDnPiDJkvFFctdpIZUheSkJ3shouFSYFIIsNW0/edit?usp=sharing">
              Final Report
            </NewTabLink>{" "}
            - 4.30.2024
          </li>
          <li>
            <NewTabLink href="https://docs.google.com/document/d/16FBgWv1JVa3SDyDcNtiC_EZ3NYhkU7Y5tBEmhjGQftM/edit?usp=sharing">
              2023 Project Proposal
            </NewTabLink>{" "}
            - 10.01.2023
          </li>
          <hr />
          <li>
            <NewTabLink href="https://docs.google.com/document/d/1MjXN3lbgYXInZyUk1V_sh4wVVs2ITd6rloYKjJW8W6c/edit?usp=sharing">
              2022 Project Proposal
            </NewTabLink>{" "}
            - 10.01.2022
          </li>
          <hr />
          <li>
            <NewTabLink href="https://docs.google.com/document/d/e/2PACX-1vSL0Ezm-2XOCQWPv4R7J3MRZAn5PW46cayuKNxxElyVdl9W48ns2cRcd6xquoBc054_w2K_vsx2si7P/pub">
              Final Report
            </NewTabLink>{" "}
            - 4.26.2022
          </li>
          <li>
            <NewTabLink href="https://docs.google.com/document/d/e/2PACX-1vTBrCpNg8RfpGYG5-c4ZDzpADTPWUyfRhuUzgXTH19LPGs2ZPTZ5OjixdFz_zhYkPzdBkxCjWd46Klc/pub">
              Project Proposal
            </NewTabLink>{" "}
            - 10.01.2021
          </li>
          <hr />
          <li>
            <NewTabLink href="https://docs.google.com/document/d/e/2PACX-1vQcSDE6VMNl-wMHhECt3RbeA3WD-tiXersevVAMDXfgImq9HMFS5yQnLx8mZ4qZ4Q/pub">
              Final Report
            </NewTabLink>{" "}
            - 5.13.2021
          </li>
          <li>
            <NewTabLink href="https://docs.google.com/document/d/e/2PACX-1vQPQ1Qhu0jCVThVbNsUFxV8fB56fHgVf4Dnhfkf6EU_7627iMVuSHntW8VxF0j0Aw/pub">
              Updated Status Report
            </NewTabLink>{" "}
            - 12.15.2020
          </li>
          <li>
            <NewTabLink href="https://docs.google.com/document/d/e/2PACX-1vQTy2A83LmPKrZhQ5_LCN6a3ow4UHxknIq4OjgimPU-Brfyl6fAhb9aQmxjNvg5tA/pub">
              Original Proposal
            </NewTabLink>{" "}
            - 10.15.2020
          </li>
        </ul>
      }
      title="Report"
    />
  );
};

const AboutResources = () => {
  return (
    <TextSection
      body={
        <ul>
          <li>
            <NewTabLink href="https://computing.calvin.edu/">
              Computing@Calvin Department Website
            </NewTabLink>
          </li>
          <hr />
          <li>
            <NewTabLink href="https://docs.google.com/presentation/d/e/2PACX-1vSGiDKCClWDm4Oj35r8sMiOp24fvbtLBQunou5uy7psD6hsxWCqOq2y7KJtC0KF4A5Lp4ypqx2WCsfE/pub?start=false&loop=false&delayms=3000">
              Status Report Slides
            </NewTabLink>{" "}
            - 12.10.2024
          </li>
          <hr />
          <li>
            <NewTabLink href="https://docs.google.com/presentation/d/e/2PACX-1vT2RDZd5XCKPz_ecGbYOfCiQvsGsQqXxdDd_kh251djFpP3tDQLzgKj0Ts-Vwy2tosev_MQoPxq_x40/pub?start=false&loop=false&delayms=3000">
              Final Presentation Slides
            </NewTabLink>{" "}
            - 4.23.2024
          </li>
          <li>
            <NewTabLink href="https://docs.google.com/presentation/d/e/2PACX-1vQZ2cpoTzUtnVa-s_YeGGv3FHHSpHdR0zAJXY6jwJL8zrHTa7-zGtWGIKkGzUglcTfykCA3uML3hsZu/pub?start=false&loop=false&delayms=3000">
              Status Report Slides
            </NewTabLink>{" "}
            - 12.5.2023
          </li>
          <hr />
          <li>
            <NewTabLink href="https://docs.google.com/presentation/d/e/2PACX-1vSGBkk_3fRIeLrlMBCgLnHLxSdt4hOVz5QovjrUs3qXfVDnx12xO7hYLEuhQx4CtW_VOJ-tBIZaoHZ9/pub?start=false&loop=false&delayms=3000">
              Final Presentation Slides
            </NewTabLink>{" "}
            - 4.19.2022
          </li>
          <li>
            <NewTabLink href="https://docs.google.com/presentation/d/e/2PACX-1vRRNLIukj6g61oBkb41JiwW0hZFUMOGzL_m-Um_Ha9vcksYJRzmd7oUlyEs0rqz5fqgFVmncarYzbMP/pub?start=false&loop=false&delayms=3000">
              Status Report Slides
            </NewTabLink>{" "}
            - 12.07.2021
          </li>
          <hr />
          <li>
            <NewTabLink href="https://youtu.be/ckn0oPxvlIE">Final Presentation Video</NewTabLink> -
            4.25.2021
          </li>
          <li>
            <NewTabLink href="https://docs.google.com/presentation/d/e/2PACX-1vRcyM-65kiLgceLaU7mQjnuzqPHKMt-nWT_msYcXeXbLeoe13awn2gSudzlC_5ghpyQlLVPzywJzywj/pub?start=false&loop=false&delayms=3000">
              Final Presentation Slides
            </NewTabLink>{" "}
            - 4.25.2021
          </li>
          <li>
            <NewTabLink href="https://web.microsoftstream.com/video/cee6b774-a010-4220-a0d8-c6a6c5240d84?st=2456">
              Status Report Video
            </NewTabLink>{" "}
            - 12.01.2020
          </li>
          <li>
            <NewTabLink href="https://docs.google.com/document/d/e/2PACX-1vS8sc8-Vs1qkfyGpelPXsuwvSQif3IFlnsZNoak3P7DbBmSYxWDgXL2ig-OJk8VJVHny2lCUZxCyCfJ/pub">
              Honors Status Report
            </NewTabLink>{" "}
            - 12.01.2020
          </li>
          <li>
            <NewTabLink href="https://docs.google.com/presentation/d/e/2PACX-1vQrjMY5c-gnlvX5AAD1zIqRY0P5BLppQFT5y-3fxeR0TzuEvzUpDADYUGY_3J4TBe1PL3sq9rEqUdRA/pub?start=false&loop=false&delayms=3000">
              Status Report Slides
            </NewTabLink>{" "}
            - 12.01.2020
          </li>
        </ul>
      }
      title="Resources"
    />
  );
};
