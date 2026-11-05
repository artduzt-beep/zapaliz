gsap.registerPlugin(ScrollTrigger);

const $ = id => document.getElementById(id);
const $$ = s => document.querySelectorAll(s);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

let mob = innerWidth < 800;
let dirty = true;

let lenis = null;

if (window.Lenis && !reduce) {
  lenis = new Lenis({
    lerp: .09
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const el = id.length > 1 && document.querySelector(id);

      if (id === '#') {
        e.preventDefault();
        lenis.scrollTo(0, {
          duration: 1.6
        });
      } else if (el) {
        e.preventDefault();

        lenis.scrollTo(el, {
          offset: -70,
          duration: 1.8
        });
      }
    });
  });
}

addEventListener('scroll', () => {
  dirty = true;
}, {
  passive: true
});

const mk = [
  'Webs que venden',
  'Marcas con alma',
  'Motion',
  'Tiendas en línea',
  'SEO',
  'UI/UX',
  'Producto 3D',
  'Contenido que conecta'
]
  .map(w => '<span>' + w + '</span><b>✦</b>')
  .join('');

if ($('mq')) {
  $('mq').innerHTML = mk + mk;
}

$$('[data-split]').forEach(el => {
  el.innerHTML = el.textContent
    .trim()
    .split(' ')
    .map(w => '<span class="w"><span>' + w + '</span></span>')
    .join(' ');
});

if ($('mani')) {
  $('mani').innerHTML = $('mani')
    .textContent
    .trim()
    .split(' ')
    .map(w => '<span class="mw">' + w + '</span>')
    .join(' ');
}

$('th').onclick = () => {
  const l = getComputedStyle(root).colorScheme.indexOf('light') > -1;

  root.setAttribute(
    'data-theme',
    l ? 'dark' : 'light'
  );

  if (typeof applyTheme === 'function') {
    applyTheme();
  }
};

const navEl = $('nav');
const mb = $('mb');
const prog = $('prog');

const spyIds = [
  'servicios',
  'estudio',
  'trayectoria',
  'proceso',
  'faq',
  'contacto'
];

const spyEls = spyIds.map(id => $(id));

const spyLinks = spyIds.map(id =>
  document.querySelector('.links a[href="#' + id + '"]')
);

let spyCur = -2;

function spy() {
  const mid = innerHeight * .45;
  let k = -1;

  spyEls.forEach((el, i) => {
    if (!el) return;

    const r = el.getBoundingClientRect();

    if (r.top <= mid && r.bottom >= mid) {
      k = i;
    }
  });

  if (k === spyCur) return;

  spyCur = k;

  spyLinks.forEach((a, i) => {
    if (a) {
      a.classList.toggle('on', i === k);
    }
  });
}

function navProg() {
  prog.style.transform =
    'scaleX(' +
    Math.min(
      1,
      scrollY / Math.max(1, root.scrollHeight - innerHeight)
    ) +
    ')';
}

const menu = o => {
  navEl.classList.toggle('open', o);
  mb.setAttribute('aria-expanded', o);
  mb.setAttribute(
    'aria-label',
    o ? 'Cerrar menú' : 'Abrir menú'
  );
};

mb.onclick = () => {
  menu(!navEl.classList.contains('open'));
};

$$('.links a').forEach(a => {
  a.addEventListener('click', () => menu(false));
});

addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    menu(false);
  }
});

(function() {
  const pre = $('pre');

  if (!pre) return;

  if (reduce) {
    pre.remove();
    return;
  }

  const pc = {
    v: 0
  };

  gsap.to(pc, {
    v: 100,
    duration: 1.5,
    ease: 'power2.inOut',

    onUpdate: () => {
      $('pn').textContent = Math.round(pc.v);

      $('pb').style.transform =
        'scaleX(' + pc.v / 100 + ')';
    },

    onComplete: () => {
      setTimeout(() => {
        gsap.to(pre, {
          yPercent: -100,
          duration: 1,
          ease: 'power4.inOut',

          onComplete: () => {
            pre.remove();
          }
        });
      }, 150);
    }
  });
})();

if (
  !reduce &&
  matchMedia('(pointer:fine)').matches
) {
  const cu = $('cur');

  const qx = gsap.quickTo(cu, 'x', {
    duration: .35,
    ease: 'power3'
  });

  const qy = gsap.quickTo(cu, 'y', {
    duration: .35,
    ease: 'power3'
  });

  addEventListener('mousemove', e => {
    qx(e.clientX);
    qy(e.clientY);
  });

  $$('a,button,.card,.stage').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cu, {
        scale: 2.2,
        duration: .3
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(cu, {
        scale: 1,
        duration: .3
      });
    });
  });

  $$('.cta .btn,.cot,#f .btn').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();

      gsap.to(b, {
        x: (e.clientX - r.left - r.width / 2) * .25,
        y: (e.clientY - r.top - r.height / 2) * .35,
        duration: .3
      });
    });

    b.addEventListener('mouseleave', () => {
      gsap.to(b, {
        x: 0,
        y: 0,
        duration: .6,
        ease: 'elastic.out(1,.4)'
      });
    });
  });
}

$$('[data-n]').forEach(el => {
  const n = +el.dataset.n;
  const s = el.dataset.s || '';

  const o = {
    v: 0
  };

  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    once: true,

    onEnter: () => {
      gsap.to(o, {
        v: n,
        duration: reduce ? 0 : 1.8,
        ease: 'power2.out',

        onUpdate: () => {
          el.textContent =
            Math.round(o.v) + s;
        }
      });
    }
  });
});

if ($('f')) {
  $('f').addEventListener('submit', function(e) {
    e.preventDefault();

    const d = new FormData(this);

    location.href =
      'mailto:hola@zapali.com?subject=' +
      encodeURIComponent(
        'Cotización: ' + d.get('s')
      ) +
      '&body=' +
      encodeURIComponent(
        'Nombre: ' + d.get('n') +
        '\nCorreo: ' + d.get('e') +
        '\nServicio: ' + d.get('s') +
        '\n\n' + d.get('m')
      );

    $('ok').textContent =
      'Gracias, abriremos tu correo para enviar el mensaje.';
  });
}