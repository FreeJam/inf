/* ============================================================
   Тренажёр мастер-класса: конструктор промпта по любому предмету,
   живая записка от руки и песочница Python (Pyodide).
   ============================================================ */

import { writeScene } from "./hand.js";

/* ------------------------------- данные ------------------------------- */

const SUBJECTS = {
  rus: {
    label: "Русский язык",
    dative: "русскому языку",
    topics: [
      "Правописание безударных гласных в корне",
      "Причастный оборот и обособление",
      "Правописание НЕ и НИ",
      "Обособленные члены предложения",
      "Типы речи: описание",
    ],
  },
  lit: {
    label: "Литература",
    dative: "литературе",
    topics: [
      "Характеристика литературного героя",
      "Средства художественной выразительности",
      "Анализ лирического стихотворения",
      "Тема и идея рассказа",
      "Сравнение двух героев",
    ],
  },
  math: {
    label: "Математика",
    dative: "математике",
    topics: [
      "Проценты и задачи на скидку",
      "Действия с обыкновенными дробями",
      "Линейные уравнения",
      "Площадь и периметр фигур",
      "Задачи на движение",
    ],
  },
  hist: {
    label: "История",
    dative: "истории",
    topics: [
      "Работа с хронологией",
      "Причины и итоги исторического события",
      "Чтение исторической карты",
      "Работа с историческим источником",
      "Личность в истории",
    ],
  },
  soc: {
    label: "Обществознание",
    dative: "обществознанию",
    topics: [
      "Права и обязанности школьника",
      "Социальные группы",
      "Экономика семьи",
      "Государство и его признаки",
      "Мораль и право",
    ],
  },
  phys: {
    label: "Физика",
    dative: "физике",
    topics: [
      "Плотность вещества",
      "Сила и давление",
      "Тепловые явления",
      "Электрические цепи",
      "Работа и мощность",
    ],
  },
  chem: {
    label: "Химия",
    dative: "химии",
    topics: [
      "Строение атома",
      "Химические реакции",
      "Растворы и концентрация",
      "Кислоты и основания",
      "Периодический закон",
    ],
  },
  bio: {
    label: "Биология",
    dative: "биологии",
    topics: [
      "Приспособления организмов к среде",
      "Клетка и её органоиды",
      "Экосистемы и цепи питания",
      "Наследственность",
      "Обмен веществ",
    ],
  },
  geo: {
    label: "География",
    dative: "географии",
    topics: [
      "Климат и климатические пояса",
      "Природные зоны",
      "Население и города",
      "Работа с картой",
      "Рельеф и полезные ископаемые",
    ],
  },
  eng: {
    label: "Иностранный язык",
    dative: "иностранному языку",
    topics: [
      "Present Simple",
      "Past Simple",
      "Лексика по теме «Семья»",
      "Степени сравнения прилагательных",
      "Личное письмо другу",
    ],
  },
  prim: {
    label: "Окружающий мир",
    dative: "окружающему миру",
    topics: [
      "Времена года и наблюдения",
      "Животные и растения родного края",
      "Правила безопасности",
      "Профессии и труд",
      "Семья и школа",
    ],
  },
  inf: {
    label: "Информатика",
    dative: "информатике",
    topics: [
      "Циклы и условия (while/for)",
      "Обработка символьных строк",
      "Массивы и поиск максимума",
      "Словари и списки",
      "Двумерные массивы",
    ],
  },
};

