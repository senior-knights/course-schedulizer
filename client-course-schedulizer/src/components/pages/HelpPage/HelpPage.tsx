import { Page } from "components/reuseables";
import React from "react";
import { TextSection } from "../AboutPage/.";

export const HelpPage = () => {
  return (
    <Page>
      <Functionality />
      <FormatSegment />
      <Faq />
    </Page>
  );
};

const Functionality = () => {
  return (
    <TextSection
      body={
        <>
          <strong>To create a schedule from scratch</strong>:
          <ol>
            <li>
              Click the Calvin University logo in the upper left corner to make sure you&rsquo;re on
              the starting page.
            </li>
            <li>Click &ldquo;Add Section&rdquo; to input a class.</li>
            <li>
              In the &ldquo;Formatting&rdquo; section on this page (see below), you can read about
              some recommended ways to format your inputs. Fill in all the values as appropriate for
              the class. Once you&rsquo;ve created a class, your screen will change to show a
              calendar view.
            </li>
            <li>
              To add another class, click the &ldquo;plus&rdquo; (+) symbol at the right side of the
              gray bar (this bar appears on the faculty schedule, room schedule, and department
              schedule pages).
            </li>
          </ol>
          If you find yourself in the &ldquo;Add Section&rdquo; screen unintentionally, or need to
          back out of it for any reason, simply press your "Escape" key on your keyboard and you
          will return to where you were before.
          <br />
          <br />
          <strong>To edit an existing schedule:</strong>
          <ol>
            <li>
              You can start with an existing schedule file (CSV or XLSX), or you can download a new
              copy using the &ldquo;Schedulizer Course Sections&rdquo; report from{" "}
              <code>reports.calvin.edu</code>.
            </li>
            <li>
              Load the schedule file by clicking either:
              <ul>
                <li>The &ldquo;Import Schedule&rdquo; button on the main startup page.</li>
                <li>
                  The &ldquo;Hamburger menu&rdquo; (three lines in the upper left corner of the
                  screen) and selecting &ldquo;Import New Schedule&rdquo;.
                </li>
              </ul>
            </li>
          </ol>
          Use the standard schedule editing features to make the required changes.
          <br />
          <br />
          <strong>To save a schedule:</strong>
          <ol>
            <li>
              Click on the &ldquo;Hamburger menu&rdquo; and select &ldquo;Export Excel&rdquo;.
            </li>
          </ol>
          The exported file will be in a standardized XLSX format that has three spreadsheet tabs:
          one with the standard &ldquo;Schedule&rdquo; entries; one with &ldquo;Registrar
          Schedule&rdquo; formatted for the registrar; and one &ldquo;Metadata&rdquo; with
          additional schedule information.
        </>
      }
      title="Help"
    />
  );
};

