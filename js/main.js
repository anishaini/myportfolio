  // ------------------------
  // small helpers & init
  // ------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // year
    document.getElementById('fyear').textContent = new Date().getFullYear();

    // back to top
    const back = document.getElementById('backTop');
    window.addEventListener('scroll', () => {
      back.style.display = window.scrollY > 360 ? 'flex' : 'none';
    });
    back.addEventListener('click', () => window.scrollTo({ top: 0, behavior:'smooth' }));

    // tiny typed hero (improved: cursor)
    const typedEl = document.getElementById('typedArea');
    const phrases = ['UI animations', 'Performance-first front-end', 'Design systems', 'Accessible components'];
    let pi = 0, sub = 0, forward = true;
    const tdelay = 60, tpause = 1200;
    const cursor = document.createElement('span'); cursor.textContent = ' \u2502'; cursor.style.opacity = '0.9'; cursor.style.marginLeft='6px'; cursor.style.color='var(--accent-3)';
    typedEl.appendChild(cursor);
    (function loop(){
      const w = phrases[pi];
      if(forward) sub++; else sub--;
      typedEl.firstChild ? typedEl.firstChild.textContent = w.substring(0, sub) : typedEl.textContent = w.substring(0, sub);
      if(forward && sub === w.length){ forward=false; setTimeout(loop, tpause); }
      else if(!forward && sub === 0){ forward=true; pi = (pi+1)%phrases.length; setTimeout(loop, tdelay); }
      else setTimeout(loop, tdelay);
    })();

    // blinking cursor
    setInterval(()=>{
      cursor.style.opacity = cursor.style.opacity === '0' ? '0.95' : '0';
    }, 600);

    // NAV activation (desktop)
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    const sections = Array.from(document.querySelectorAll('section[id], header.hero'));
    function highlight(){
      let found = null;
      sections.forEach(sec => {
        const r = sec.getBoundingClientRect();
        if(r.top <= 120 && r.bottom > 120) found = sec.id || 'home';
      });
      navLinks.forEach(a => a.classList.remove('active'));
      if(found){
        const link = document.querySelector('.nav-links a[href="#'+found+'"]');
        if(link) link.classList.add('active');
      }
    }
    window.addEventListener('scroll', highlight);
    highlight();

    // project filters
    document.querySelectorAll('.filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('.project-card').forEach(card=>{
          const cat = card.dataset.category || 'all';
          card.style.display = (f === 'all' || f === cat) ? '' : 'none';
        });
      });
    });

    // contact form basic validation + small confetti (CSS + DOM, no lib)
    const form = document.getElementById('contactForm');
    const fmsg = document.getElementById('formMsg');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const msg = document.getElementById('message').value.trim();
      if(!name || !email || !msg){ fmsg.textContent = 'Please complete all fields.'; fmsg.style.color = '#ffb4b4'; return; }
      fmsg.textContent = 'Sending...'; fmsg.style.color = 'var(--muted)';
      setTimeout(()=>{
        fmsg.textContent = 'Thanks — demo message sent.'; fmsg.style.color = 'var(--accent-3)'; form.reset();
        // tiny celebration: falling dots
        const root = document.createElement('div'); root.style.position='fixed'; root.style.left=0; root.style.top=0; root.style.width='100%'; root.style.height='100%'; root.style.pointerEvents='none'; root.style.zIndex=2000;
        for(let i=0;i<14;i++){ const d=document.createElement('div'); d.style.position='absolute'; d.style.width='8px'; d.style.height='8px'; d.style.borderRadius='50%'; d.style.left=Math.random()*100+'%'; d.style.top='-5%'; d.style.opacity='0.95'; d.style.transform='translateY(0)'; d.style.background=['#7c9dff','#00d4ff','#9be7ff','#8cffc7'][Math.floor(Math.random()*4)]; d.style.transition='transform 1200ms cubic-bezier(.2,.8,.2,1), opacity 400ms'; root.appendChild(d); setTimeout(()=>{ d.style.transform='translateY(120vh)'; d.style.opacity='0'; }, 30+i*40); }
        document.body.appendChild(root); setTimeout(()=>root.remove(), 1600);
      }, 900);
    });

    // case modal dynamic
    document.querySelectorAll('.view-case').forEach(btn => btn.addEventListener('click', evt => {
      const id = btn.dataset.project;
      openCaseModal(id);
    }));

    function openCaseModal(id){
      let modal = document.getElementById('caseModalDynamic');
      if(modal) modal.remove();
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `<!-- minimal demo modal --> 
        <div class="modal fade" id="caseModalDynamic" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content" style="background:transparent; border:none;">
              <div class="modal-body p-0">
                <div class="section-card"> <h4>Project case — ${id}</h4><p style="color:var(--muted)">This is a demo case modal. Replace with real content.</p></div>
              </div>
            </div>
          </div>
        </div>`;
      document.body.appendChild(wrapper);
      const el = document.getElementById('caseModalDynamic');
      if(el && window.bootstrap){ try{ new bootstrap.Modal(el).show(); }catch(e){} }
    }

    // GSAP animations & ScrollTrigger (enhanced)
    function initAnimations(){
      if(!window.gsap) return;
      gsap.registerPlugin(ScrollTrigger);

      // Hero timeline
      const tl = gsap.timeline();
      tl.from('.hero-left .eyebrow', {y:8, opacity:0, duration:.45, ease:'power2.out'})
        .from('.hero-title', {y:18, opacity:0, duration:.6, ease:'power3.out'}, '-=.2')
        .from('.hero-sub', {y:8, opacity:0, duration:.45}, '-=.2')
        .from('.hero-ctas a', {y:8, opacity:0, stagger:.08, duration:.4}, '-=.15')
        .from('.hero-media', {scale:.98, opacity:0, duration:.9, ease:'elastic.out(1,0.6)'}, '-=.4');

      // project reveal with slight scale+fade
      gsap.utils.toArray('.project-card').forEach((el, i) => {
        gsap.from(el, {
          y: 24, opacity:0, scale: 0.99, duration: .7, delay: i * 0.06,
          scrollTrigger: { trigger: el, start: 'top 92%' }
        });

        el.addEventListener('mousemove', (ev)=> {
          const r = el.getBoundingClientRect();
          const x = (ev.clientX - r.left) / r.width - 0.5;
          const y = (ev.clientY - r.top) / r.height - 0.5;
          el.style.transform = `translateY(-8px) rotateX(${ -y * 6 }deg) rotateY(${ x * 6 }deg)`;
        });
        el.addEventListener('mouseleave', ()=> el.style.transform = '');
      });

      // skill bars animate on view
      gsap.utils.toArray('.skill-bar i').forEach(i => {
        const w = i.getAttribute('data-width') || '80%';
        gsap.to(i, { width: w, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: i, start: 'top 92%' } });
      });

      // nav links micro animation
      gsap.from('.nav-links a', { y: -6, opacity:0, duration:.6, stagger:.06, ease:'power2.out' });

      // testimonials
      gsap.from('.testimonial', { y: 20, opacity:0, duration:.7, stagger:.12, scrollTrigger:{ trigger:'.testimonial', start:'top 90%' } });
    }

    setTimeout(initAnimations, 300);

    // resume button demo (download sample CV)
    const resumeOpen = () => window.open('https://example.com/your-resume.pdf', '_blank');
    const rDesk = document.getElementById('resumeBtn');
    const rMobile = document.getElementById('resumeBtnMobile');
    if(rDesk) rDesk.addEventListener('click', resumeOpen);
    if(rMobile) rMobile.addEventListener('click', resumeOpen);

    // keyboard nav
    document.addEventListener('keydown', (e) => {
      if(e.altKey && e.key === '1') document.querySelector('a[href="#projects"]').click();
      if(e.altKey && e.key === '2') document.querySelector('a[href="#contact"]').click();
    });

    // nav reveal on scroll
    let lastScroll = 0;
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
      const s = window.scrollY;
      nav.style.transform = s > lastScroll && s > 100 ? 'translateY(-14px) scale(.995)' : 'translateY(0)';
      lastScroll = s;
    });

    // smooth internal scroll (also close mobile drawer when link clicked)
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (ev) => {
        const href = a.getAttribute('href');
        if(href.length > 1 && document.querySelector(href)){
          ev.preventDefault();
          document.querySelector(href).scrollIntoView({behavior:'smooth', block:'start'});

          // if mobile drawer open, hide it
          const navDrawerEl = document.getElementById('navDrawer');
          if(navDrawerEl && navDrawerEl.classList.contains('show')){
            hideDrawer();
          }
        }
      });
    });

    // --------------------
    // Drawer: show/hide + animations (UPDATED)
    // --------------------
    const toggler = document.getElementById('navToggler');
    const drawer = document.getElementById('navDrawer');
    const closeBtn = document.getElementById('closeDrawer');
    const drawerInner = drawer ? drawer.querySelector('.drawer-inner') : null;
    let lastFocusedBeforeOpen = null;

    function animateLinksIn(){
      const links = drawer.querySelectorAll('.nav-link');
      if(window.gsap){
        gsap.fromTo(links, {y:18, opacity:0}, {y:0, opacity:1, stagger:0.06, duration:0.34, ease:'power2.out'});
      } else {
        links.forEach((ln, i) => {
          ln.style.transition = 'transform .28s cubic-bezier(.2,.9,.2,1), opacity .28s';
          ln.style.transitionDelay = (i * 0.05) + 's';
          ln.style.opacity = '0';
          ln.style.transform = 'translateY(8px)';
          setTimeout(() => {
            ln.style.opacity = '1';
            ln.style.transform = 'translateY(0)';
          }, 20 + i * 40);
        });
      }
    }

    function animateLinksOut(done){
      const links = Array.from(drawer.querySelectorAll('.nav-link')).reverse();
      if(window.gsap){
        gsap.to(links, {y:8, opacity:0, stagger:0.03, duration:0.18, ease:'power1.in', onComplete: done});
      } else {
        links.forEach((ln, i) => {
          ln.style.transition = 'transform .18s ease, opacity .18s';
          ln.style.transitionDelay = '0s';
          ln.style.opacity = '0';
          ln.style.transform = 'translateY(8px)';
        });
        setTimeout(done, 160);
      }
    }

    function showDrawer(){
      if(!drawer) return;
      lastFocusedBeforeOpen = document.activeElement;
      drawer.classList.add('show');
      drawer.setAttribute('aria-hidden','false');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      if(toggler) toggler.innerHTML = '<i class="fa fa-times" aria-hidden="true" style="color:#fff"></i>';
      if(toggler) toggler.setAttribute('aria-expanded','true');

      setTimeout(()=> {
        animateLinksIn();
        const first = drawer.querySelector('.nav-link');
        if(first) first.focus();
      }, 60);
    }

    function hideDrawer(){
      if(!drawer) return;
      animateLinksOut(() => {
        drawer.classList.remove('show');
        drawer.setAttribute('aria-hidden','true');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        if(toggler) toggler.innerHTML = '<i class="fa fa-bars" aria-hidden="true" style="color:#fff"></i>';
        if(toggler) toggler.setAttribute('aria-expanded','false');

        if(lastFocusedBeforeOpen && typeof lastFocusedBeforeOpen.focus === 'function'){
          lastFocusedBeforeOpen.focus();
        } else if(toggler){
          toggler.focus();
        }
      });
    }

    if(toggler){
      // ensure icon is visible
      const ic = toggler.querySelector('i');
      if(ic) ic.style.color = '#fff';

      toggler.addEventListener('click', (e) => {
        e.stopPropagation();
        if(drawer.classList.contains('show')) hideDrawer(); else showDrawer();
      });
    }

    if(closeBtn){
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        hideDrawer();
      });
    }

    document.addEventListener('click', (ev) => {
      if(drawer && drawer.classList.contains('show')){
        if(drawerInner && !drawerInner.contains(ev.target) && (!toggler || !toggler.contains(ev.target))){
          hideDrawer();
        }
      }
    });

    document.addEventListener('keydown', (e)=> {
      if(e.key === 'Escape' && drawer && drawer.classList.contains('show')){ hideDrawer(); }
    });

    if (drawer) {
      drawer.querySelectorAll('.nav-link').forEach(l => {
        l.addEventListener('click', () => {
          setTimeout(() => hideDrawer(), 160);
        });
      });
    }

    // small accessibility helpers: focus visible for keyboard users
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Tab') document.body.classList.add('user-is-tabbing');
    });

  }); // DOMContentLoaded end

