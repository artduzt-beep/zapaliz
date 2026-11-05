const trk = document.querySelector('.track');
const barI = document.querySelector('.bar i');
const cards = [...$$('.card')];

function flow() {
  if (!trk) return;

  if (innerWidth >= 900) {
    cards.forEach(c => {
      c.style.opacity = '';

      if (c.style.transform.indexOf('scale(') === 0) {
        c.style.transform = '';
      }
    });

    return;
  }

  const m = trk.scrollWidth - trk.clientWidth;

  if (barI) {
    barI.style.transform = 'scaleX(' + (m ? trk.scrollLeft / m : 0) + ')';
  }

  cards.forEach(c => {
    const r = c.getBoundingClientRect();

    const d = Math.min(
      1,
      Math.abs(r.left + r.width / 2 - innerWidth / 2) / innerWidth
    );

    c.style.transform = 'scale(' + (1 - d * .1) + ')';
    c.style.opacity = 1 - d * .55;
  });
}

if (trk) {
  trk.addEventListener('scroll', flow, { passive: true });
}

resize();

addEventListener('load', () => {
  dirty = true;
  flow();
});

ScrollTrigger.addEventListener('refresh', () => {
  dirty = true;
});

if (!reduce) {

  // Entrada del hero: ahora espera al scroll (después del intro del logo)
  gsap.from('.hero .w span', {
    yPercent: 115,
    duration: 1.3,
    ease: 'power4.out',
    stagger: .09,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top 70%',
      once: true
    }
  });

  gsap.from('.hero .eyebrow, .hero .sub, .hero .cta', {
    opacity: 0,
    y: 30,
    duration: 1.1,
    delay: .3,
    stagger: .12,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top 70%',
      once: true
    }
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '+=70%',
      pin: true,
      scrub: true
    }
  }).to('.hero-c', {
    scale: .88,
    opacity: 0,
    y: -40,
    ease: 'none'
  });

  gsap.to('.mw', {
    opacity: 1,
    stagger: .12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.mani',
      start: 'top top',
      end: '+=130%',
      pin: true,
      scrub: true
    }
  });

  $$('.sec h2[data-split], .studio h2').forEach(h => {
    gsap.from(h.querySelectorAll('.w span'), {
      yPercent: 115,
      duration: 1.1,
      ease: 'power4.out',
      stagger: .06,
      scrollTrigger: {
        trigger: h,
        start: 'top 85%'
      }
    });
  });

  gsap.matchMedia().add('(min-width: 900px)', () => {
    const dist = () => trk.scrollWidth - innerWidth + innerWidth * .05;

    gsap.to(trk, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.hs',
        pin: true,
        scrub: 1,
        end: () => '+=' + dist(),
        invalidateOnRefresh: true
      }
    });

    gsap.to(barI, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hs',
        scrub: true,
        end: () => '+=' + dist()
      }
    });
  });

  $$('.step').forEach(s => {
    gsap.to(s, {
      '--p': 1,
      ease: 'none',
      scrollTrigger: {
        trigger: s,
        start: 'top 75%',
        end: 'bottom 55%',
        scrub: true
      }
    });
  });

  $$('[data-gen]').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 28,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        once: true
      }
    });
  });

  cards.forEach(c => {
    c.addEventListener('mousemove', e => {
      if (innerWidth < 900) return;

      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;

      c.style.setProperty('--mx', x * 100 + '%');
      c.style.setProperty('--my', y * 100 + '%');

      gsap.to(c, {
        rotationY: (x - .5) * 12,
        rotationX: -(y - .5) * 12,
        transformPerspective: 900,
        duration: .4
      });
    });

    c.addEventListener('mouseleave', () => {
      gsap.to(c, {
        rotationX: 0,
        rotationY: 0,
        duration: .6
      });
    });
  });

  const liveEl = $('live');

  if (liveEl) {
    const phrases = [
      'diseñadores web',
      'programadores',
      'creadores de marca',
      'especialistas en 3D',
      'tu equipo digital'
    ];

    let pi = 0;
    let liveOn = false;

    ScrollTrigger.create({
      trigger: '#trayectoria',
      start: 'top bottom',
      end: 'bottom top',
      onToggle: st => {
        liveOn = st.isActive;
      }
    });

    setInterval(() => {
      if (!liveOn) return;

      pi = (pi + 1) % phrases.length;

      gsap.to(liveEl, {
        opacity: 0,
        y: -10,
        duration: .3,
        onComplete: () => {
          liveEl.textContent = phrases[pi];

          gsap.fromTo(
            liveEl,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: .45, ease: 'power2.out' }
          );
        }
      });
    }, 2800);
  }
}