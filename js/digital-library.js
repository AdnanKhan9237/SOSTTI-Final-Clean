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

    const categories = ['computer','graphics','web','cyber','ai','english','auto','hvacr','welding','motorcycle','machinist','electrician','mobile','solar'];
    const used = new Set();
    const buckets = {};
    categories.forEach(c => buckets[c] = []);
    resources.forEach(r => {
      (r.tags || []).forEach(t => { if (buckets[t]) buckets[t].push(r); });
    });

    base = [];
    // Ensure at least one per category if possible
    categories.forEach(c => {
      const arr = buckets[c];
      if (arr && arr.length) {
        const item = arr.find(x => !used.has(x.url));
        if (item) { base.push(item); used.add(item.url); }
      }
    });

    // Round-robin fill to 50
    let idx = 0;
    while (base.length < 50) {
      const c = categories[idx % categories.length];
      const arr = buckets[c];
      const next = arr && arr.find(x => !used.has(x.url));
      if (next) { base.push(next); used.add(next.url); }
      idx++;
      if (idx > 2000) break;
      if (idx % categories.length === 0) {
        let anyLeft = false;
        for (const cat of categories) {
          if (buckets[cat] && buckets[cat].some(x => !used.has(x.url))) { anyLeft = true; break; }
        }
        if (!anyLeft) break;
      }
    }

    // Fill from remaining if still short
    if (base.length < 50) {
      for (const r of resources) {
        if (base.length >= 50) break;
        if (!used.has(r.url)) { base.push(r); used.add(r.url); }
      }
    }

    render(base);
  };
  if (window.OPEN_PDFS && Array.isArray(window.OPEN_PDFS)) {
    loadData(window.OPEN_PDFS);
  } else {
    fetch('../js/resources-open.json').then(r => r.json()).then(loadData).catch(() => render([]));
  }

  // Ensure underrepresented courses have at least a few items
  function ensureCategory(tag, items) {
    const has = base.some(r => (r.tags || []).includes(tag));
    if (!has) {
      const seen = new Set(base.map(r => r.url));
      items.forEach(it => { if (!seen.has(it.url)) { base.push(it); seen.add(it.url); } });
      if (base.length > 100) base = base.slice(0,100);
      render(base);
    }
  }
  const curated = {
    graphics: [
      { title: 'NASA Graphics Standards Manual', iconClass: 'fa-solid fa-palette', url: 'https://www.nasa.gov/wp-content/uploads/2019/08/nasa-graphics-standards-manual.pdf', tags: ['graphics'] }
    ],
    mobile: [
      { title: 'NIST SP 800-124 Rev.2 Mobile Device Security', iconClass: 'fa-solid fa-mobile-screen', url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-124r2.pdf', tags: ['mobile','cyber'] }
    ],
    computer: [
      { title: 'The Linux Command Line (TLCL)', iconClass: 'fa-solid fa-computer', url: 'http://linuxcommand.org/tlcl/tlcl-19.01.pdf', tags: ['computer'] }
    ],
    web: [
      { title: 'Eloquent JavaScript (PDF)', iconClass: 'fa-solid fa-globe', url: 'https://eloquentjavascript.net/Eloquent_JavaScript.pdf', tags: ['web'] }
    ],
    cyber: [
      { title: 'NIST SP 800-53 Rev.5 (Security & Privacy Controls)', iconClass: 'fa-solid fa-shield-halved', url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf', tags: ['cyber'] }
    ],
    ai: [
      { title: 'Dive Into Deep Learning (D2L)', iconClass: 'fa-solid fa-robot', url: 'https://d2l.ai/d2l-en.pdf', tags: ['ai'] }
    ],
    english: [
      { title: 'Federal Plain Language Guidelines', iconClass: 'fa-solid fa-language', url: 'https://www.plainlanguage.gov/media/FederalPLGuidelines.pdf', tags: ['english'] }
    ],
    hvacr: [
      { title: 'Advanced Energy Retrofit Guide: K-12 Schools', iconClass: 'fa-solid fa-snowflake', url: 'https://www.nrel.gov/docs/fy13osti/51770.pdf', tags: ['hvacr'] }
    ],
    welding: [
      { title: 'OSHA Welding, Cutting, and Brazing Fact Sheet', iconClass: 'fa-solid fa-industry', url: 'https://www.osha.gov/sites/default/files/publications/OSHA_FS-3647_Welding.pdf', tags: ['welding'] }
    ],
    auto: [
      { title: 'NHTSA Tire Safety Brochure', iconClass: 'fa-solid fa-car', url: 'https://www.nhtsa.gov/sites/nhtsa.gov/files/documents/809361_tires_safety_brochure.pdf', tags: ['auto'] }
    ],
    motorcycle: [
      { title: 'NHTSA Motorcycle Safety (Traffic Safety Facts)', iconClass: 'fa-solid fa-motorcycle', url: 'https://www.nhtsa.gov/sites/nhtsa.gov/files/documents/812706_motorcycle_safety_0.pdf', tags: ['motorcycle'] }
    ],
    machinist: [
      { title: 'OSHA Machine Guarding', iconClass: 'fa-solid fa-gear', url: 'https://www.osha.gov/sites/default/files/publications/osha3170.pdf', tags: ['machinist'] }
    ],
    electrician: [
      { title: 'OSHA Electrical Safety (OSHA 3075)', iconClass: 'fa-solid fa-bolt', url: 'https://www.osha.gov/sites/default/files/publications/osha3075.pdf', tags: ['electrician'] }
    ],
    solar: [
      { title: 'Best Practices for PV System Installation', iconClass: 'fa-solid fa-solar-panel', url: 'https://www.nrel.gov/docs/fy13osti/57158.pdf', tags: ['solar'] }
    ]
  };
  // Defer a tick to allow loadData to run first
  setTimeout(() => {
    ensureCategory('graphics', curated.graphics);
    ensureCategory('mobile', curated.mobile);
    ensureCategory('computer', curated.computer);
    ensureCategory('web', curated.web);
    ensureCategory('cyber', curated.cyber);
    ensureCategory('ai', curated.ai);
    ensureCategory('english', curated.english);
    ensureCategory('hvacr', curated.hvacr);
    ensureCategory('welding', curated.welding);
    ensureCategory('auto', curated.auto);
    ensureCategory('motorcycle', curated.motorcycle);
    ensureCategory('machinist', curated.machinist);
    ensureCategory('electrician', curated.electrician);
    ensureCategory('solar', curated.solar);
  }, 0);

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
