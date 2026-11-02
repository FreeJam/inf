/*
 * hand.js — «пишущая рука»: кинематика двухзвенного манипулятора,
 * строящего почерк по траектории.
 *
 * Кинематика и композиция сцены портированы из шаблона 21st.dev
 * «Handwritten Notes Landing Page» (автор kedhareswer, free template),
 * переписаны на ванильный JS. Текст пишется шрифтом Caveat (SIL OFL),
 * латиница-графика — SVG-линиями.
 */

const NS = "http://www.w3.org/2000/svg";
const RAD = 180 / Math.PI;

function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

function shift(m, x, y) {
  return [m[0], m[1], m[2], m[3], m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

export function placeMatrix(tx, ty, deg) {
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [c, s, -s, c, tx, ty];
}

export function apply(m, x, y, out) {
  out = out || [0, 0];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}

/** Двухзвенная обратная кинематика: плечо, локоть, кисть (радианы). */
export function solveArm(bx, by, l1, l2, tx, ty, bend) {
  const dx = tx - bx;
  const dy = ty - by;
  const raw = Math.hypot(dx, dy);
  const d = Math.min(Math.max(raw, Math.abs(l1 - l2) + 0.001), l1 + l2 - 0.001);
  const th = Math.atan2(dy, dx);
  const c = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const A = Math.acos(Math.min(1, Math.max(-1, c)));
  const a1 = th + (bend < 0 ? -A : A);
  const ex = bx + l1 * Math.cos(a1);
  const ey = by + l1 * Math.sin(a1);
  const a2 = Math.atan2(ty - ey, tx - ex);
  return { a1, a2, ex, ey, reach: raw <= l1 + l2 };
}

/* ------------------------------------------------------------------ рука */

export class PenArm {
  /**
   * @param {SVGElement} mount — группа, куда рисовать руку
   * @param {object} geo — плечо, звенья, матрица бумаги, парковка, перо, трубка
   * @param {object} opts — ink, width (толщина линии пера)
   */
  constructor(mount, geo, opts) {
    opts = opts || {};
    this.geo = geo;
    this.ink = opts.ink || "currentColor";
    this.sw = opts.width == null ? 1.4 : opts.width;

    const k = geo.k;
    this.tone = geo.tone === "second" ? "ln-a-sec" : "ln-a-acc";
    this.toneB = geo.tone === "second" ? "ln-a-acc" : "ln-a-sec";

    const g = el("g", { class: "ln-arm", "stroke-width": 2.1 * k, "aria-hidden": "true" }, mount);
    this.root = g;

    // трубка, по которой ползёт кабель питания
    el("path", { class: "ln-tube-o", d: geo.tube, "stroke-width": 25 * k }, g);
    el("path", { class: "ln-tube-f", d: geo.tube, "stroke-width": 20 * k }, g);
    el("path", {
      class: "ln-tube-r",
      d: geo.tube,
      "stroke-width": 20 * k,
      "stroke-dasharray": 1.6 * k + " " + 6.5 * k,
    }, g);

    // корпус плеча
    const house = el("g", { transform: `translate(${geo.bx} ${geo.by}) rotate(${geo.housing})` }, g);
    el("rect", { x: -32 * k, y: -20 * k, width: 64 * k, height: 40 * k, rx: 20 * k, class: this.tone }, house);
    el("rect", { x: -32 * k, y: -20 * k, width: 64 * k, height: 40 * k, rx: 20 * k, class: "ln-a-line" }, house);
    [-1, 0, 1].forEach((d) => {
      el("circle", { cx: -17 * k + d * 6 * k, cy: 8 * k, r: 1.9 * k, class: "ln-a-ink" }, house);
    });
    el("path", { d: `M${6 * k} ${-9 * k}h${16 * k}`, class: "ln-a-line" }, house);

    // точка касания бумаги
    this.dot = el("circle", { r: this.sw * 0.9, fill: this.ink, opacity: 0 }, g);

    // перо
    this.pen = el("g", { class: "ln-pen" }, g);
    el("path", { d: `M0 0L${9 * k} ${-3.4 * k}V${3.4 * k}Z`, class: "ln-a-ink" }, this.pen);
    el("rect", { x: 9 * k, y: -4.4 * k, width: geo.pen - 9 * k, height: 8.8 * k, rx: 2 * k, class: "ln-a-body" }, this.pen);
    el("rect", { x: geo.pen * 0.42, y: -4.4 * k, width: geo.pen * 0.18, height: 8.8 * k, class: this.toneB }, this.pen);

    // плечо
    this.upper = el("g", null, g);
    el("rect", { x: -15 * k, y: -14 * k, width: geo.l1 + 30 * k, height: 28 * k, rx: 14 * k, class: "ln-a-body" }, this.upper);
    el("path", { d: `M${24 * k} 0H${geo.l1 - 22 * k}`, class: "ln-a-line ln-a-thin" }, this.upper);
    [0, 1, 2].forEach((d) => {
      el("path", {
        d: `M${geo.l1 * 0.5 + (d - 1) * 7 * k} ${-14 * k}v${28 * k}`,
        class: "ln-a-line ln-a-thin",
      }, this.upper);
    });

    // предплечье
    this.fore = el("g", null, g);
    el("rect", { x: -11 * k, y: -10 * k, width: geo.l2 + 22 * k, height: 20 * k, rx: 10 * k, class: "ln-a-body" }, this.fore);
    el("path", { d: `M${18 * k} ${-3 * k}H${geo.l2 - 16 * k}`, class: "ln-a-line ln-a-thin" }, this.fore);

    // локоть и зажим
    this.elbow = el("g", null, g);
    el("circle", { r: 13 * k, class: this.toneB }, this.elbow);
    el("circle", { r: 13 * k, class: "ln-a-line" }, this.elbow);
    el("circle", { r: 4 * k, class: "ln-a-ink" }, this.elbow);

    this.clamp = el("g", null, g);
    el("circle", { r: 9 * k, class: this.tone }, this.clamp);
    el("circle", { r: 9 * k, class: "ln-a-line" }, this.clamp);
    el("circle", { r: 2.6 * k, class: "ln-a-ink" }, this.clamp);

    const base = el("g", { transform: `translate(${geo.bx} ${geo.by})` }, g);
    el("circle", { r: 17 * k, class: "ln-a-body" }, base);
    el("circle", { r: 7 * k, class: this.toneB }, base);
    el("circle", { r: 7 * k, class: "ln-a-line" }, base);

    this.state = { x: geo.park[0], y: geo.park[1], lift: 1 };
    this.pose(geo.park[0], geo.park[1], 1);
  }

  /** Поставить перо в точку бумаги (локальные координаты листа). */
  pose(x, y, lift) {
    const g = this.geo;
    const k = g.k;
    this.state = { x, y, lift: lift || 0 };
    const P = apply(g.m, x, y, [0, 0]);
    const tx = P[0] - lift * 1.6 * k;
    const ty = P[1] - lift * 4 * k;
    const pa = g.penAngle / RAD;
    const cx = tx + g.pen * Math.cos(pa);
    const cy = ty + g.pen * Math.sin(pa);
    const s = solveArm(g.bx, g.by, g.l1, g.l2, cx, cy, g.bend);

    if (this.upper) this.upper.setAttribute("transform", `translate(${g.bx} ${g.by}) rotate(${(s.a1 * RAD).toFixed(2)})`);
    const exy = s.ex.toFixed(2) + " " + s.ey.toFixed(2);
    if (this.elbow) this.elbow.setAttribute("transform", `translate(${exy})`);
    if (this.fore) this.fore.setAttribute("transform", `translate(${exy}) rotate(${(s.a2 * RAD).toFixed(2)})`);
    const ax = s.ex + g.l2 * Math.cos(s.a2);
    const ay = s.ey + g.l2 * Math.sin(s.a2);
    if (this.clamp) this.clamp.setAttribute("transform", `translate(${ax.toFixed(2)} ${ay.toFixed(2)})`);
    const px = ax - g.pen * Math.cos(pa);
    const py = ay - g.pen * Math.sin(pa);
    if (this.pen) this.pen.setAttribute("transform", `translate(${px.toFixed(2)} ${py.toFixed(2)}) rotate(${g.penAngle})`);
    if (this.dot) {
      this.dot.setAttribute("cx", P[0].toFixed(2));
      this.dot.setAttribute("cy", P[1].toFixed(2));
      this.dot.style.opacity = String(Math.max(0, 1 - lift * 3));
    }
  }

  /** Спрятать руку (мобильная версия, reduced motion). */
  hide() {
    if (this.root) this.root.style.display = "none";
  }
}

/* --------------------------------------------------------------- письмо */

let uid = 0;

function measure(textEl, str) {
  textEl.textContent = str;
  return textEl.getComputedTextLength();
}

/** Разбить абзац на строки по ширине, меряя настоящим шрифтом. */
function wrap(paras, measureEl, width) {
  const out = [];
  for (const p of paras) {
    const words = String(p.text).split(/\s+/).filter(Boolean);
    let line = "";
    for (const w of words) {
      const cand = line ? line + " " + w : w;
      if (line && measure(measureEl, cand) > width) {
        out.push({ text: line, align: p.align });
        line = w;
      } else {
        line = cand;
      }
    }
    if (line) out.push({ text: line, align: p.align });
    if (p.gap) out.push({ text: "", align: p.align });
  }
  return out;
}

/**
 * Сцена «рука пишет на листе».
 * Пишет русский текст шрифтом Caveat, ведя перо по строке.
 *
 * @param {object} o
 *   svg      — SVG-элемент сцены
 *   geo      — геометрия (см. PenArm)
 *   paper    — SVG-разметка листа (строка, локальные координаты листа)
 *   over     — SVG-разметка поверх листа (конверт и т.п.)
 *   paras    — [{text, align, gap}]
 *   size     — кегль почерка в единицах листа
 *   box      — {x, y, width, lead} — начало и ширина строки, межстрочный
 *   speed    — скорость пера, единиц листа в секунду
 *   ink      — цвет чернил
 *   auto     — начинать по появлению в кадре (true) или сразу
 *   onDone   — колбэк по окончании
 */
export function writeScene(o) {
  const svg = o.svg;
  const geo = o.geo;
  const size = o.size;
  const box = o.box;
  const lead = box.lead || 1.5;
  const speed = o.speed || size * 7;
  const ink = o.ink || "var(--ln-ink)";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const id = "lnw" + ++uid;

  svg.innerHTML = "";
  svg.setAttribute("viewBox", o.viewBox || "0 -120 760 760");

  const stage = el("g", { transform: `matrix(${geo.m.join(" ")})` }, svg);
  const paperG = el("g", null, stage);
  paperG.innerHTML = o.paper || "";

  const textG = el("g", { class: "ln-hand-text", fill: ink }, stage);
  const probe = el("text", {
    class: "ln-hand",
    "font-size": size,
    "aria-hidden": "true",
    x: -9999,
    y: -9999,
  }, textG);

  const armMount = el("g", null, svg);

  // ждём шрифт, иначе строки разложатся по метрикам фолбэка
  const start = () => {
    const lines = wrap(o.paras, probe, box.width);
    probe.remove();
    const pitch = size * lead;
    const items = lines.map((ln, i) => {
      const y = box.y + i * pitch;
      const clip = el("clipPath", { id: id + "-c" + i, clipPathUnits: "userSpaceOnUse" }, textG);
      const rect = el("rect", { x: box.x - 4, y: y - size * 1.05, width: 0, height: size * 1.5 }, clip);
      const t = el("text", {
        class: "ln-hand",
        "font-size": size,
        x: box.x,
        y,
        "clip-path": `url(#${id}-c${i})`,
        "text-anchor": ln.align === "right" ? "end" : ln.align === "center" ? "middle" : "start",
      }, textG);
      if (ln.align === "right") t.setAttribute("x", box.x + box.width);
      if (ln.align === "center") t.setAttribute("x", box.x + box.width / 2);
      t.textContent = ln.text;
      const w = ln.text ? t.getComputedTextLength() : 0;
      // выравнивание: перо и раскрывающий клип идут слева направо от начала строки,
      // поэтому для right/center начало строки считаем от её ширины
      const startX =
        ln.align === "right" ? box.x + box.width - w : ln.align === "center" ? box.x + box.width / 2 - w / 2 : box.x;
      rect.setAttribute("x", startX - 4);
      return { t, rect, w, y, text: ln.text, startX };
    });

    const arm = new PenArm(armMount, geo, { ink, width: o.stroke });

    const showAll = () => {
      items.forEach((it) => {
        it.rect.setAttribute("width", it.w + 6);
        it.t.style.opacity = 1;
      });
      arm.pose(geo.park[0], geo.park[1], 1);
      if (o.onDone) o.onDone();
    };

    if (reduced) {
      showAll();
      return;
    }

    let raf = 0;
    let started = false;

    const run = () => {
      let i = 0;
      let along = 0;
      let lift = 1;
      let last = 0;
      let phase = "toLine"; // toLine → write → toLine …
      const tick = (now) => {
        raf = requestAnimationFrame(tick);
        const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
        last = now;
        const it = items[i];
        if (!it) {
          arm.pose(geo.park[0], geo.park[1], 1);
          cancelAnimationFrame(raf);
          raf = 0;
          if (o.onDone) o.onDone();
          return;
        }
        const want = phase === "write" ? 0 : 1;
        lift += (want - lift) * Math.min(1, dt * 14);

        if (phase === "toLine") {
          // подъём к началу строки
          lift = 1;
          arm.pose(it.startX, it.y, 1);
          phase = "write";
          return; // следующий кадр начнёт опускать перо
        }

        if (lift > 0.12) {
          // держим перо поднятым, пока не опустимся
          arm.pose(it.startX + Math.min(along, it.w), it.y, lift);
          return;
        }

        along += speed * dt;
        const progress = Math.min(1, it.w ? along / it.w : 1);
        it.rect.setAttribute("width", it.w * progress + 6);
        if (o.onProgress) o.onProgress(i / Math.max(1, items.length) + progress / Math.max(1, items.length));
        // чуть живой почерк: перо слегка гуляет по базовой линии
        const wob = Math.sin(along * 0.06) * size * 0.012;
        arm.pose(it.startX + along, it.y + wob, 0);

        if (along >= it.w) {
          along = 0;
          i += 1;
          phase = "toLine";
          if (!items[i]) {
            arm.pose(geo.park[0], geo.park[1], 1);
            cancelAnimationFrame(raf);
            raf = 0;
            if (o.onDone) o.onDone();
          }
        }
      };

      const go = () => {
        if (started) return;
        started = true;
        raf = requestAnimationFrame(tick);
      };

      if (o.auto === false) {
        go();
      } else {
        const io = new IntersectionObserver((es) => {
          if (es.some((e) => e.isIntersecting)) {
            io.disconnect();
            go();
          }
        }, { rootMargin: "0px 0px -18% 0px" });
        io.observe(svg);
      }
    };

    run();
  };

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
  else start();
}

/* ------------------------------------------------------- прочая анимация */

/** Нарисовать SVG-путь «от руки»: dash-обводка по мере появления в кадре. */
export function initDraw(root) {
  const nodes = (root || document).querySelectorAll("[data-draw]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  nodes.forEach((p) => {
    let len = 0;
    try {
      len = p.getTotalLength();
    } catch (e) {
      len = 400;
    }
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = reduced ? 0 : len;
    if (reduced) return;
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const dur = p.dataset.draw || "1.4";
      p.style.transition = `stroke-dashoffset ${dur}s cubic-bezier(.22,1,.36,1) ${p.dataset.delay || "0s"}`;
      requestAnimationFrame(() => {
        p.style.strokeDashoffset = 0;
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    io.observe(p);
  });
}

/** Появление блоков при скролле. */
export function initReveal(root) {
  const nodes = (root || document).querySelectorAll(".rv");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    nodes.forEach((n) => n.setAttribute("data-in", ""));
    return;
  }
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.setAttribute("data-in", "");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  nodes.forEach((n) => {
    n.setAttribute("data-armed", "");
    io.observe(n);
  });
}

/** Липкая навигация: тень после прокрутки + мобильное меню. */
export function initNav() {
  const nav = document.querySelector(".ln-nav");
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 8) nav.setAttribute("data-stuck", "");
      else nav.removeAttribute("data-stuck");
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
  }

  const burger = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  if (burger && menu) {
    const set = (open) => {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) menu.setAttribute("data-open", "");
      else menu.removeAttribute("data-open");
      document.body.classList.toggle("ln-lock", open);
    };
    burger.addEventListener("click", () => set(burger.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) set(false);
    });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape") set(false);
    });
  }
}

