class ImageAdCarousel {
    constructor() {
        // ----- CONFIG -----
        this.ads = [
            'images/ads/EnglishLanguage.jpg'
        ];
        this.delay = 4000;                 // show after 4 s
        this.current = 0;
        // ------------------

        this.init();
    }

    init() {
        if (document.getElementById('ad-carousel-overlay')) return; // prevent duplicates

        this.createStyles();
        this.createHTML();
        this.bindEvents();
        this.preload();

        setTimeout(() => this.show(), this.delay);
    }

    /* -------------------- CSS -------------------- */
    createStyles() {
        const s = document.createElement('style');
        s.id = 'ad-carousel-styles';
        s.textContent = `
            #ad-carousel-overlay{
                display:none;position:fixed;top:0;left:0;width:100%;height:100%;
                background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);
                z-index:99999;justify-content:center;align-items:center;
                padding:12px;animation:fadeIn .3s ease-out;
            }
            #ad-carousel-popup{
                position:relative;width:100%;max-width:520px;
                border-radius:16px;overflow:hidden;
                box-shadow:0 10px 30px rgba(0,0,0,.3);
                animation:scaleIn .3s ease-out;
            }
            #ad-carousel-img{
                width:100%;height:auto;display:block;border-radius:16px;
            }
            .ad-close{
                position:absolute;top:8px;right:8px;width:36px;height:36px;
                background:rgba(0,0,0,.7);color:#fff;border:none;
                border-radius:50%;font-size:20px;font-weight:bold;
                cursor:pointer;display:flex;align-items:center;
                justify-content:center;transition:all .2s;z-index:10;
            }
            .ad-close:hover,.ad-close:focus{
                background:#000;transform:scale(1.1);
            }
            .ad-nav{
                position:absolute;top:50%;transform:translateY(-50%);
                background:rgba(0,0,0,.6);color:#fff;border:none;
                width:40px;height:40px;border-radius:50%;font-size:22px;
                cursor:pointer;display:flex;align-items:center;
                justify-content:center;transition:all .2s;z-index:10;
            }
            .ad-nav:hover{background:rgba(0,0,0,.9);}
            .ad-prev{left:12px;}
            .ad-next{right:12px;}
            .ad-dots{
                position:absolute;bottom:12px;left:50%;transform:translateX(-50%);
                display:flex;gap:8px;z-index:10;
            }
            .ad-dot{
                width:9px;height:9px;background:rgba(255,255,255,.5);
                border-radius:50%;cursor:pointer;transition:background .2s;
            }
            .ad-dot.active{background:#fff;}

            /* NEW: Ad counter */
            .ad-counter{
                position:absolute;top:12px;left:12px;
                background:rgba(0,0,0,.7);color:#fff;
                padding:4px 10px;border-radius:12px;
                font-size:13px;font-weight:600;z-index:10;
                pointer-events:none;
            }

            @keyframes fadeIn{from{opacity:0}to{opacity:1}}
            @keyframes scaleIn{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}

            /* Mobile */
            @media (max-width:768px){
                #ad-carousel-popup{max-width:100%;border-radius:12px;}
                #ad-carousel-img{border-radius:12px;}
                .ad-close{width:32px;height:32px;font-size:18px;top:6px;right:6px;}
                .ad-nav{width:36px;height:36px;font-size:20px;}
                .ad-prev{left:8px;}
                .ad-next{right:8px;}
                .ad-counter{top:8px;left:8px;font-size:12px;padding:3px 8px;}
            }
            @media (max-width:360px){
                #ad-carousel-overlay{padding:8px;}
                .ad-close{width:28px;height:28px;font-size:16px;}
                .ad-nav{width:30px;height:30px;font-size:18px;}
                .ad-counter{top:6px;left:6px;font-size:11px;padding:2px 6px;}
            }
            @media (max-height:500px) and (orientation:landscape){
                #ad-carousel-img{max-height:85vh;object-fit:contain;}
            }
        `;
        document.head.appendChild(s);
    }

    /* -------------------- HTML -------------------- */
    createHTML() {
        const dots = this.ads.map((_,i)=>`<div class="ad-dot${i===0?' active':''}" data-idx="${i}"></div>`).join('');
        const html = `
            <div id="ad-carousel-overlay">
                <div id="ad-carousel-popup">
                    <button class="ad-close" aria-label="Close">×</button>
                    <button class="ad-nav ad-prev" aria-label="Previous">‹</button>
                    <button class="ad-nav ad-next" aria-label="Next">›</button>
                    <img id="ad-carousel-img" src="${this.ads[0]}" alt="Ad">
                    <div class="ad-dots">${dots}</div>
                    <div class="ad-counter" id="ad-counter">${this.current + 1}/${this.ads.length}</div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    /* -------------------- EVENTS -------------------- */
    bindEvents() {
        const overlay = document.getElementById('ad-carousel-overlay');
        const img      = document.getElementById('ad-carousel-img');
        const closeBtn = overlay.querySelector('.ad-close');
        const prevBtn  = overlay.querySelector('.ad-prev');
        const nextBtn  = overlay.querySelector('.ad-next');
        const dots     = overlay.querySelectorAll('.ad-dot');
        const counter  = document.getElementById('ad-counter');

        const close = () => {
            overlay.style.display = 'none';
            document.removeEventListener('keydown', keyHandler);
        };

        const go = (dir) => {
            this.current = (this.current + dir + this.ads.length) % this.ads.length;
            img.src = this.ads[this.current];
            dots.forEach((d,i)=>d.classList.toggle('active', i===this.current));
            counter.textContent = `${this.current + 1}/${this.ads.length}`;
        };

        const keyHandler = (e) => {
            if (e.key==='Escape') close();
            if (e.key==='ArrowLeft') go(-1);
            if (e.key==='ArrowRight') go(1);
        };

        closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', e=>{ if(e.target===overlay) close(); });
        prevBtn.addEventListener('click', ()=>go(-1));
        nextBtn.addEventListener('click', ()=>go(1));
        dots.forEach(d=>d.addEventListener('click',()=>{ go(d.dataset.idx - this.current); }));

        document.addEventListener('keydown', keyHandler);

        // Touch swipe
        let touchStartX = 0;
        overlay.addEventListener('touchstart', e=>touchStartX=e.touches[0].clientX, {passive:true});
        overlay.addEventListener('touchend', e=>{
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff)>50) go(diff>0?1:-1);
        }, {passive:true});
    }

    /* -------------------- PRELOAD -------------------- */
    preload() {
        this.ads.forEach(src=>{
            const i = new Image();
            i.src = src;
        });
    }

    show() {
        const o = document.getElementById('ad-carousel-overlay');
        if (o) o.style.display = 'flex';
    }
}

/* ----- AUTO START ----- */
if (document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>new ImageAdCarousel());
}else{
    new ImageAdCarousel();
}