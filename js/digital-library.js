// Auto-generates 50 resource cards with downloadable PDFs
(function(){
  const resources = [
    {title:'HTML & CSS Basics', desc:'Introductory handbook to semantic HTML and modern CSS.', icon:'fa-code', file:'html-css-basics.pdf'},
    {title:'JavaScript Essentials', desc:'Core concepts of JS with examples and exercises.', icon:'fa-square-js', file:'javascript-essentials.pdf'},
    {title:'Bootstrap 5 Quickstart', desc:'Build responsive layouts with Bootstrap 5.', icon:'fa-bootstrap', file:'bootstrap-5-quickstart.pdf'},
    {title:'Git & GitHub Crash Course', desc:'Version control fundamentals for teams and individuals.', icon:'fa-code-branch', file:'git-github-crash-course.pdf'},
    {title:'Web Accessibility (a11y)', desc:'Practical guide to accessible, inclusive web design.', icon:'fa-universal-access', file:'web-accessibility.pdf'},
    {title:'Responsive Web Design', desc:'Patterns and techniques for responsive UX.', icon:'fa-mobile-screen-button', file:'responsive-web-design.pdf'},
    {title:'Computer Networking 101', desc:'Basic networking concepts, TCP/IP, routing.', icon:'fa-network-wired', file:'networking-101.pdf'},
    {title:'Database Design Primer', desc:'ER modeling, normalization, and schema design.', icon:'fa-database', file:'database-design-primer.pdf'},
    {title:'SQL Cookbook', desc:'Common SQL queries and optimization tips.', icon:'fa-table', file:'sql-cookbook.pdf'},
    {title:'NoSQL Overview', desc:'Key-value, document, column, and graph databases.', icon:'fa-server', file:'nosql-overview.pdf'},
    {title:'Linux Command Line Basics', desc:'Shell navigation, file ops, permissions.', icon:'fa-terminal', file:'linux-cli-basics.pdf'},
    {title:'Docker Fundamentals', desc:'Containers, images, and Docker Compose.', icon:'fa-box', file:'docker-fundamentals.pdf'},
    {title:'Cyber Security Starter', desc:'Threats, vulnerabilities, and best practices.', icon:'fa-shield-halved', file:'cyber-security-starter.pdf'},
    {title:'Web Security Essentials', desc:'OWASP Top 10 and mitigations.', icon:'fa-lock', file:'web-security-essentials.pdf'},
    {title:'Python for Beginners', desc:'Syntax, data structures, and scripts.', icon:'fa-python', file:'python-beginners.pdf'},
    {title:'Data Analysis with Python', desc:'NumPy, pandas, and plotting basics.', icon:'fa-chart-line', file:'data-analysis-python.pdf'},
    {title:'Intro to AI & ML', desc:'Foundational ML concepts and workflows.', icon:'fa-robot', file:'intro-ai-ml.pdf'},
    {title:'Prompt Engineering Basics', desc:'Practical patterns for LLM prompts.', icon:'fa-wand-magic-sparkles', file:'prompt-engineering-basics.pdf'},
    {title:'Graphic Design Principles', desc:'Typography, color, and layout basics.', icon:'fa-palette', file:'graphic-design-principles.pdf'},
    {title:'Adobe Photoshop Tips', desc:'Layers, masks, adjustments, and export.', icon:'fa-image', file:'photoshop-tips.pdf'},
    {title:'Adobe Illustrator Starter', desc:'Vector shapes, paths, and logos.', icon:'fa-pen-nib', file:'illustrator-starter.pdf'},
    {title:'UI/UX Fundamentals', desc:'User research, flows, and wireframes.', icon:'fa-object-group', file:'ui-ux-fundamentals.pdf'},
    {title:'Figma Quick Guide', desc:'Design systems and prototyping in Figma.', icon:'fa-shapes', file:'figma-quick-guide.pdf'},
    {title:'English Communication', desc:'Professional emails and presentations.', icon:'fa-language', file:'english-communication.pdf'},
    {title:'Technical Report Writing', desc:'Structure, clarity, and references.', icon:'fa-file-lines', file:'technical-report-writing.pdf'},
    {title:'Career Readiness', desc:'CV, interview prep, and soft skills.', icon:'fa-briefcase', file:'career-readiness.pdf'},
    {title:'Time Management', desc:'Prioritization frameworks and focus.', icon:'fa-clock', file:'time-management.pdf'},
    {title:'Automobile Basics', desc:'Engine components and maintenance.', icon:'fa-car', file:'automobile-basics.pdf'},
    {title:'Electrical Safety', desc:'Safe practices and standards.', icon:'fa-bolt', file:'electrical-safety.pdf'},
    {title:'HVACR Fundamentals', desc:'Thermodynamics, cycles, and systems.', icon:'fa-snowflake', file:'hvacr-fundamentals.pdf'},
    {title:'Welding Techniques', desc:'MIG, TIG, and arc welding basics.', icon:'fa-industry', file:'welding-techniques.pdf'},
    {title:'Machining Basics', desc:'Lathe, milling, and tolerances.', icon:'fa-gears', file:'machining-basics.pdf'},
    {title:'Motorcycle Mechanics', desc:'Two-stroke vs four-stroke essentials.', icon:'fa-motorcycle', file:'motorcycle-mechanics.pdf'},
    {title:'Mobile Repair Basics', desc:'Diagnostics, soldering, and parts.', icon:'fa-mobile-screen', file:'mobile-repair-basics.pdf'},
    {title:'Solar PV Technician', desc:'PV components, sizing, and safety.', icon:'fa-solar-panel', file:'solar-pv-technician.pdf'},
    {title:'Industrial Electrician', desc:'Motors, PLCs, and wiring diagrams.', icon:'fa-plug', file:'industrial-electrician.pdf'},
    {title:'C Programming Basics', desc:'Syntax, pointers, and memory.', icon:'fa-code', file:'c-programming-basics.pdf'},
    {title:'Java Fundamentals', desc:'OOP, collections, and streams.', icon:'fa-mug-hot', file:'java-fundamentals.pdf'},
    {title:'C# Quickstart', desc:'.NET basics and LINQ.', icon:'fa-hashtag', file:'csharp-quickstart.pdf'},
    {title:'Node.js Essentials', desc:'Modules, npm, and Express.', icon:'fa-node-js', file:'nodejs-essentials.pdf'},
    {title:'TypeScript in Practice', desc:'Types, generics, and tooling.', icon:'fa-tsunami', file:'typescript-in-practice.pdf'},
    {title:'React Basics', desc:'Components, state, and hooks.', icon:'fa-react', file:'react-basics.pdf'},
    {title:'DevOps Overview', desc:'CI/CD pipelines and monitoring.', icon:'fa-screwdriver-wrench', file:'devops-overview.pdf'},
    {title:'Cloud Fundamentals', desc:'IaaS, PaaS, and SaaS overview.', icon:'fa-cloud', file:'cloud-fundamentals.pdf'},
    {title:'Project Management', desc:'Agile, Scrum, and Kanban.', icon:'fa-diagram-project', file:'project-management.pdf'},
    {title:'Entrepreneurship 101', desc:'Ideation to MVP and beyond.', icon:'fa-lightbulb', file:'entrepreneurship-101.pdf'},
    {title:'Excel for Data', desc:'Formulas, pivots, and charts.', icon:'fa-file-excel', file:'excel-for-data.pdf'},
    {title:'PowerPoint Design', desc:'Slide design and storytelling.', icon:'fa-file-powerpoint', file:'powerpoint-design.pdf'},
    {title:'Career in Tech', desc:'Roadmaps and learning paths.', icon:'fa-road', file:'career-in-tech.pdf'},
    {title:'Interview Question Bank', desc:'Common questions and answers.', icon:'fa-question', file:'interview-question-bank.pdf'}
  ];

  // Ensure we have exactly 50; if fewer, pad by cycling
  const target = 50;
  const list = [];
  for (let i=0; i<target; i++) list.push(resources[i % resources.length]);

  const container = document.getElementById('resourcesContainer');
  if (!container) return;

  const pdfHref = '../pdfs/sample.pdf'; // same-origin file for download
  const toCard = (item, idx) => `
    <div class="resource-card fade-in" style="animation-delay:${(idx%10)*0.03}s">
      <div class="resource-image">
        <i class="fas ${item.icon}" aria-hidden="true"></i>
      </div>
      <div class="resource-content">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="resource-actions">
          <a href="${pdfHref}" download="${item.file}" class="action-btn btn-outline" aria-label="Download ${item.title} PDF">
            <i class="fas fa-download" aria-hidden="true"></i> Download
          </a>
        </div>
      </div>
    </div>`;

  container.innerHTML = list.map(toCard).join('');
})();
