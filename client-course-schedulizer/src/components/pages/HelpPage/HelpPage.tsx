import { Page } from "components/reuseables";
import React from "react";
import { TextSection } from "../AboutPage/.";

export const HelpPage = () => {
  return (
    <Page>
      <Functionality />
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
              Obtain a previous schedule in one of three ways:
              <ul>
                <li>
                  Use a CSV file previously exported from an older version Course Schedulizer
                  (before April 17, 2025).
                </li>
                <li>
                  Use an Excel file exported from a newer version of Course Schedulizer (after April
                  17, 2025).
                </li>
                <li>
                  Export a schedule (in Excel) using the &ldquo;Schedulizer Course Sections&rdquo;
                  report from <code>reports.calvin.edu</code>.
                </li>
              </ul>
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
            <li>Use the standard schedule editing features to make the required changes.</li>
          </ol>
          In extreme cases, you can edit the data in the Excel file directly. However, this is not
          recommended. The Schedulizer is designed to be used with the standard interface, and
          editing the Excel file directly may result in errors or unexpected behavior.
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
          <br />
          <br />
          <strong>To get support for the Schedulizer:</strong>
          <ul>
            <li>
              Contact the <a href="https://computing.calvin.edu/">Department of Computer Science</a>
              .{" "}
            </li>
          </ul>
        </>
      }
      title="Help"
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
