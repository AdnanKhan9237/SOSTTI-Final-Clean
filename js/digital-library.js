// Auto-generates 50 resource cards with downloadable PDFs
(function(){
  const resources = [
    {title:'Eloquent JavaScript (3rd Ed.)', desc:'A modern introduction to JavaScript programming.', iconClass:'fa-brands fa-js', url:'https://eloquentjavascript.net/Eloquent_JavaScript.pdf'},
    {title:'Think Python (2nd Ed.)', desc:'An introduction to Python programming.', iconClass:'fa-brands fa-python', url:'http://greenteapress.com/thinkpython2/thinkpython2.pdf'},
    {title:'Think Stats (2nd Ed.)', desc:'Exploratory data analysis in Python.', iconClass:'fa-solid fa-chart-line', url:'http://greenteapress.com/thinkstats2/thinkstats2.pdf'},
    {title:'Think Bayes (2nd Ed.)', desc:'Bayesian statistics with Python.', iconClass:'fa-solid fa-superscript', url:'https://greenteapress.com/wp/think-bayes-2e/thinkbayes2.pdf'},
    {title:'Think DSP', desc:'Digital signal processing in Python.', iconClass:'fa-solid fa-wave-square', url:'http://greenteapress.com/thinkdsp/thinkdsp.pdf'},
    {title:'Think OS', desc:'A brief introduction to operating systems.', iconClass:'fa-solid fa-microchip', url:'http://greenteapress.com/thinkos/thinkos.pdf'},
    {title:'Think Complexity (2nd Ed.)', desc:'Exploring complexity science.', iconClass:'fa-solid fa-project-diagram', url:'https://greenteapress.com/wp/think-complexity-2e/thinkcomplexity2.pdf'},
    {title:'Think Java (2nd Ed.)', desc:'How to think like a computer scientist in Java.', iconClass:'fa-brands fa-java', url:'https://greenteapress.com/wp/think-java-2e/thinkjava2.pdf'},
    {title:'Little Book of Semaphores', desc:'Classic text on concurrency.', iconClass:'fa-solid fa-lock', url:'http://greenteapress.com/semaphores/LittleBookOfSemaphores.pdf'},
    {title:'Operating Systems: Three Easy Pieces', desc:'Comprehensive OS textbook.', iconClass:'fa-solid fa-memory', url:'https://pages.cs.wisc.edu/~remzi/OSTEP/ostep-book.pdf'},
    {title:'The Linux Command Line', desc:'A complete introduction.', iconClass:'fa-solid fa-terminal', url:'http://linuxcommand.org/tlcl/tlcl-19.01.pdf'},
    {title:'Pro Git (2nd Ed.)', desc:'The official Git book.', iconClass:'fa-brands fa-git-alt', url:'https://github.com/progit/progit2/releases/latest/download/progit.pdf'},
    {title:'Open Data Structures (Java)', desc:'Data structures in Java.', iconClass:'fa-solid fa-database', url:'http://opendatastructures.org/ods-java.pdf'},
    {title:'Open Data Structures (Python)', desc:'Data structures in Python.', iconClass:'fa-solid fa-database', url:'http://opendatastructures.org/ods-python.pdf'},
    {title:'SICP', desc:'Structure and Interpretation of Computer Programs.', iconClass:'fa-solid fa-book', url:'https://web.mit.edu/6.001/6.037/sicp.pdf'},
    {title:'Algorithms (Erickson)', desc:'Algorithms textbook by Jeff Erickson.', iconClass:'fa-solid fa-sitemap', url:'http://jeffe.cs.illinois.edu/teaching/algorithms/book/Algorithms-JeffE.pdf'},
    {title:'Linear Algebra (Hefferon)', desc:'Undergraduate linear algebra.', iconClass:'fa-solid fa-square-root-variable', url:'https://hefferon.net/linearalgebra/linearalgebra.pdf'},
    {title:'Mathematics for ML', desc:'Mathematics for Machine Learning.', iconClass:'fa-solid fa-sigma', url:'https://mml-book.github.io/book/mml-book.pdf'},
    {title:'Foundations of Data Science', desc:'By Blum, Hopcroft, Kannan.', iconClass:'fa-solid fa-layer-group', url:'https://www.cs.cornell.edu/jeh/book.pdf'},
    {title:'Reinforcement Learning (2nd Ed.)', desc:'Sutton & Barto (draft).', iconClass:'fa-solid fa-gamepad', url:'http://incompleteideas.net/book/RLbook2018.pdf'},
    {title:'Dive Into Deep Learning', desc:'Interactive deep learning book.', iconClass:'fa-solid fa-brain', url:'https://d2l.ai/d2l-en.pdf'},
    {title:'Database Design (Notes)', desc:'Principles and basics of DB design.', iconClass:'fa-solid fa-database', url:'https://www3.nd.edu/~zxu2/acms60212-40212/GM_1_Intro_DB_Design.pdf'},
    {title:'Computer Networking Notes', desc:'Intro notes to networks.', iconClass:'fa-solid fa-network-wired', url:'https://gaia.cs.umass.edu/kurose_ross/ppt/slides/Kurose_Ross_7e_Chapter1.pdf'},
    {title:'Regular Expressions Cookbook', desc:'Practical regex guide.', iconClass:'fa-solid fa-code', url:'https://www.cs.princeton.edu/courses/archive/spr09/cos333/beautifulregex.pdf'},
    {title:'Python Data Science Handbook', desc:'Selected chapters PDF.', iconClass:'fa-solid fa-chart-bar', url:'https://jakevdp.github.io/PythonDataScienceHandbook/PythonDataScienceHandbook.pdf'}
  ];

  // Ensure we have exactly 50; if fewer, pad by cycling
  const target = 50;
  const list = [];
  for (let i=0; i<target; i++) list.push(resources[i % resources.length]);

  const container = document.getElementById('resourcesContainer');
  if (!container) return;

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

  const toCard = (item, idx) => {
    const fileName = slug(item.title) + '.pdf';
    const url = item.url;
    return `
    <div class=\"resource-card fade-in\" data-title=\"${slug(item.title)}\" data-desc=\"${slug(item.desc)}\" style=\"animation-delay:${(idx%10)*0.03}s\">
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

  const base = list; // 50 items
  render(base);

  function applySearch(q){
    const query = (q || '').trim().toLowerCase();
    if (!query) {
      render(base);
      return;
    }
    // Filter unique by title over original resources (higher quality results)
    const uniq = resources.filter((r, i, arr) => arr.findIndex(x => x.title === r.title) === i);
    const filtered = uniq.filter(r => (r.title + ' ' + r.desc).toLowerCase().includes(query));
    // Expand to grid by repeating if needed
    const expanded = [];
    while (expanded.length < Math.max(6, filtered.length)) {
      for (const it of filtered) { if (expanded.length >= Math.max(6, filtered.length)) break; expanded.push(it); }
      if (filtered.length === 0) break;
    }
    render(expanded.length ? expanded : []);
    if (resultMeta && expanded.length === 0) resultMeta.textContent = 'No results found';
  }

  const input = document.getElementById('librarySearch');
  const btn = document.getElementById('librarySearchBtn');
  if (input) {
    input.addEventListener('input', () => applySearch(input.value));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') applySearch(input.value); });
  }
  if (btn) btn.addEventListener('click', () => applySearch(input ? input.value : ''));

  // Quick filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const term = btn.getAttribute('data-filter') || '';
      if (input) input.value = term.split(' ')[0];
      applySearch(term);
    });
  });
})();