/** Тема: светлая/тёмная, с сохранением и следованием системе. */
export function initTheme() {
  const root = document.documentElement;
  const KEY = "inf-theme";
  const saved = localStorage.getItem(KEY);
  const sys = matchMedia("(prefers-color-scheme: dark)");
  const apply = (dark) => {
    root.setAttribute("data-theme", dark ? "dark" : "light");
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => {
      b.setAttribute("aria-pressed", dark ? "true" : "false");
      b.setAttribute("aria-label", dark ? "Светлая тема" : "Тёмная тема");
    });
  };
  apply(saved ? saved === "dark" : sys.matches);
  sys.addEventListener("change", (e) => {
    if (!localStorage.getItem(KEY)) apply(e.matches);
  });
  document.querySelectorAll("[data-theme-toggle]").forEach((b) => {
    b.addEventListener("click", () => {
      const dark = root.getAttribute("data-theme") !== "dark";
      localStorage.setItem(KEY, dark ? "dark" : "light");
      apply(dark);
    });
  });
}

/** Кнопки «скопировать» у блоков с кодом/промптом. */
export function initCopy() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const target = document.querySelector(btn.dataset.copy);
      if (!target) return;
      const text = target.value != null && target.tagName.match(/INPUT|TEXTAREA/) ? target.value : target.textContent;
      try {
        await navigator.clipboard.writeText(text.trim());
      } catch (e) {
        const ta = document.createElement("textarea");
        ta.value = text.trim();
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      const label = btn.dataset.label || btn.textContent;
      btn.dataset.label = label;
      btn.textContent = "Скопировано";
      btn.setAttribute("data-done", "");
      setTimeout(() => {
        btn.textContent = label;
        btn.removeAttribute("data-done");
      }, 1600);
    });
  });
}

