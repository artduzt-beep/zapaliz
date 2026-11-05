const A1 = new THREE.Color('#0088FF');
const A2 = new THREE.Color('#00E5FF');

const R = new THREE.WebGLRenderer({
  canvas: $('gl'),
  alpha: true,
  antialias: true,
  powerPreference: 'high-performance'
});

R.setPixelRatio(Math.min(devicePixelRatio, mob ? 1.5 : 2));

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(50, 1, .1, 100);

cam.position.z = 7;

scene.add(new THREE.HemisphereLight(0xffffff, 0x4a6a8a, 1));

const dl = new THREE.DirectionalLight(0xffffff, 1.2);

dl.position.set(3, 5, 6);
scene.add(dl);

const rim = new THREE.PointLight(A2, 1.6, 20);

rim.position.set(-4, 2, -2);
scene.add(rim);

const wire = (c, o) => new THREE.MeshBasicMaterial({
  color: c,
  wireframe: true,
  transparent: true,
  opacity: o
});

const K = ['hero', 'rings', 'studio', 'globe'];
const G = {};
const F = {};

const SC = {
  hero: 1,
  rings: 1.5,
  studio: 1,
  globe: 1.9
};

K.forEach(k => {
  G[k] = new THREE.Group();
  G[k].visible = false;
  F[k] = { v: 0 };
  scene.add(G[k]);
});

const gc = document.createElement('canvas');

gc.width = gc.height = 128;

const gx = gc.getContext('2d');
const gr = gx.createRadialGradient(64, 64, 0, 64, 64, 64);

gr.addColorStop(0, 'rgba(255,255,255,1)');
gr.addColorStop(1, 'rgba(255,255,255,0)');
gx.fillStyle = gr;
gx.fillRect(0, 0, 128, 128);

const GT = new THREE.CanvasTexture(gc);
const glows = [];

const glow = (g, c, s, o) => {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({
    map: GT,
    color: c,
    transparent: true,
    opacity: o,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }));

  sp.scale.set(s, s, 1);
  g.add(sp);
  glows.push(sp);
};

const seg = mob ? [160, 16] : [320, 30];

const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1.4, .4, seg[0], seg[1]),
  wire(A1, .45)
);

const solid = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1.4, .27, seg[0], seg[1]),
  new THREE.MeshStandardMaterial({
    color: 0x0b3a66,
    metalness: .9,
    roughness: .18,
    emissive: 0x002a55
  })
);

const ico = new THREE.Mesh(
  new THREE.IcosahedronGeometry(.8, 2),
  wire(A2, .45)
);

G.hero.add(knot, solid, ico);

glow(G.hero, A2, 9, .35);
glow(G.hero, A1, 14, .22);

const ND = mob ? 110 : 280;
const dm = new THREE.Object3D();
const dd = [];

const deb = new THREE.InstancedMesh(
  new THREE.OctahedronGeometry(.07, 0),
  new THREE.MeshStandardMaterial({
    color: 0x9fe8ff,
    metalness: .8,
    roughness: .25,
    emissive: 0x00384f
  }),
  ND
);

for (let i = 0; i < ND; i++) {
  dd.push({
    r: 2.5 + Math.random() * 2.6,
    a: Math.random() * 6.28,
    y: (Math.random() - .5) * 3.2,
    s: .6 + Math.random() * 1.8,
    v: (.1 + Math.random() * .4) * (Math.random() < .5 ? -1 : 1),
    q: Math.random() * 6
  });
}

G.hero.add(deb);

const rings = [0, 1, 2].map(r => {
  const m = new THREE.Mesh(
    new THREE.TorusGeometry(1 + r * .6, .014, 8, 120),
    wire(r % 2 ? A2 : A1, .55)
  );

  m.rotation.set(r * .8, r * .4, 0);
  G.rings.add(m);

  return m;
});

const core = new THREE.Mesh(
  new THREE.OctahedronGeometry(.45, 0),
  wire(A2, .8)
);

G.rings.add(core);
glow(G.rings, A1, 7, .3);

const globe = new THREE.Points(
  new THREE.IcosahedronGeometry(1.5, 4),
  new THREE.PointsMaterial({
    color: A2,
    size: .035,
    transparent: true,
    opacity: .8
  })
);

G.globe.add(
  globe,
  new THREE.Mesh(new THREE.IcosahedronGeometry(1.49, 2), wire(A1, .12))
);

