// Digital Library: render 100 course-aligned items from open-access PDFs
(function(){
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

  // Course-aligned categories (for filtering chips)
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

  // Data + state
  let resources = [];

  // Render utils
  const container = document.getElementById('resourcesContainer');
  if (!container) return;

  const toCard = (item, idx) => {
    const tags = (item.tags || []).join(',');
    return `
    <div class=\"resource-card fade-in\" data-title=\"${slug(item.title)}\" data-desc=\"${slug(item.desc||'')}\" data-tags=\"${tags}\" style=\"animation-delay:${(idx%10)*0.03}s\">
      <div class=\"resource-image\">
        <i class=\"${item.iconClass}\" aria-hidden=\"true\"></i>
      </div>
      <div class=\"resource-content\">
        <h3>${item.title}</h3>
        <div class=\"resource-actions\">
          <a href=\"${item.url}\" target=\"_blank\" rel=\"noopener\" class=\"action-btn btn-outline\" aria-label=\"Open ${item.title} PDF\">
            <i class=\"fas fa-download\" aria-hidden=\"true\"></i> Open PDF
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

  // Prefer inline dataset if available (works without fetch/file restrictions)
  let base = [];
  const loadData = (list) => {
    const seen = new Set();
    resources = list.filter(x => x && x.url && /\.pdf(\?|$)/i.test(x.url) && !seen.has(x.url) && (seen.add(x.url) || true));
    if (resources.length > 100) resources = resources.slice(0,100);
    base = resources;
    render(base);
  };
  if (window.OPEN_PDFS && Array.isArray(window.OPEN_PDFS)) {
    loadData(window.OPEN_PDFS);
  } else {
    fetch('../js/resources-open.json').then(r => r.json()).then(loadData).catch(() => render([]));
  }

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