const FormatSegment = () => {
  return (
    <TextSection
      body={
        <>
          In the web app, upload a CSV following the prescribed specifications (items marked with *
          are optional and ignored, but were required in older versions of the app)
          <ul>
            <li>
              {" "}
              <strong>Department</strong>: string (e.g., <code>Mathematics</code>)
            </li>
            <li>
              {" "}
              *<strong>Term</strong>: (FA | SP | IN) (e.g., <code>SP</code> for Spring)
            </li>
            <li>
              {" "}
              <strong>TermStart</strong>: mm/dd/yyyy (e.g., <code>3/29/2021</code> or{" "}
              <code>12/1/2022</code>)
            </li>
            <li>
              {" "}
              *<strong>AcademicYear</strong>: yyyy (e.g., <code>2021</code>)
            </li>
            <li>
              {" "}
              *<strong>SectionName</strong>: SubjectCode-CourseNum-SectionCode (e.g.,{" "}
              <code>MATH-252-B</code>)
            </li>
            <li>
              {" "}
              <strong>SubjectCode</strong>: string (e.g., <code>MATH</code>)
            </li>
            <li>
              {" "}
              <strong>CourseNum</strong>: string (e.g., <code>252</code> or <code>252L</code> for a
              lab)
            </li>
            <li>
              {" "}
              <strong>SectionCode</strong>: string (e.g., <code>B</code>)
            </li>
            <li>
              {" "}
              <strong>CourseLevelCode</strong>: pos num (e.g., <code>200</code> for a 200 level
              course)
            </li>
            <li>
              {" "}
              <strong>MinimumCredits</strong>: pos num (e.g., <code>3</code> or <code>3.5</code>)
            </li>
            <li>
              {" "}
              <strong>FacultyLoad</strong>: pos num (e.g., <code>4</code> or <code>4.5</code>)
            </li>
            <li>
              {" "}
              *<strong>Used</strong>: pos num (e.g., <code>20</code>)
            </li>
            <li>
              {" "}
              *<strong>Day10Used</strong>: pos num (e.g., <code>22</code>)
            </li>
            <li>
              {" "}
              *<strong>LocalMax</strong>: pos num (e.g., <code>25</code>)
            </li>
            <li>
              {" "}
              *<strong>GlobalMax</strong>: pos num (e.g., <code>30</code>)
            </li>
            <li>
              {" "}
              *<strong>RoomCapacity</strong>: pos num (e.g., <code>32</code>)
            </li>
            <li>
              {" "}
              <strong>BuildingAndRoom</strong>: string (e.g., <code>HH 345</code>)
            </li>
            <li>
              {" "}
              <strong>MeetingDays</strong>: M?T?W?(TH)?F? (e.g., <code>MWTHF</code>)
            </li>
            <li>
              {" "}
              <strong>MeetingTime</strong>: xx:xx(AM | PM) - xx:xx(AM | PM) (e.g.,{" "}
              <code>9:00AM - 9:50AM</code>)
            </li>
            <li>
              {" "}
              <strong>SectionStartDate</strong>: mm/dd/yyyy (e.g., <code>3/29/2021</code> or{" "}
              <code>12/1/2022</code>)
            </li>
            <li>
              {" "}
              <strong>SectionEndDate</strong>: mm/dd/yyyy (e.g., <code>3/29/2021</code> or{" "}
              <code>12/1/2022</code>)
            </li>
            <li>
              {" "}
              *<strong>Building</strong>: string (e.g., <code>HH</code>)
            </li>
            <li>
              {" "}
              *<strong>RoomNumber</strong>: string (e.g., <code>345</code>)
            </li>
            <li>
              {" "}
              <strong>MeetingStart</strong>: xx:xx(AM | PM) (e.g., <code>2:30PM</code>)
            </li>
            <li>
              {" "}
              *<strong>MeetingStartInternal</strong>: xx:xx:xx 24-hour (e.g., <code>14:30:00</code>)
            </li>
            <li>
              {" "}
              <strong>MeetingEnd</strong>: xx:xx(AM | PM) (e.g., <code>3:20PM</code>)
            </li>
            <li>
              {" "}
              *<strong>MeetingEndInternal</strong>: xx:xx:xx 24-hour (e.g., <code>13:20:00</code>)
            </li>
            <li>
              {" "}
              *<strong>Monday</strong>: <code>M</code> or empty
            </li>
            <li>
              {" "}
              *<strong>Tuesday</strong>: <code>T</code> or empty
            </li>
            <li>
              {" "}
              *<strong>Wednesday</strong>: <code>W</code> or empty
            </li>
            <li>
              {" "}
              *<strong>Thursday</strong>: <code>TH</code> or empty
            </li>
            <li>
              {" "}
              *<strong>Friday</strong>: <code>F</code> or empty
            </li>
            <li>
              {" "}
              <strong>ShortTitle</strong>: string (e.g., <code>Number Theory</code>)
            </li>
            <li>
              {" "}
              <strong>Faculty</strong>: string (first and last) (e.g., <code>Paul Erdos</code>)
            </li>
            <li>
              {" "}
              *<strong>SectionStatus</strong>: string (e.g., <code>Active</code>)
            </li>
            <li>
              {" "}
              <strong>InstructionalMethod</strong>: <code>LEC</code>, <code>CPI</code>,{" "}
              <code>IND</code>, <code>TUT</code>, or <code>SEM</code>
            </li>
            <li>
              {" "}
              <strong>DeliveryMode</strong>: <code>In-person</code>,{" "}
              <code>Online (synchronous)</code>, <code>Online (asynchronous)</code>,{" "}
              <code>Hybrid</code>
            </li>
          </ul>
        </>
      }
      title="Formatting"
    />
  );
};

const Faq = () => {
  return (
    <TextSection
      body={
        <>
          Frequently Asked Questions
          <ul>
            <li>
              <em>How can I get support for the Schedulizer?</em> &mdash; Contact the{" "}
              <a href="https://computing.calvin.edu/">Department of Computer Science</a>.
            </li>
          </ul>
        </>
      }
      title="FAQ"
    />
  );
};
