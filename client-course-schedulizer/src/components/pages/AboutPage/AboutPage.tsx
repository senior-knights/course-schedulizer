import { Grid } from "@material-ui/core";
import React from "react";
import { NewTabLink, Page } from "components/reuseables";
import { team2020, team2021, team2022, team2023, team2024, team2025, teamAdvisors, TeamMember} from "utilities";
import { TeamMemberProfile, TextSection } from ".";
import "./AboutPage.scss";

type ResourceItem = {
  date?: string;
  href: string;
  label: string;
};

type TeamYearSection = {
  academicYearLabel: string;
  resourcesAndReports: ResourceItem[];
  team?: TeamMember[];
};

export const AboutPage = () => {
  const teamSections: TeamYearSection[] = [
    {
      academicYearLabel: "2025–26",
      resourcesAndReports: [
        {
          date: "2.26.2026",
          href: "https://docs.google.com/document/d/1ZSYfABqfUSxhqqfZH9b_0fu2XrqBe46lxKp5XGHGvY8/edit?usp=sharing",
          label: "Schedulizer Project Report ",
        },
      ],
      team: team2025,
    },
    {
      academicYearLabel: "2024–25",
      resourcesAndReports: [
        {
          date: "4.26.2025",
          href: "https://calvincollege-my.sharepoint.com/:w:/g/personal/eam43_calvin_edu/EdiWjkO979tEggEuDAll8GsBKW7iTIgMcMRmjVwpDXYFCA?e=oZrgyb",
          label: "Final Report",
        },
        {
          date: "4.26.2025",
          href: "https://docs.google.com/presentation/d/1ZzCyTobI533V0KfaB8nex7Vd54I91799uaEgDQAA7Vw/edit?usp=sharingA",
          label: "Final Presentation Slides",
        },
        {
          date: "12.10.2024",
          href: "https://docs.google.com/presentation/d/e/2PACX-1vSGiDKCClWDm4Oj35r8sMiOp24fvbtLBQunou5uy7psD6hsxWCqOq2y7KJtC0KF4A5Lp4ypqx2WCsfE/pub?start=false&loop=false&delayms=3000",
          label: "Status Report Slides",
        },
        {
          date: "10.1.2024",
          href: "https://docs.google.com/document/d/e/2PACX-1vS3Tn3OXVt5XVv9jBAjcJO81BWtXvZreZDOkvkH5WCU7oUyhlqe2EWZ4S51RJ9sqTfKC1SjiECRuNr5/pub",
          label: "2024 Project Proposal",
        },
      ],
      team: team2024,
    },
    {
      academicYearLabel: "2023–24",
      resourcesAndReports: [
        {
          date: "4.30.2024",
          href: "https://docs.google.com/document/d/1l0ChWMDnPiDJkvFFctdpIZUheSkJ3shouFSYFIIsNW0/edit?usp=sharing",
          label: "Final Report",
        },
        {
          date: "4.23.2024",
          href: "https://docs.google.com/presentation/d/e/2PACX-1vT2RDZd5XCKPz_ecGbYOfCiQvsGsQqXxdDd_kh251djFpP3tDQLzgKj0Ts-Vwy2tosev_MQoPxq_x40/pub?start=false&loop=false&delayms=3000",
          label: "Final Presentation Slides",
        },
        {
          date: "12.5.2023",
          href: "https://docs.google.com/presentation/d/e/2PACX-1vQZ2cpoTzUtnVa-s_YeGGv3FHHSpHdR0zAJXY6jwJL8zrHTa7-zGtWGIKkGzUglcTfykCA3uML3hsZu/pub?start=false&loop=false&delayms=3000",
          label: "Status Report Slides",
        },
        {
          date: "10.01.2023",
          href: "https://docs.google.com/document/d/16FBgWv1JVa3SDyDcNtiC_EZ3NYhkU7Y5tBEmhjGQftM/edit?usp=sharing",
          label: "2023 Project Proposal",
        },
      ],
      team: team2023,
    },
    {
      academicYearLabel: "2022–23",
      resourcesAndReports: [
        {
          date: "10.01.2022",
          href: "https://docs.google.com/document/d/1MjXN3lbgYXInZyUk1V_sh4wVVs2ITd6rloYKjJW8W6c/edit?usp=sharing",
          label: "2022 Project Proposal",
        },
      ],
      team: team2022,
    },
    {
      academicYearLabel: "2021–22",
      resourcesAndReports: [
        {
          date: "4.26.2022",
          href: "https://docs.google.com/document/d/e/2PACX-1vSL0Ezm-2XOCQWPv4R7J3MRZAn5PW46cayuKNxxElyVdl9W48ns2cRcd6xquoBc054_w2K_vsx2si7P/pub",
          label: "Final Report",
        },
        {
          date: "4.19.2022",
          href: "https://docs.google.com/presentation/d/e/2PACX-1vSGBkk_3fRIeLrlMBCgLnHLxSdt4hOVz5QovjrUs3qXfVDnx12xO7hYLEuhQx4CtW_VOJ-tBIZaoHZ9/pub?start=false&loop=false&delayms=3000",
          label: "Final Presentation Slides",
        },
        {
          date: "12.07.2021",
          href: "https://docs.google.com/presentation/d/e/2PACX-1vRRNLIukj6g61oBkb41JiwW0hZFUMOGzL_m-Um_Ha9vcksYJRzmd7oUlyEs0rqz5fqgFVmncarYzbMP/pub?start=false&loop=false&delayms=3000",
          label: "Status Report Slides",
        },
        {
          date: "10.01.2021",
          href: "https://docs.google.com/document/d/e/2PACX-1vTBrCpNg8RfpGYG5-c4ZDzpADTPWUyfRhuUzgXTH19LPGs2ZPTZ5OjixdFz_zhYkPzdBkxCjWd46Klc/pub",
          label: "Project Proposal",
        },
      ],
      team: team2021,
    },
    {
      academicYearLabel: "2020–21",
      resourcesAndReports: [
        {
          date: "5.13.2021",
          href: "https://docs.google.com/document/d/e/2PACX-1vQcSDE6VMNl-wMHhECt3RbeA3WD-tiXersevVAMDXfgImq9HMFS5yQnLx8mZ4qZ4Q/pub",
          label: "Final Report",
        },
        {
          date: "4.25.2021",
          href: "https://youtu.be/ckn0oPxvlIE",
          label: "Final Presentation Video",
        },
        {
          date: "4.25.2021",
          href: "https://docs.google.com/presentation/d/e/2PACX-1vRcyM-65kiLgceLaU7mQjnuzqPHKMt-nWT_msYcXeXbLeoe13awn2gSudzlC_5ghpyQlLVPzywJzywj/pub?start=false&loop=false&delayms=3000",
          label: "Final Presentation Slides",
        },
        {
          date: "12.15.2020",
          href: "https://docs.google.com/document/d/e/2PACX-1vQPQ1Qhu0jCVThVbNsUFxV8fB56fHgVf4Dnhfkf6EU_7627iMVuSHntW8VxF0j0Aw/pub",
          label: "Updated Status Report",
        },
        {
          date: "10.15.2020",
          href: "https://docs.google.com/document/d/e/2PACX-1vQTy2A83LmPKrZhQ5_LCN6a3ow4UHxknIq4OjgimPU-Brfyl6fAhb9aQmxjNvg5tA/pub",
          label: "Original Proposal",
        },
        {
          date: "12.01.2020",
          href: "https://web.microsoftstream.com/video/cee6b774-a010-4220-a0d8-c6a6c5240d84?st=2456",
          label: "Status Report Video",
        },
        {
          date: "12.01.2020",
          href: "https://docs.google.com/document/d/e/2PACX-1vS8sc8-Vs1qkfyGpelPXsuwvSQif3IFlnsZNoak3P7DbBmSYxWDgXL2ig-OJk8VJVHny2lCUZxCyCfJ/pub",
          label: "Honors Status Report",
        },
        {
          date: "12.01.2020",
          href: "https://docs.google.com/presentation/d/e/2PACX-1vQrjMY5c-gnlvX5AAD1zIqRY0P5BLppQFT5y-3fxeR0TzuEvzUpDADYUGY_3J4TBe1PL3sq9rEqUdRA/pub?start=false&loop=false&delayms=3000",
          label: "Status Report Slides",
        },
      ],
      team: team2020,
    },
  ];

  return (
    <Page>
      <AboutVision />
      <AboutTeams sections={teamSections} />
      <AboutAdvisors />
      <AboutCode />
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

const AboutTeams = ({ sections }: { sections: TeamYearSection[] }) => {
  const visibleSections = sections.filter((s) => {
    return (s.team?.length ?? 0) > 0;
  });

  if (visibleSections.length === 0) {
    return null;
  }

  return (
    <TextSection
      body={
        <div>
          {visibleSections.map((section) => {
            return (
              <TeamAcademicYearBlock key={section.academicYearLabel} section={section} />
            );
          })}
        </div>
      }
      title="Teams"
    />
  );
};

const TeamAcademicYearBlock = ({ section }: { section: TeamYearSection }) => {
  const { academicYearLabel, resourcesAndReports, team } = section;

  return (
    <div className="about-team-year-block">
      <h2 className="about-team-year-title">Team of {academicYearLabel}</h2>

      <Grid
        className="about-team-grid"
        container
        direction="row"
        justify="flex-start"
        spacing={2}
      >
        {(team || []).map((member: TeamMember) => {
          return (
            <Grid item key={member.name} sm={3} xs={6}>
              <TeamMemberProfile member={member} />
            </Grid>
          );
        })}
      </Grid>

      {resourcesAndReports.length > 0 ? (
        <div className="about-team-year-links">
          <h4 className="about-team-year-subtitle">Resources &amp; Reports</h4>
          <ul className="about-resource-list">
            {resourcesAndReports.map((item) => {
              return (
                <li
                  className="about-resource-item"
                  key={`${academicYearLabel}-${item.label}-${item.href}`}
                >
                  <NewTabLink href={item.href}>{item.label}</NewTabLink>
                  {item.date ? (
                    <span className="about-resource-date"> — {item.date}</span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

const AboutAdvisors = () => {
  if (!teamAdvisors || teamAdvisors.length === 0) {
    return null;
  }

  return (
    <TextSection
      body={
        <Grid
          className="about-team-grid"
          container
          direction="row"
          justify="flex-start"
          spacing={2}
        >
          {teamAdvisors.map((member: TeamMember) => {
            return (
              <Grid item key={member.name} sm={3} xs={6}>
                <TeamMemberProfile member={member} />
              </Grid>
            );
          })}
        </Grid>
      }
      title="Advisors"
    />
  );
};

const AboutCode = () => {
  return (
    <TextSection
      body={
        <>
          For details on the Schedulizer codebase and development process, see the{" "}
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