const CONTEXTS = {
  kraj: {
    title: "Краеведение: природа и история нашего региона",
    plot: "местный материал: северное сияние, зимник, тундра Ямала, река, посёлок, промыслы и ремёсла.",
    note: "Краеведческую справку дай коротко и только с фактами, которые учитель сможет проверить по местным источникам; сомнительное помечай [ПРОВЕРИТЬ].",
  },
  rus: {
    title: "История и наука России",
    plot: "страницы отечественной истории, открытия русских учёных, путешественников и инженеров.",
    note: "Даты, имена и числа давай только те, в которых уверен; спорное или приблизительное помечай [ПРОВЕРИТЬ].",
  },
  lit: {
    title: "Литература и народная культура",
    plot: "образы русской литературы, сказы, пословицы, народные традиции и праздники.",
    note: "Цитаты и названия произведений приводи точно; если не уверен в формулировке — помечай [ПРОВЕРИТЬ].",
  },
  school: {
    title: "Школьная жизнь",
    plot: "обычный день школьника: расписание, столовая, поход, спортивная секция, школьный музей.",
    note: "Числа и ситуации делай правдоподобными и проверяемыми, без выдуманных «научных» данных.",
  },
  nature: {
    title: "Природа и экология",
    plot: "наблюдения за погодой, растения и животные, охрана природы, раздельный сбор.",
    note: "Биологические и физические факты — только корректные; приблизительные значения помечай [ПРОВЕРИТЬ].",
  },
  life: {
    title: "Бытовые ситуации и расчёты",
    plot: "покупки, скидки, поездки, семейный бюджет, ремонт, кулинарный рецепт.",
    note: "Все числа должны сходиться арифметически — пересчитай их перед выводом.",
  },
};

const LEVELS = {
  opora: {
    label: "С опорами",
    hint: "С опорами: план ответа, опорные слова, образец первого шага.",
    req: "Уровень С ОПОРАМИ: дай задание с готовым планом ответа, опорными словами и образцом первого шага. Ученик работает по образцу, а не с чистого листа.",
    task: "задание с планом ответа и опорными словами",
  },
  base: {
    label: "Основной",
    hint: "Основной: ученик выполняет задание самостоятельно, без подсказок.",
    req: "ОСНОВНОЙ уровень: ученик выполняет задание самостоятельно, подсказок внутри условия нет.",
    task: "самостоятельное задание без подсказок",
  },
  pro: {
    label: "Продвинутый",
    hint: "Продвинутый: второй источник или исключение, вопрос на перенос.",
    req: "ПРОДВИНУТЫЙ уровень: добавь второй источник или исключение из правила и вопрос на перенос в новую ситуацию. Отдельно опиши, за что ставится «отлично».",
    task: "задание с исключением и вопросом на перенос",
  },
};

const GRADES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];

function gradeLabel(g) {
  const n = Number(g);
  if (n === 1) return "1 класс";
  if (n >= 2 && n <= 4) return n + " класс";
  return n + " класс";
}

function buildPrompt(subjectKey, grade, topic, ctxKey, level) {
  const s = SUBJECTS[subjectKey];
  const ctx = CONTEXTS[ctxKey];
  const lvl = LEVELS[level];
  return [
    "Выступи в роли методиста по " + s.dative + " и опытного проверяющего работ учеников.",
    "",
    "ПРЕДМЕТ: " + s.label.toLowerCase() + ", " + gradeLabel(grade) + ".",
    "ТЕМА ПО ФГОС: " + topic + ".",
    "",
    "КОНТЕКСТ: " + ctx.title + ".",
    "Сюжет: " + ctx.plot,
    ctx.note,
    "",
    lvl.req,
    "",
    "ТРЕБОВАНИЯ К ЗАДАНИЮ:",
    "— условие не длиннее 120 слов, язык доступен ученику " + gradeLabel(grade) + ";",
    "— все факты, даты и числа — проверяемые, без домыслов;",
    "— задание выполнимо за 10–15 минут урока;",
    "— ничего лишнего: без ссылок на внешние ресурсы и без «сделай проект».",
    "",
    "ФОРМАТ ВЫВОДА (строго по разделам):",
    "1) задание для ученика — " + lvl.task + ";",
    "2) эталонный ответ;",
    "3) три критерия оценивания с баллами;",
    "4) две типичные ошибки и как их объяснить ученику;",
    "5) методическая пометка: какой результат по ФГОС проверяет задание.",
  ].join("\n");
}

