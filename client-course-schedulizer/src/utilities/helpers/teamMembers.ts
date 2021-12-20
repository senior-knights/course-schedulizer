export interface TeamMember {
  bio: string;
  name: string;
  photo: string;
  website: string;
}

/* Basic information about the project team members */
export const team2020: TeamMember[] = [
  {
    bio:
      "Computer Science Student at Calvin University. Jonathan is a hard worker, a faster runner, and has previous web development experience.",
    name: "Jonathan Ellis",
    photo:
      "https://avatars3.githubusercontent.com/u/49655167?s=460&u=b81f525db7da58b19bc28588282b366cd8b748ab&v=4",
    website: "https://github.com/Jonri2",
  },
  {
    bio:
      "Computer Science and Mathematics Student at Calvin University. Bryant is hoping to go into software development while keeping Mathematics as a lifelong hobby.",
    name: "Bryant George",
    photo:
      "https://avatars1.githubusercontent.com/u/51130302?s=460&u=83737db9aeff2b377654a3e0a7cd3dc39f54f7ff&v=4",
    website: "https://github.com/bryantgeorge",
  },
  {
    bio:
      "Computer Science Student at Calvin University. Charles plans to start his software career post-graduation with Tekton as an ecommerce developer.",
    name: "Charles Kornoelje",
    photo:
      "https://avatars2.githubusercontent.com/u/33156025?s=460&u=fb61bdf55f17108f9687c334b4b4abc4b09c7259&v=4",
    website: "https://github.com/charkour",
  },
];

export const team2021: TeamMember[] = [
  {
    bio:
      "Computer Science Student at Calvin University. David is a gifted programmer, and has previous web development experience.",
    name: "David Sen",
    photo: "https://avatars.githubusercontent.com/u/31216720?v=4",
    website: "https://github.com/das43",
  },
  {
    bio:
      "Computer Science Student at Calvin University. Ryan is a quick learner who likes to learn new technologies and create useful computer software.",
    name: "Ryan Vreeke",
    photo:
      "https://avatars.githubusercontent.com/u/58562982?s=400&u=dad23251a36cf5a67ea0a7d3d25a204a8f6d8341&v=4",
    website: "https://github.com/Jonri2",
  },
];

export const teamAdvisors: TeamMember[] = [
  {
    bio:
      "Computer Science Professor and Department Chair at Calvin University. VanderLinden's research interests are in Natural Language Engineering and Human-Computer Interaction.",
    name: "Professor Keith VanderLinden",
    photo:
      "https://avatars0.githubusercontent.com/u/4930536?s=460&u=216f27d175496fec82a87e0c1c1c1514f73997da&v=4",
    website: "https://calvin.edu/directory/people/keith-vander-linden",
  },
  {
    bio:
      "Mathematics and Statistics Professor and Department Chair at Calvin University. Pruim's research interests are in Computational Statistics, Scientific Computing, and Statistics Education.",
    name: "Professor Randall Pruim",
    photo: "https://www.statistics.com/wp-content/uploads/2019/05/dr-randall-pruim.jpg",
    website: "https://calvin.edu/directory/people/randall-pruim",
  },
];
