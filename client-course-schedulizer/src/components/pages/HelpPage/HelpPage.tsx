import React from "react";
import { Page } from "components/reuseables";
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
					Beginning from blank - Click the Calvin University logo in the upper left corner to make sure you're on the starting page,
					then click "Add Section" to input a class. In the "Formatting" section on this page (below this text), you can read about some 
					recommended ways to format your inputs. Fill in all the values according to the class's parameters.
					
					Once you've created a class, your screen will change to show a calendar view. To add another class, click the "plus" (+) symbol 
					at the right side of the gray bar (this bar appears on the faculty schedule, room schedule, and department schedule pages).
					
					If you find yourself in the "Add Section" screen unintentionally, or need to back out of it for any reason, simply press your "Escape" key
					on your keyboard and you will return to where you were before.
					<br />
					<br />
					Importing CSV -  Presently, the system allows for the import of .csv files. You can import these files by clicking the "Import CSV" button on the main page,
					or by clicking the "Hamburger menu" (three lines in the upper left corner of the screen) and selecting "Import New Schedule."
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
	
   This is a work in progress Help page that team 2023 is continuing to update.
	
   Below is provided some formatting help:
	<ul>
	<li> Department: string (like `Mathematics`)</li>
	<li> *Term: (FA | SP | IN) (like `SP` for Spring)</li>
	<li> TermStart: mm/dd/yyyy (like `3/29/2021` or `12/1/2022`)</li>
	<li> *AcademicYear: yyyy (like `2021`)</li>
	<li> *SectionName: SubjectCode-CourseNum-SectionCode (like `MATH-252-B`)</li>
	<li> SubjectCode: string (like `MATH`)</li>
	<li> CourseNum: string (like `252` or `252L` for a lab)</li>
	<li> SectionCode: string (like `B`)</li>
	<li> CourseLevelCode: pos num (like `200` for a 200 level course)</li>
	<li> MinimumCredits: pos num (like `3` or `3.5`)</li>
	<li> FacultyLoad: pos num (like `4` or `4.5`)</li>
	<li> *Used: pos num (like `20`)</li>
	<li> *Day10Used: pos num (like `22`)</li>
	<li> *LocalMax: pos num (like `25`)</li>
	<li> *GlobalMax: pos num (like `30`)</li>
	<li> *RoomCapacity: pos num (like `32`)</li>
	<li> BuildingAndRoom: string (like `HH 345`)</li>
	<li> MeetingDays: M?T?W?(TH)?F? (like `MWTHF`)</li>
	<li> MeetingTime: xx:xx(AM | PM) - xx:xx(AM | PM) (like `9:00AM - 9:50AM`)</li>
	<li> SectionStartDate: mm/dd/yyyy (like `3/29/2021` or `12/1/2022`)</li>
	<li> SectionEndDate: mm/dd/yyyy (like `3/29/2021` or `12/1/2022`)</li>
	<li> *Building: string (like `HH`)</li>
	<li> *RoomNumber: string (like `345`)</li>
	<li> MeetingStart: xx:xx(AM | PM) (like `2:30PM`)</li>
	<li> *MeetingStartInternal: xx:xx:xx 24-hour (like `14:30:00`)</li>
	<li> MeetingEnd: xx:xx(AM | PM) (like `3:20PM`)</li>
	<li> *MeetingEndInternal: xx:xx:xx 24-hour (like `13:20:00`)</li>
	<li> *Monday: `M` or empty</li>
	<li> *Tuesday: `T` or empty</li>
	<li> *Wednesday: `W` or empty</li>
	<li> *Thursday: `TH` or empty</li>
	<li> *Friday: `F` or empty</li>
	<li> ShortTitle: string (like `Number Theory`)</li>
	<li> Faculty: string (first and last) (like `Paul Erdos`)</li>
	<li> *SectionStatus: string (like `Active`)</li>
	<li> InstructionalMethod: `LEC`, `CPI`, `IND`, `TUT`, or `SEM`</li>
	<li> DeliveryMode: `In-person`, `Online (synchronous)`, `Online (asynchronous)`, `Hybrid`</li>
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
					Frequently Asked Questions - To be developed over time
				</>
			}
		title="FAQ"
		/>
	);
}