/* ------------------------- конструктор промпта ------------------------- */

export function initBuilder() {
  const subjSel = document.getElementById("subject");
  const gradeSel = document.getElementById("grade");
  const topicSel = document.getElementById("topic");
  const ctxSel = document.getElementById("context");
  const out = document.getElementById("prompt-out");
  const meta = document.getElementById("prompt-meta");
  if (!subjSel || !out) return;

  let level = "base";

  function fillGrades() {
    if (!gradeSel || gradeSel.options.length) return;
    GRADES.forEach((g) => {
      const o = document.createElement("option");
      o.value = g;
      o.textContent = gradeLabel(g);
      gradeSel.appendChild(o);
    });
    gradeSel.value = "6";
  }

  function fillTopics() {
    const s = SUBJECTS[subjSel.value];
    const prev = topicSel.value;
    topicSel.innerHTML = "";
    s.topics.forEach((t) => {
      const o = document.createElement("option");
      o.value = t;
      o.textContent = t;
      topicSel.appendChild(o);
    });
    if (s.topics.includes(prev)) topicSel.value = prev;
  }

  document.querySelectorAll("[data-level]").forEach((chip) => {
    chip.addEventListener("click", () => {
      level = chip.dataset.level;
      document.querySelectorAll("[data-level]").forEach((c) => {
        c.setAttribute("aria-pressed", String(c === chip));
      });
      const hint = document.getElementById("level-hint");
      if (hint) hint.textContent = LEVELS[level].hint;
      render();
    });
  });

  function render() {
    const text = buildPrompt(subjSel.value, gradeSel ? gradeSel.value : "6", topicSel.value, ctxSel.value, level);
    out.value = text;
    if (meta) {
      meta.textContent = [
        LEVELS[level].label,
        SUBJECTS[subjSel.value].label,
        gradeLabel(gradeSel ? gradeSel.value : "6"),
        text.length + " симв.",
      ].join(" · ");
    }
    return text;
  }

  fillGrades();
  fillTopics();
  document.getElementById("gen").addEventListener("click", render);
  [subjSel, gradeSel, topicSel, ctxSel].forEach((el) => el && el.addEventListener("change", render));
  subjSel.addEventListener("change", () => {
    fillTopics();
    render();
  });
  render();
}

/* --------------------------- живая записка --------------------------- */

const NOTE_GEO = {
  bx: 300,
  by: -140,
  l1: 270,
  l2: 260,
  bend: -1,
  m: [1, 0, 0, 1, 0, 0],
  park: [520, 20],
  pen: 52,
  penAngle: -58,
  tube: "M300 -140C300 -210 372 -244 470 -262",
  housing: -90,
  k: 0.9,
};

const NOTE_VIEW = "0 -260 640 660";

const NOTE_PAPER = `
  <rect x="30" y="40" width="580" height="420" fill="#fffdf8" stroke="rgba(0,0,0,.14)"/>
  <rect x="46" y="56" width="548" height="388" fill="none" stroke="rgba(0,0,0,.06)"/>
  <rect x="252" y="20" width="136" height="34" transform="rotate(-2 320 37)" fill="rgba(42,142,137,.35)"/>
  <path d="M66 330h520M66 386h520" stroke="rgba(28,28,30,.07)" stroke-width="1"/>
  <text x="66" y="428" style="font-family:var(--sans);font-size:11px;letter-spacing:.16em;fill:rgba(28,28,30,.45)">ЗАПИСКА С МАСТЕР-КЛАССА</text>
  <g transform="translate(520 392)">
    <circle r="20" fill="none" stroke="#2a8e89" stroke-width="1.6"/>
    <text y="5" text-anchor="middle" style="font-family:var(--sans);font-size:10px;letter-spacing:.08em;fill:#2a8e89">МК</text>
  </g>`;