const gp = [];

for (let i = 0; i < 16; i++) {
  const u = Math.random() * 6.28;
  const v = Math.acos(2 * Math.random() - 1);

  gp.push(
    new THREE.Vector3(
      Math.sin(v) * Math.cos(u),
      Math.cos(v),
      Math.sin(v) * Math.sin(u)
    ).multiplyScalar(1.5)
  );
}

gp.forEach((p, i) => {
  const n = new THREE.Mesh(
    new THREE.SphereGeometry(.05, 10, 10),
    new THREE.MeshBasicMaterial({ color: A2 })
  );

  n.position.copy(p);
  G.globe.add(n);

  const q = gp[(i + 3) % 16];

  const m = p
    .clone()
    .add(q)
    .multiplyScalar(.5)
    .normalize()
    .multiplyScalar(2.5);

  G.globe.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(
        new THREE.QuadraticBezierCurve3(p, m, q).getPoints(40)
      ),
      new THREE.LineBasicMaterial({
        color: A1,
        transparent: true,
        opacity: .55
      })
    )
  );
});

glow(G.globe, A2, 6, .25);

const FL = new THREE.Group();

scene.add(FL);

const metalM = new THREE.MeshStandardMaterial({
  color: 0x0b3a66,
  metalness: .92,
  roughness: .18,
  emissive: 0x002a55
});

const flDefs = [
  { g: new THREE.IcosahedronGeometry(.6, 0), w: wire(A2, .55), fx: -.86, z: -2, s: .55, p: .10 },
  { g: new THREE.TorusGeometry(.5, .17, 16, 48), w: metalM, fx: .86, z: -1, s: .85, p: .45 },
  { g: new THREE.OctahedronGeometry(.55, 0), w: metalM, fx: -.72, z: 0, s: 1.15, p: .80 },
  { g: new THREE.BoxGeometry(.75, .75, .75), w: wire(A1, .55), fx: .70, z: -3, s: .60, p: .25 },
  { g: new THREE.DodecahedronGeometry(.5, 0), w: metalM, fx: .92, z: 1, s: 1.30, p: .65 },
  { g: new THREE.TorusKnotGeometry(.38, .1, 64, 8), w: wire(A2, .5), fx: -.94, z: -4, s: .40, p: .90 }
].map(d => {
  const m = new THREE.Mesh(d.g, d.w);

  m.position.z = d.z;
  FL.add(m);

  return Object.assign(d, { m });
});

const NF = mob ? 2600 : 6500;
const fp = new Float32Array(NF * 3);
const fh = new Float32Array(NF);

for (let i = 0; i < NF; i++) {
  fp[i * 3] = (Math.random() - .5) * 34;
  fp[i * 3 + 1] = (Math.random() - .5) * 22;
  fp[i * 3 + 2] = Math.random() * 50 - 45;
  fh[i] = Math.random();
}

const fg = new THREE.BufferGeometry();

fg.setAttribute('position', new THREE.BufferAttribute(fp, 3));
fg.setAttribute('h', new THREE.BufferAttribute(fh, 1));

const fU = {
  uT: { value: 0 },
  uZ: { value: 0 },
  c1: { value: A1 },
  c2: { value: A2 },
  uPx: { value: R.getPixelRatio() }
};

const fm = new THREE.ShaderMaterial({
  uniforms: fU,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,

  vertexShader: `
    attribute float h;
    uniform float uT, uZ, uPx;
    varying float vh, vA;

    void main() {
      vec3 p = position;

      p.z = mod(p.z + uZ, 50.) - 45.;

      p.x += sin(uT * .3 + h * 20.) * .3;
      p.y += cos(uT * .25 + h * 30.) * .3;

      vec4 mv = modelViewMatrix * vec4(p, 1.);

      gl_Position = projectionMatrix * mv;

      gl_PointSize =
        (1.2 + h * 2.6) *
        uPx *
        (18. / -mv.z);

      vh = h;

      vA =
        smoothstep(-45., -35., p.z) *
        (1. - smoothstep(-8., 2., p.z)) *
        (.5 + .5 * sin(uT * 2. + h * 40.));
    }
  `,

  fragmentShader: `
    uniform vec3 c1, c2;
    varying float vh, vA;

    void main() {
      float d = length(gl_PointCoord - .5);

      if (d > .5) discard;

      gl_FragColor = vec4(
        mix(c1, c2, vh),
        smoothstep(.5, 0., d) * vA
      );
    }
  `
});

