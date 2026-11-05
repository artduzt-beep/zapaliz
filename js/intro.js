(function () {
  const intro = $('intro');

  if (!intro) return;

  const hola = intro.querySelector('.hola');

  hola.innerHTML = 'Hola'
    .split('')
    .map(c => '<span class="lt-h"><span>' + c + '</span></span>')
    .join('');

  if (reduce) return;

  const holaBox = hola.querySelectorAll('.lt-h');
  const letters = hola.querySelectorAll('.lt-h span');
  const draws = intro.querySelectorAll('.dr');
  const dots = intro.querySelectorAll('.dot');
  const word = intro.querySelectorAll('.lt');
  const scroll = intro.querySelector('.scroll');
  const scrollKids = scroll.children;
  const inner = intro.querySelector('.intro-in');

  gsap.set(letters, {
    yPercent: 115
  });

  gsap.set(scroll, {
    opacity: 1
  });

  gsap.set(scrollKids, {
    opacity: 0
  });

  gsap.set(word, {
    opacity: 0,
    y: 40
  });

  gsap.set(draws, {
    strokeDashoffset: 1
  });

  // Cada círculo escala desde su propio centro (coordenadas del SVG)
  dots.forEach(d => {
    gsap.set(d, {
      scale: 0,
      svgOrigin: d.getAttribute('cx') + ' ' + d.getAttribute('cy')
    });
  });

  // 1. Entrada: "Hola" + indicador (después del preloader)
  gsap.to(letters, {
    yPercent: 0,
    duration: 1.2,
    ease: 'power4.out',
    stagger: .08,
    delay: 2.5
  });

  gsap.to(scrollKids, {
    opacity: 1,
    duration: 1,
    delay: 3.2
  });

  // 2. Con el scroll: sale "Hola", se dibuja el logo
  const tl = gsap.timeline({
    defaults: {
      ease: 'none'
    },

    scrollTrigger: {
      trigger: intro,
      start: 'top top',
      end: '+=260%',
      pin: true,
      scrub: 1
    }
  });

  tl.to(scroll, {
    opacity: 0,
    duration: .3
  }, 0)
    .to(holaBox, {
      opacity: 0,
      y: -60,
      stagger: .05,
      duration: .6,
      ease: 'power3.in'
    }, 0)
    .to(draws, {
      strokeDashoffset: 0,
      duration: 1,
      stagger: .35,
      ease: 'power2.inOut'
    }, .7)
    .to(dots, {
      scale: 1,
      duration: .5,
      stagger: .3,
      ease: 'back.out(2.2)'
    }, 1.5)
    .to(word, {
      opacity: 1,
      y: 0,
      duration: .5,
      stagger: .1,
      ease: 'power3.out'
    }, 2.1)
    .to({}, {
      duration: .8
    })
    .to(inner, {
      opacity: 0,
      y: -60,
      duration: .6
    });
})();