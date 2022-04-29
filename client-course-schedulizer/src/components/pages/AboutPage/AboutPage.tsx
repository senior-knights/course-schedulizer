import { Grid } from "@material-ui/core";
import { NewTabLink, Page } from "components/reuseables";
import React from "react";
import { team2020, team2021, teamAdvisors, TeamMember } from "utilities";
import { TeamMemberProfile, TextSection } from ".";
import "./AboutPage.scss";

/* A page with information about the project
  with references */
export const AboutPage = () => {
  return (
    <Page>
      <AboutVision />
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
          schedule without a tool to help them. We are building and adding on to a web application, named the
          Course Schedulizer, that will allow department chairs to visualize and manipulate their
          department course schedules. It will provide:
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
          By offering these features and developing continuous improvements on the functionality previously implemented by
          Professor Pruim and Professor VanderLinden, the Course Schedulizer will allow department
          chairs to easily create their schedules.
          <br />
          <br />
          There is also a past Honors Project completed in year 2020 by Charles. It is a second project relating to constraint
          problem satisfaction alongside the Course Schedulizer. By employing constraint
          satisfaction techniques, Charles has developed the ability to upload a
          list of classes, professors, rooms, and times to the Course Schedulizer web application
          and have the system create a schedule with no conflicts.
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
          This website is our code built and deployed. Feel free to play around with the site. Our
          code repository is{" "}
          <NewTabLink href="https://github.com/senior-knights/course-schedulizer">
            hosted on GitHub
          </NewTabLink>
          . We have two persistent branches: <code>production</code> and <code>develop</code>.{" "}
          <code>production</code> is the working, stable build of the web application and{" "}
          <code>develop</code> is the less-stable, bleeding-edge build of our Course Schedulizer
          app. Please feel free to look around the code and interact with us on the discussion board
          or by posting issues. The honors constraint satisfaction package from year 2020 is also{" "}
          <NewTabLink href="https://github.com/charkour/csps">hosted on GitHub</NewTabLink>. The
          Harmoniously project code is also{" "}
          <NewTabLink href="https://github.com/charkour/harmoniously">hosted on GitHub</NewTabLink>.
          For details on the development process, please view the respective ReadMe files on GitHub.
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
          <hr/>
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
          <hr/>
          <li>
            <NewTabLink href="https://docs.google.com/presentation/d/e/2PACX-1vSGBkk_3fRIeLrlMBCgLnHLxSdt4hOVz5QovjrUs3qXfVDnx12xO7hYLEuhQx4CtW_VOJ-tBIZaoHZ9/pub?start=false&loop=false&delayms=3000">
              Final Presentation Slides
            </NewTabLink> -
            4.19.2022
          </li>
          <li>
            <NewTabLink href="https://docs.google.com/presentation/d/e/2PACX-1vRRNLIukj6g61oBkb41JiwW0hZFUMOGzL_m-Um_Ha9vcksYJRzmd7oUlyEs0rqz5fqgFVmncarYzbMP/pub?start=false&loop=false&delayms=3000">
              Status Report Slides
              </NewTabLink> -
            12.07.2021
          </li>
          <hr/>
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