scene.add(new THREE.Points(fg, fm));

function applyTheme() {
  const l = getComputedStyle(root).colorScheme.indexOf('light') > -1;

  fm.blending = l ? THREE.NormalBlending : THREE.AdditiveBlending;
  fm.needsUpdate = true;

  glows.forEach(g => {
    g.visible = !l;
  });
}

applyTheme();

matchMedia('(prefers-color-scheme: light)')
  .addEventListener('change', applyTheme);

const BR = [
  { bg: '#0B1F34', fg: '#ffffff', ac: '#00E5FF' },
  { bg: '#0088FF', fg: '#ffffff', ac: '#00E5FF' },
  { bg: '#00E5FF', fg: '#0B1F34', ac: '#0B1F34' },
  { bg: '#ffffff', fg: '#0B1F34', ac: '#0088FF' }
];

function mkTex(w, h, fn) {
  const c = document.createElement('canvas');

  c.width = w;
  c.height = h;

  const t = new THREE.CanvasTexture(c);

  t.anisotropy = 4;

  t.draw = b => {
    fn(c.getContext('2d'), w, h, b);
    t.needsUpdate = true;
  };

  return t;
}

const tx = (c, s, x, y, z, wt, col) => {
  c.fillStyle = col;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.font = wt + ' ' + z + 'px Montserrat,system-ui,sans-serif';
  c.fillText(s, x, y);
};

const lg = (c, x, y, r, b) => {
  c.fillStyle = b.fg;
  c.beginPath();
  c.arc(x, y, r, 0, 7);
  c.fill();

  tx(c, 'Z', x, y + r * .06, r * 1.3, 800, b.bg);
};

const sleeveT = mkTex(1536, 280, (c, w, h, b) => {
  c.fillStyle = b.bg;
  c.fillRect(0, 0, w, h);

  c.fillStyle = b.ac;
  c.fillRect(0, 0, w, h * .05);
  c.fillRect(0, h * .95, w, h * .05);

  lg(c, w * .5 - 190, h * .5, h * .27, b);

  tx(c, 'ZAPALI', w * .5 + 70, h * .42, h * .2, 800, b.fg);
  tx(c, 'CAFÉ DE ESPECIALIDAD', w * .5 + 70, h * .68, h * .08, 600, b.fg);
  tx(c, 'ZAPALI', 0, h * .5, h * .14, 800, b.fg);
  tx(c, 'ZAPALI', w, h * .5, h * .14, 800, b.fg);
});

sleeveT.wrapS = THREE.RepeatWrapping;
sleeveT.offset.x = .5;

const bagT = mkTex(512, 768, (c, w, h, b) => {
  c.fillStyle = b.bg;
  c.fillRect(0, 0, w, h);

  c.fillStyle = b.ac;
  c.fillRect(0, 0, w, h * .07);
  c.fillRect(0, h * .66, w, h * .012);

  lg(c, w / 2, h * .3, h * .1, b);

  tx(c, 'ZAPALI', w / 2, h * .5, h * .075, 800, b.fg);
  tx(c, 'CAFÉ DE ESPECIALIDAD', w / 2, h * .58, h * .032, 600, b.fg);
  tx(c, 'TOSTADO MEDIO · 250 g', w / 2, h * .9, h * .03, 600, b.fg);
});

const glowT = mkTex(256, 256, (c, w, h, b) => {
  const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);

  g.addColorStop(0, b.ac + 'aa');
  g.addColorStop(1, b.ac + '00');

  c.clearRect(0, 0, w, h);
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
});

const std = o => new THREE.MeshStandardMaterial(o);

const paperM = std({ color: 0xf4efe6, roughness: .6, side: THREE.DoubleSide });
const sleeveM = std({ map: sleeveT, roughness: .65 });
const lidM = std({ color: 0x1b1b22, roughness: .35, side: THREE.DoubleSide });
const sideM = std({ color: 0x222222, roughness: .75 });
const frontM = std({ map: bagT, roughness: .7 });
const foldM = std({ color: 0x00e5ff, roughness: .6 });
const darkM = std({ color: 0x15151a, roughness: .5 });

const allM = [paperM, sleeveM, lidM, sideM, frontM, foldM, darkM];

const cup = new THREE.Group();
const V2 = (x, y) => new THREE.Vector2(x, y);

