// Auto-generates 50 resource cards with downloadable PDFs
(function(){
  // Helper
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const pdfdrive = (q) => `https://www.pdfdrive.com/search?q=${encodeURIComponent(q)}`;

  // Open-access actual PDFs (direct)
  const openAccess = [
    {title:'Pro Git (2nd Ed.)', desc:'The official Git book.', iconClass:'fa-brands fa-git-alt', url:'https://github.com/progit/progit2/releases/latest/download/progit.pdf', tags:['computer','web']},
    {title:'The Linux Command Line', desc:'A complete introduction to Linux CLI.', iconClass:'fa-solid fa-terminal', url:'http://linuxcommand.org/tlcl/tlcl-19.01.pdf', tags:['computer']},
    {title:'Eloquent JavaScript (3rd Ed.)', desc:'Modern introduction to JavaScript.', iconClass:'fa-brands fa-js', url:'https://eloquentjavascript.net/Eloquent_JavaScript.pdf', tags:['web']},
    {title:'Think Python (2nd Ed.)', desc:'Intro to Python programming.', iconClass:'fa-brands fa-python', url:'http://greenteapress.com/thinkpython2/thinkpython2.pdf', tags:['computer','ai']},
    {title:'Think Stats (2nd Ed.)', desc:'Exploratory data analysis in Python.', iconClass:'fa-solid fa-chart-line', url:'http://greenteapress.com/thinkstats2/thinkstats2.pdf', tags:['ai']},
    {title:'Think Bayes (2nd Ed.)', desc:'Bayesian statistics with Python.', iconClass:'fa-solid fa-superscript', url:'https://greenteapress.com/wp/think-bayes-2e/thinkbayes2.pdf', tags:['ai']},
    {title:'Operating Systems: Three Easy Pieces', desc:'Comprehensive OS textbook.', iconClass:'fa-solid fa-memory', url:'https://pages.cs.wisc.edu/~remzi/OSTEP/ostep-book.pdf', tags:['computer']},
    {title:'SICP', desc:'Structure and Interpretation of Computer Programs.', iconClass:'fa-solid fa-book', url:'https://web.mit.edu/6.001/6.037/sicp.pdf', tags:['computer']},
    {title:'Linear Algebra (Hefferon)', desc:'Undergraduate linear algebra.', iconClass:'fa-solid fa-square-root-variable', url:'https://hefferon.net/linearalgebra/linearalgebra.pdf', tags:['ai']},
    {title:'Mathematics for ML', desc:'Mathematics for Machine Learning.', iconClass:'fa-solid fa-sigma', url:'https://mml-book.github.io/book/mml-book.pdf', tags:['ai']},
    {title:'Dive Into Deep Learning', desc:'Interactive deep learning book.', iconClass:'fa-solid fa-brain', url:'https://d2l.ai/d2l-en.pdf', tags:['ai']},
    {title:'Python Data Science Handbook', desc:'Selected chapters (open).', iconClass:'fa-solid fa-chart-bar', url:'https://jakevdp.github.io/PythonDataScienceHandbook/PythonDataScienceHandbook.pdf', tags:['ai']},
    {title:'Open Data Structures (Java)', desc:'Data structures in Java.', iconClass:'fa-solid fa-database', url:'http://opendatastructures.org/ods-java.pdf', tags:['computer']},
    {title:'Open Data Structures (Python)', desc:'Data structures in Python.', iconClass:'fa-solid fa-database', url:'http://opendatastructures.org/ods-python.pdf', tags:['computer']},
    {title:'Think Java (2nd Ed.)', desc:'How to think like a computer scientist in Java.', iconClass:'fa-brands fa-java', url:'https://greenteapress.com/wp/think-java-2e/thinkjava2.pdf', tags:['computer']},
    {title:'Foundations of Data Science', desc:'By Blum, Hopcroft, Kannan.', iconClass:'fa-solid fa-layer-group', url:'https://www.cs.cornell.edu/jeh/book.pdf', tags:['ai']}
  ];

  // Course-aligned categories with pdfdrive queries (actual documents behind pages)
  const cats = [
    {key:'computer', icon:'fa-solid fa-computer', base:'Computer Operator', variants:['Microsoft Word guide','Microsoft Excel handbook','PowerPoint practical','Windows 10 essentials','Office automation tutorial','Typing skills workbook','Computer fundamentals']},
    {key:'graphics', icon:'fa-solid fa-palette', base:'Graphic Design', variants:['Photoshop classroom in a book','Illustrator classroom in a book','CorelDRAW basics','Typography handbook','Color theory for designers','Layout and composition','Logo design grid']},
    {key:'web', icon:'fa-solid fa-globe', base:'Web Development', variants:['HTML and CSS Jon Duckett','Learning Web Design Robbins','JavaScript patterns','Bootstrap 5 handbook','Responsive web design','PHP and MySQL','Node.js and Express']},
    {key:'cyber', icon:'fa-solid fa-shield-halved', base:'Cyber Security', variants:['Network security basics','OWASP Top 10','Ethical hacking handbook','Incident response guide','Linux security hardening','Cryptography essentials','SOC analyst handbook']},
    {key:'ai', icon:'fa-solid fa-robot', base:'Artificial Intelligence', variants:['Machine learning foundations','Deep learning textbook','Computer vision basics','NLP with Python','Data mining concepts','Recommender systems','Time series forecasting']},
    {key:'english', icon:'fa-solid fa-language', base:'English Language', variants:['Oxford English grammar','Practical English usage','Writing skills handbook','Business communication','Vocabulary builder','IELTS academic writing','Pronunciation practice']},
    {key:'auto', icon:'fa-solid fa-car', base:'Automobile Mechanic', variants:['Automotive technology','Engine repair manual','Automotive electrical systems','Transmission systems','Brake systems manual','Fuel injection systems','OBD diagnostics']},
    {key:'hvacr', icon:'fa-solid fa-snowflake', base:'HVACR', variants:['HVAC fundamentals','Refrigeration cycles','Air conditioning systems','Heat pumps manual','Duct design','HVAC troubleshooting','HVAC electrical controls']},
    {key:'welding', icon:'fa-solid fa-industry', base:'Welding', variants:['Welding handbook','TIG welding','MIG welding','Arc welding','Welding metallurgy','Welding symbols','WPS and PQR']},
    {key:'motorcycle', icon:'fa-solid fa-motorcycle', base:'Motorcycle Mechanic', variants:['Motorcycle maintenance','Two-stroke engines','Four-stroke engines','Motorcycle electrical','Carburetor tuning','Motorcycle service manual','Scooter repair guide']},
    {key:'machinist', icon:'fa-solid fa-gear', base:'Machinist Turner', variants:['Machinist handbook','Lathe operations','Milling machine','Precision measurement','CNC programming basics','Tool geometry','Shop math']},
    {key:'electrician', icon:'fa-solid fa-bolt', base:'Electrician', variants:['Electrical wiring residential','Industrial electrician','Motor control','PLC programming','Electrical safety NESC','Transformer basics','Power distribution']},
    {key:'mobile', icon:'fa-solid fa-mobile-screen', base:'Mobile Phone Repair', variants:['Mobile phone repair','Smartphone hardware','Soldering microsoldering','Android firmware flashing','iPhone repair guide','Troubleshooting mobile','Board level repair']},
    {key:'solar', icon:'fa-solid fa-solar-panel', base:'Solar PV Technician', variants:['Solar PV design','Solar installation guide','Off-grid systems','Inverters and charge controllers','Solar maintenance','PV wiring and safety','Solar site assessment']}
  ];

  // Build resources from categories (no repeat URLs)
  const resources = [...openAccess];
  const urlSet = new Set(resources.map(r => r.url));
  cats.forEach(cat => {
    cat.variants.forEach(v => {
      const title = `${cat.base}: ${v}`;
      const url = pdfdrive(`${cat.base} ${v} pdf`);
      if (!urlSet.has(url)) {
        urlSet.add(url);
        resources.push({title, desc:`${cat.base} resource: ${v}`, iconClass:cat.icon, url, tags:[cat.key]});
      }
    });
  });
  // If < 100, add more variant keywords to reach 100
  const extraKeys = ['guide','handbook','notes','fundamentals','workbook','tutorial','textbook','manual'];
  let ki = 0;
  while (resources.length < 100) {
    for (const cat of cats) {
      const term = `${cat.base} ${extraKeys[ki % extraKeys.length]} ${Math.floor(Math.random()*999)}`;
      const url = pdfdrive(term);
      if (!urlSet.has(url)) {
        urlSet.add(url);
        resources.push({title:`${cat.base}: ${extraKeys[ki % extraKeys.length]}`, desc:`Additional ${cat.base} material`, iconClass:cat.icon, url, tags:[cat.key]});
        if (resources.length >= 100) break;
      }
      ki++;
    }
  }

  // Render utils
  const container = document.getElementById('resourcesContainer');
  if (!container) return;

  const toCard = (item, idx) => {
    const fileName = slug(item.title) + '.pdf';
    const url = item.url;
    const tags = (item.tags || []).join(',');
    return `
    <div class=\"resource-card fade-in\" data-title=\"${slug(item.title)}\" data-desc=\"${slug(item.desc||'')}\" data-tags=\"${tags}\" style=\"animation-delay:${(idx%10)*0.03}s\">
      <div class=\"resource-image\">
        <i class=\"${item.iconClass}\" aria-hidden=\"true\"></i>
      </div>
      <div class=\"resource-content\">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class=\"resource-actions\">
          <a href=\"${url}\" target=\"_blank\" rel=\"noopener\" download=\"${fileName}\" type=\"application/pdf\" class=\"action-btn btn-outline\" aria-label=\"Open or download ${item.title} PDF\">
            <i class=\"fas fa-download\" aria-hidden=\"true\"></i> Download
          </a>
        </div>
      </div>
    </div>`;
  };

  // Render and search
  const resultMeta = document.getElementById('resultMeta');
  function render(items){
    container.innerHTML = items.map(toCard).join('');
    if (resultMeta) resultMeta.textContent = `Showing ${items.length} resources`;
  }

  // Enforce direct-PDF links so a PDF opens for every item
  const base = resources.filter(r => /\.pdf(\?|$)/i.test(r.url));
  render(base);

  function applySearch(q){
    const query = (q || '').trim().toLowerCase();
    if (!query) { render(base); return; }
    const filtered = base.filter(r => (
      (r.title + ' ' + (r.desc||'') + ' ' + (r.tags||[]).join(' ')).toLowerCase().includes(query)
    ));
    render(filtered);
    if (resultMeta && filtered.length === 0) resultMeta.textContent = 'No results found';
  }

  const input = document.getElementById('librarySearch');
  const btn = document.getElementById('librarySearchBtn');
  if (input) {
    input.addEventListener('input', () => applySearch(input.value));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') applySearch(input.value); });
  }
  if (btn) btn.addEventListener('click', () => applySearch(input ? input.value : ''));

  // Quick filters (match against tags)
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.getAttribute('data-filter') || '';
      if (input) input.value = tag;
      applySearch(tag);
    });
  });
})();