/** Инициализация общих механик страницы. */
export function initPage() {
  initTheme();
  initNav();
  initReveal();
  initDraw();
  initCopy();
  fitRoute();
  fitTaskMarks();
}

/* пунктирная линия маршрута: ровно от первого кружка до последнего */
function fitRoute() {
  const route = document.querySelector(".route");
  const line = document.querySelector(".route-line");
  const dots = [...document.querySelectorAll(".route .step-no")];
  if (!route || !line || dots.length < 2) return;
  const draw = () => {
    const box = route.getBoundingClientRect();
    const first = dots[0].getBoundingClientRect();
    const last = dots[dots.length - 1].getBoundingClientRect();
    const top = first.top + first.height / 2 - box.top;
    const bottom = box.bottom - (last.top + last.height / 2);
    line.style.top = top.toFixed(1) + "px";
    line.style.bottom = bottom.toFixed(1) + "px";
  };
  draw();
  let t = 0;
  addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(draw, 120);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
}

/* номера в копилке задач: одинаковой ширины, чтобы заголовки стояли по одной линии */
function fitTaskMarks() {
  const marks = [...document.querySelectorAll(".task-n")];
  if (!marks.length) return;
  const pad = marks.map((m) => m.textContent.trim());
  const width = String(Math.max(...pad.map(Number))).length;
  marks.forEach((m) => (m.textContent = m.textContent.trim().padStart(2, "0")));
  marks.forEach((m) => (m.style.minWidth = width + "ch"));
}