const body = new THREE.Mesh(
  new THREE.CylinderGeometry(.85, .62, 2, 64, 1, true),
  paperM
);

body.position.y = 1;

const base = new THREE.Mesh(new THREE.CircleGeometry(.62, 48), paperM);

base.rotation.x = -Math.PI / 2;
base.position.y = .01;

const sleeve = new THREE.Mesh(
  new THREE.CylinderGeometry(.793, .695, .85, 64, 1, true),
  sleeveM
);

sleeve.position.y = .975;

const lid = new THREE.Mesh(
  new THREE.LatheGeometry([
    V2(.89, 1.98),
    V2(.9, 2.04),
    V2(.88, 2.1),
    V2(.8, 2.12),
    V2(.75, 2.2),
    V2(.62, 2.24),
    V2(.001, 2.24)
  ], 64),
  lidM
);

const slit = new THREE.Mesh(new THREE.BoxGeometry(.24, .02, .07), darkM);

slit.position.set(.38, 2.245, 0);

cup.add(body, base, sleeve, lid, slit);
cup.position.set(-1.05, -1, 0);

const bag = new THREE.Mesh(
  new THREE.BoxGeometry(1.25, 1.9, .55),
  [sideM, sideM, sideM, sideM, frontM, frontM]
);

const fold = new THREE.Mesh(new THREE.BoxGeometry(1.29, .22, .59), foldM);

fold.position.y = .98;

const valve = new THREE.Mesh(
  new THREE.CylinderGeometry(.08, .08, .03, 20),
  darkM
);

valve.rotation.x = Math.PI / 2;
valve.position.set(.38, -.62, .285);

bag.add(fold, valve);
bag.position.set(1.05, -.05, 0);

const gl2 = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 2.6),
  new THREE.MeshBasicMaterial({
    map: glowT,
    transparent: true,
    depthWrite: false
  })
);

gl2.rotation.x = -Math.PI / 2;
gl2.position.y = -.99;

G.studio.add(gl2, cup, bag);

let curB = BR[0];
let bi = 0;
let auto = true;
let isWire = false;

const hx = $('hx');
const cc = $('cc');
const autoBtn = $('auto');

const paint = b => {
  curB = b;

  sleeveT.draw(b);
  bagT.draw(b);
  glowT.draw(b);

  lidM.color.set(b.bg);
  sideM.color.set(b.bg);
  foldM.color.set(b.ac);

  if (document.activeElement !== hx) {
    hx.value = b.bg.toUpperCase();
  }

  cc.value = b.bg.length === 7 ? b.bg.toLowerCase() : '#0b1f34';

  hx.removeAttribute('aria-invalid');
};

const sws = () => [...$$('.sw')];

const pressSw = i => sws().forEach((s, j) => s.setAttribute('aria-pressed', j === i));

const brandPick = i => {
  paint(BR[i]);
  pressSw(i);
};

function custom(hex) {
  const c = new THREE.Color(hex);
  const o = {};
  const ac = new THREE.Color();
  const lum = .299 * c.r + .587 * c.g + .114 * c.b;

  c.getHSL(o);

  ac.setHSL(
    (o.h + .1) % 1,
    Math.max(o.s, .5),
    lum > .5 ? .32 : .62
  );

  auto = false;
  autoBtn.setAttribute('aria-pressed', 'false');

  paint({
    bg: hex,
    fg: lum > .55 ? '#0B1F34' : '#ffffff',
    ac: '#' + ac.getHexString()
  });

  pressSw(-1);
}

const parseHex = v => {
  v = v.trim().replace('#', '');

  if (/^[0-9a-f]{3}$/i.test(v)) {
    v = v.replace(/./g, '$&$&');
  }

  return /^[0-9a-f]{6}$/i.test(v) ? '#' + v.toLowerCase() : null;
};

brandPick(0);

Promise.all([
  document.fonts.load('800 24px Montserrat'),
  document.fonts.load('600 24px Montserrat')
])
  .then(() => paint(curB))
  .catch(() => {});

let nextTurn = 6.283;
let spin = 0;

sws().forEach((s, j) => {
  s.onclick = () => {
    bi = j;
    brandPick(j);
    nextTurn = spin + 6.283;
  };
});

cc.addEventListener('input', () => custom(cc.value));

