export const templates = [
  {
    id: "blank",
    label: "Blank Document",
    imageUrl: "/blank-document.jpg",
    initialContent: ``,
  },
  {
    id: "software-proposal",
    label: "Software development proposal",
    imageUrl: "/software-proposal.jpg",
    initialContent: `
<h1>Software Development Proposal</h1>
<h2>Executive Summary</h2>
<p>Brief overview of the problem, proposed solution, and expected outcomes.</p>
<h2>Objectives</h2>
<ul>
  <li>Deliver feature X to improve Y.</li>
  <li>Reduce latency or cost by Z%.</li>
</ul>
<h2>Scope</h2>
<p>High-level description of features, exclusions, and constraints.</p>
<h2>Timeline</h2>
<p>Milestones with estimated dates.</p>
<h2>Budget</h2>
<p>Estimated costs and resource needs.</p>
`,
  },
  {
    id: "project-proposal",
    label: "Project proposal",
    imageUrl: "/project-proposal.jpg",
    initialContent: `
<h1>Project Proposal</h1>
<h2>Overview</h2>
<p>One-paragraph summary of the project and its purpose.</p>
<h2>Goals</h2>
<ul>
  <li>Primary goal 1</li>
  <li>Primary goal 2</li>
</ul>
<h2>Deliverables</h2>
<p>List of expected deliverables and acceptance criteria.</p>
<h2>Schedule</h2>
<p>Key milestones and dates.</p>
`,
  },
  {
    id: "business-letter",
    label: "Business letter",
    imageUrl: "/business-letter.jpg",
    initialContent: `
<p>{Date}</p>
<p>{Recipient Name}<br/>{Company}<br/>{Address Line 1}<br/>{City, State ZIP}</p>
<p>Dear {Recipient Name},</p>
<p>Introduction — state the purpose of the letter in one paragraph.</p>
<p>Body — provide supporting details, background, and any requests.</p>
<p>Closing — state next steps and appreciation.</p>
<p>Sincerely,<br/>{Your Name}<br/>{Your Title}</p>
`,
  },
  {
    id: "resume",
    label: "Resume",
    imageUrl: "/resume.jpg",
    initialContent: `
<h1>[Full Name]</h1>
<p>[Title] • [Location] • [Email] • [Phone]</p>
<h2>Summary</h2>
<p>Two-line professional summary highlighting strengths and focus areas.</p>
<h2>Experience</h2>
<h3>[Company] — [Role]</h3>
<p>[Start Date] — [End Date]</p>
<ul>
  <li>Key achievement or responsibility</li>
  <li>Another accomplishment with metrics</li>
</ul>
<h2>Education</h2>
<p>[Degree], [Institution], [Year]</p>
`,
  },
  {
    id: "cover-letter",
    label: "Cover letter",
    imageUrl: "/cover-letter.jpg",
    initialContent: `
<p>{Date}</p>
<p>{Hiring Manager Name}<br/>{Company}<br/>{Address}</p>
<p>Dear {Hiring Manager Name},</p>
<p>Opening — state the position you are applying for and a brief hook.</p>
<p>Middle — highlight relevant experience, skills, and why you are a fit.</p>
<p>Closing — thank the reader and mention next steps or availability.</p>
<p>Sincerely,<br/>{Your Name}</p>
`,
  },
  {
    id: "letter",
    label: "Letter",
    imageUrl: "/letter.jpg",
    initialContent: `
<p>{Date}</p>
<p>Dear {Name},</p>
<p>Opening paragraph — friendly greeting and purpose.</p>
<p>Body paragraph(s) — details, stories, or requests.</p>
<p>Closing paragraph — wrap up and sign off.</p>
<p>Best regards,<br/>{Your Name}</p>
`,
  },
];