/** Перерисовать записку с новым текстом. */
function drawNote(svg, text) {
  const body = (text || "").trim() || "Напишите промпт — рука перепишет его на записку.";
  writeScene({
    svg,
    geo: NOTE_GEO,
    paper: NOTE_PAPER,
    paras: [{ text: body }],
    size: 26,
    box: { x: 66, y: 152, width: 508, lead: 1.5 },
    speed: 260,
    ink: "#2340b0",
    viewBox: NOTE_VIEW,
    auto: false,
  });
}

export function initComposer() {
  const svg = document.getElementById("note-stage");
  const field = document.getElementById("note-text");
  const again = document.getElementById("note-again");
  if (!svg || !field) return;

  let timer = 0;
  const run = () => drawNote(svg, field.value);

  field.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(run, 900);
  });
  if (again) again.addEventListener("click", run);

  // первый проход — как только страница доехала до записки
  const io = new IntersectionObserver((es) => {
    if (!es.some((e) => e.isIntersecting)) return;
    io.disconnect();
    run();
  }, { rootMargin: "0px 0px -15% 0px" });
  io.observe(svg);
}

/* ------------------------- песочница Python ------------------------- */

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
let runtime = null;

function loadRuntime() {
  if (runtime) return runtime;
  runtime = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = PYODIDE_URL;
    s.onload = () => {
      if (typeof window.loadPyodide !== "function") {
        reject(new Error("Pyodide не загрузился"));
        return;
      }
      window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/" }).then(resolve).catch(reject);
    };
    s.onerror = () => reject(new Error("Нет доступа к CDN Pyodide"));
    document.head.appendChild(s);
  });
  return runtime;
}

export function initSandbox() {
  const runBtn = document.getElementById("run");
  const codeEl = document.getElementById("code");
  const consoleEl = document.getElementById("console");
  const stateEl = document.getElementById("console-state");
  const clearBtn = document.getElementById("clear");
  if (!runBtn || !codeEl || !consoleEl) return;

  const setState = (t) => {
    if (stateEl) stateEl.textContent = "консоль · " + t;
  };
  const log = (text, cls) => {
    const span = document.createElement("span");
    if (cls) span.className = cls;
    span.textContent = text;
    consoleEl.appendChild(span);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  };

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      consoleEl.innerHTML = '<span class="dim">[SYSTEM] Консоль очищена.</span>';
      setState("ожидание");
    });
  }

  runBtn.addEventListener("click", () => {
    const code = codeEl.value;
    if (!code.trim()) {
      log("\n[SYSTEM] Пустой код — нечего выполнять.\n", "er");
      return;
    }
    runBtn.disabled = true;
    consoleEl.innerHTML = "";
    setState("загрузка окружения…");

    loadRuntime()
      .then((py) => {
        setState("выполняется…");
        py.setStdout({ batched: (s) => log(s + "\n") });
        py.setStderr({ batched: (s) => log(s + "\n", "er") });
        return py.runPythonAsync(code);
      })
      .then(() => {
        setState("готово · exit 0");
        log("[SYSTEM] Выполнение завершено.\n", "ok");
      })
      .catch((err) => {
        const msg = String(err && err.message ? err.message : err);
        if (msg.indexOf("Traceback") === -1) {
          log("[SYSTEM] Ошибка окружения: " + msg + "\n", "er");
          log("Pyodide подгружается с CDN — проверьте интернет и попробуйте снова.\n", "dim");
        } else {
          log(msg + "\n", "er");
          log("[SYSTEM] Код завершился с ошибкой — такие случаи разбираем в лаборатории проверки.\n", "dim");
        }
        setState("ошибка");
      })
      .finally(() => {
        runBtn.disabled = false;
      });
  });
}

/* ------------------------------ запуск ------------------------------ */

initBuilder();
initComposer();
initSandbox();