hx.addEventListener('input', () => {
  hx.removeAttribute('aria-invalid');

  const h = parseHex(hx.value);

  if (h) {
    custom(h);
  }
});

hx.addEventListener('change', () => {
  if (parseHex(hx.value)) {
    hx.value = curB.bg.toUpperCase();
  } else {
    hx.setAttribute('aria-invalid', 'true');
  }
});

autoBtn.onclick = () => {
  auto = !auto;
  autoBtn.setAttribute('aria-pressed', auto);
};

$('wire').onclick = function() {
  isWire = !isWire;

  allM.forEach(m => m.wireframe = isWire);

  this.textContent = isWire ? 'Ver render' : 'Ver malla 3D';
};

const stageEl = $('stage');

let fitK = 1;
let bob = 0;

const place = () => {
  mob = innerWidth < 800;

  G.hero.position.set(mob ? 0 : 2.6, mob ? 1.7 : 0, 0);
  G.rings.position.set(0, 0, -1);
  G.globe.position.set(0, 0, -1);
};

function fitStudio() {
  const r = stageEl.getBoundingClientRect();
  const H = 2 * Math.tan(cam.fov * Math.PI / 360) * cam.position.z;
  const wp = H / innerHeight;

  G.studio.position.x =
    ((r.left + r.width / 2) / innerWidth - .5) * H * cam.aspect;

  G.studio.position.y =
    -((r.top + r.height * .46) / innerHeight - .5) * H + bob;

  fitK = Math.min(
    r.height * .68 * wp / 2.5,
    r.width * .9 * wp / 3.7
  );
}

function resize() {
  R.setSize(innerWidth, innerHeight, false);

  cam.aspect = innerWidth / innerHeight;
  cam.updateProjectionMatrix();

  place();

  if (typeof flow === 'function') {
    flow();
  }
}

addEventListener('resize', resize);

let yaw = 0;
let pitch = 0;
let vel = 0;
let drag = false;
let lx = 0;
let ly = 0;
let mx = 0;
let my = 0;

stageEl.addEventListener('pointerdown', e => {
  if (e.target.closest('.tools')) {
    return;
  }

  drag = true;
  lx = e.clientX;
  ly = e.clientY;

  stageEl.setPointerCapture(e.pointerId);
});

addEventListener('pointerup', () => drag = false);
addEventListener('pointercancel', () => drag = false);

addEventListener('pointermove', e => {
  if (!drag) return;

  vel = (e.clientX - lx) * .012;
  yaw += vel;

  if (e.pointerType === 'mouse') {
    pitch = Math.max(
      -.6,
      Math.min(.6, pitch + (e.clientY - ly) * .008)
    );
  }

  lx = e.clientX;
  ly = e.clientY;
});

addEventListener('mousemove', e => {
  mx = e.clientX / innerWidth - .5;
  my = e.clientY / innerHeight - .5;
});

addEventListener('deviceorientation', e => {
  if (e.gamma == null) {
    return;
  }

  mx = Math.max(-.5, Math.min(.5, e.gamma / 60));
  my = Math.max(-.5, Math.min(.5, (e.beta - 50) / 90));
});

const sceneMap = [
  ['#intro', 'globe'],
  ['.hero', 'hero'],
  ['.mani', 'hero'],
  ['#servicios', 'rings'],
  ['#estudio', 'studio'],
  ['#trayectoria', 'globe'],
  ['.stats', 'globe'],
  ['#proceso', 'globe'],
  ['#faq', 'globe'],
  ['#contacto', 'globe']
];

let curScene = '';

const go = k => {
  curScene = k;

  K.forEach(j => {
    const on = j === k;

    gsap.to(F[j], {
      v: on ? 1 : 0,
      duration: reduce ? 0 : on ? .9 : .4,
      delay: reduce || !on ? 0 : .45,
      ease: on ? 'power3.out' : 'power2.in',
      overwrite: true
    });
  });
};

const pick = () => {
  const mid = innerHeight * .5;
  let k = curScene || 'hero';

  sceneMap.forEach(m => {
    const el = document.querySelector(m[0]);

    if (!el) return;

    const r = el.getBoundingClientRect();

    if (r.top <= mid && r.bottom >= mid) {
      k = m[1];
    }
  });

  if (k !== curScene) {
    go(k);
  }
};

let last = 0;
let fz = 0;
let lastY = 0;
let sv = 0;

const TAU = 6.283;

