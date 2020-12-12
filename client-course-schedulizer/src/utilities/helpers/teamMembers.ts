export interface TeamMember {
  bio: string;
  name: string;
  photo: string;
  website: string;
}

/* Basic information about the project team members */
export const team: TeamMember[] = [
  {
    bio:
      "Computer Science student at Calvin University. Jonathan is a hard worker, a faster runner, and has previous web development experience.",
    name: "Jonathan Ellis",
    photo:
      "https://avatars3.githubusercontent.com/u/49655167?s=460&u=b81f525db7da58b19bc28588282b366cd8b748ab&v=4",
    website: "https://github.com/Jonri2",
  },
  {
    bio:
      "Computer Science and Mathematics at Calvin University. Bryant hoping to go into software development while keeping Mathematics as a lifelong hobby.",
    name: "Bryant George",
    photo:
      "https://avatars1.githubusercontent.com/u/51130302?s=460&u=83737db9aeff2b377654a3e0a7cd3dc39f54f7ff&v=4",
    website: "https://github.com/Syobnaf",
  },
  {
    bio:
      "Computer Science student at Calvin University. Charles plans to start his software career post-graduation with Tekton as an ecommerce developer.",
    name: "Charles Kornoelje",
    photo:
      "https://avatars2.githubusercontent.com/u/33156025?s=460&u=fb61bdf55f17108f9687c334b4b4abc4b09c7259&v=4",
    website: "https://github.com/charkour",
  },
  {
    bio:
      "Computer Science Professor Department Chair at Calvin University. Keith's research interests are in Natural Language Engineering and Human-Computer Interaction.",
    name: "Professor Keith VanderLinden",
    photo:
      "https://avatars0.githubusercontent.com/u/4930536?s=460&u=216f27d175496fec82a87e0c1c1c1514f73997da&v=4",
    website: "https://calvin.edu/directory/people/keith-vander-linden",
  },
  {
    bio:
      "Mathematics and Statistics Professor and Department Chair at Calvin University. Randall's interests are in computational statistics, scientific computing, and statistics education.",
    name: "Professor Randall Pruim",
    photo: "https://www.statistics.com/wp-content/uploads/2019/05/dr-randall-pruim.jpg",
    website: "https://calvin.edu/directory/people/randall-pruim",
  },
];