(function loop(t) {
  const dt = Math.min(t - last, 50);

  last = t;

  if (dirty) {
    dirty = false;

    pick();
    spy();
    navProg();
  }

  const s = reduce ? 0 : 1;
  const maxS = Math.max(1, root.scrollHeight - innerHeight);
  const sp = scrollY / innerHeight;

  sv += ((scrollY - lastY) - sv) * .1;
  lastY = scrollY;

  const kv = Math.max(-40, Math.min(40, sv)) * s;

  fz += ((scrollY / maxS) * 90 - fz) * .06;

  fU.uZ.value = fz;
  fU.uT.value = t * .001;

  if (G.hero.visible) {
    G.hero.rotation.y += .003 * s + kv * .0035;
    G.hero.rotation.x = scrollY * .0004;
    G.hero.rotation.z += (-mx * .4 - G.hero.rotation.z) * .05;

    knot.rotation.x += .0015 * s;
    solid.rotation.x = knot.rotation.x;
    ico.rotation.y -= .006 * s + kv * .004;

    const ex = 1 + Math.min(sp, 1.6) * .7;

    for (let i = 0; i < ND; i++) {
      const d = dd[i];

      d.a += d.v * dt * .0006 * s;

      dm.position.set(
        Math.cos(d.a) * d.r * ex,
        d.y + Math.sin(d.a * 2 + d.q) * .2,
        Math.sin(d.a) * d.r * ex
      );

      dm.rotation.set(
        t * .001 * d.s + d.q,
        t * .0013 * d.s,
        0
      );

      dm.scale.setScalar(d.s);
      dm.updateMatrix();

      deb.setMatrixAt(i, dm.matrix);
    }

    deb.instanceMatrix.needsUpdate = true;
  }

  if (G.rings.visible) {
    rings.forEach((r, i) => {
      r.rotation.x += (.004 + i * .002) * s + kv * .003 * (i + 1);
      r.rotation.y += (.003 + i * .001) * s;
    });

    core.rotation.y += .02 * s + kv * .01;
  }

  if (G.globe.visible) {
    G.globe.rotation.y += .002 * s + kv * .003;
    G.globe.rotation.x = Math.sin(sp * .8) * .25 * s;
  }

  if (G.studio.visible) {
    if (!drag) {
      vel *= .94;
      yaw += vel + kv * .004;
      pitch *= .96;
      spin += dt * .0006 * s;
    }

    if (spin > nextTurn) {
      nextTurn += TAU;

      if (auto) {
        bi = (bi + 1) % BR.length;
        brandPick(bi);
      }
    }

    bob = Math.sin(t * .0012) * .06 * s;

    fitStudio();

    G.studio.rotation.x = pitch;

    cup.rotation.y = spin + yaw;
    bag.rotation.y = spin + yaw + 1;
  }

  const fl = Math.max(0, 1 - Math.max(F.hero.v, F.studio.v) * 1.15);

  FL.visible = fl > .01;

  if (FL.visible) {
    const tf = Math.tan(cam.fov * Math.PI / 360);

    flDefs.forEach(d => {
      const dist = cam.position.z - d.z;
      const H = 2 * tf * dist;
      const W = H * cam.aspect;
      const span = H * 1.5;

      const y =
        ((d.p * span + sp * d.s * H * .9) % span + span) % span - span / 2;

      d.m.position.x = d.fx * W * .5 + mx * .4 * d.s;

      d.m.position.y =
        y + Math.sin(t * .001 + d.p * 9) * .12 * s;

      d.m.rotation.x =
        sp * d.s * 1.6 + t * .0002 * s + kv * .01;

      d.m.rotation.y =
        sp * d.s * 1.1 + t * .0003 * s * (d.p + .5);
    });

    FL.scale.setScalar(Math.max(.0001, fl * (mob ? .6 : 1)));
  }

  K.forEach(k => {
    const f = F[k].v;
    const g = G[k];

    g.visible = f > .01;

    g.scale.setScalar(
      Math.max(
        .0001,
        (k === 'studio' ? fitK : SC[k] * (mob ? .7 : 1)) * f
      )
    );
  });

  cam.position.x += (mx * .6 - cam.position.x) * .05;
  cam.position.y += (-my * .6 - cam.position.y) * .05;

  cam.lookAt(0, 0, 0);

  R.render(scene, cam);

  requestAnimationFrame(loop);
})(0);