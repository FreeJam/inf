/* ============================================================
   Копилка заданий мастер-класса: задания по предметам,
   фильтры по предмету, классу и теме, добавление своего (localStorage).
   ============================================================ */

const TASKS = [
  {
    id: "rus-participle",
    subject: "Русский язык",
    title: "Северное сияние: причастные обороты",
    topic: "Причастный оборот и обособление",
    grade: "7-8",
    gradeLabel: "7 класс",
    plot: "Текст о северном сиянии над посёлком: пять причастных оборотов, запятые не расставлены.",
    condition: "Расставьте пропущенные запятые.\n\nСеверное сияние — свет рождённый столкновением солнечного ветра с атмосферой. Над посёлком окружённым бескрайней тундрой вспыхивают зелёные и фиолетовые полосы. Лучи рождённые частицами солнечного ветра то вытягиваются в дуги то рассыпаются искрами. Люди стоящие на улице в сорокаградусный мороз редко дожидаются конца зрелища. Явление изученное физиками довольно подробно всё ещё удивляет наблюдателей.",
    answer:
      "Северное сияние — свет, рождённый столкновением солнечного ветра с атмосферой. Над посёлком, окружённым бескрайней тундрой, вспыхивают зелёные и фиолетовые полосы. Лучи, рождённые частицами солнечного ветра, то вытягиваются в дуги, то рассыпаются искрами. Люди, стоящие на улице в сорокаградусный мороз, редко дожидаются конца зрелища. Явление, изученное физиками довольно подробно, всё ещё удивляет наблюдателей.",
    criteria:
      "2 балла — обособлены все пять причастных оборотов и пара «то… то»;\n1 балл — одна-две пропущенные запятые;\n0 баллов — три и более ошибки.\nОтдельно проверяется, что запятая не поставлена после определяемого слова.",
    fgos: "Обособление причастного оборота, стоящего после определяемого слова.",
  },
  {
    id: "math-percent",
    subject: "Математика",
    title: "Две скидки или одна?",
    topic: "Проценты и задачи на скидку",
    grade: "5-6",
    gradeLabel: "6 класс",
    plot: "Магазин в северном посёлке снижает цену на оленьи шкуры дважды за зиму.",
    condition: "Шкура стоила 4800 ₽. В декабре цену снизили на 15 %, в январе — ещё на 10 % от новой цены.\n1) Сколько стоит шкура после двух скидок?\n2) Что выгоднее покупателю: эти две скидки или одна скидка 25 %? Ответ обоснуйте вычислением.",
    answer:
      "1) 4800 · 0,85 = 4080 ₽ после первой скидки;\n4080 · 0,9 = 3672 ₽ после второй.\n2) Одна скидка 25 %: 4800 · 0,75 = 3600 ₽.\n3600 < 3672, значит одна скидка 25 % выгоднее: скидки не складываются, вторая считается от уже сниженной цены.",
    criteria:
      "1 балл — верно найдена цена после первой скидки;\n1 балл — верно найдена цена после второй;\n1 балл — верно посчитана цена при скидке 25 %;\n1 балл — сделан и объяснён вывод.\nОшибка «15 + 10 = 25 %» — 0 баллов за вывод.",
    fgos: "Проценты, нахождение процента от числа, последовательные изменения величины.",
  },
  {
    id: "hist-smp",
    subject: "История",
    title: "Хронология Северного морского пути",
    topic: "Работа с хронологией",
    grade: "7-8",
    gradeLabel: "8 класс",
    plot: "Пять событий освоения Арктики нужно расставить по времени и объяснить, что каждое изменило.",
    condition: "Расположите события в хронологическом порядке и укажите год каждого:\nА) первый сквозной рейс ледокола «Сибиряков» за одну навигацию;\nБ) Великая Северная экспедиция, описавшая берега Северного Ледовитого океана;\nВ) спуск на воду ледокола «Ермак»;\nГ) ввод в строй первого атомного ледокола «Ленин»;\nД) плавание экспедиции Норденшельда на «Веге» вокруг Евразии.",
    answer:
      "Б (1733–1743) → Д (1878–1879) → В (1899) → А (1932) → Г (1959).\nБ — первое систематическое описание арктического побережья.\nД — доказана возможность сквозного прохода, но за две навигации.\nВ — начало эпохи ледокольного флота.\nА — первый сквозной проход за одну навигацию.\nГ — атомная энергия делает навигацию круглогодичной.",
    criteria:
      "2 балла — верный порядок и все годы (допускается ±1 год);\n1 балл — верный порядок, но не более двух ошибок в датах;\n0 баллов — порядок нарушен.\nКомментарий к каждому событию — отдельный 1 балл.",
    fgos: "Хронология, работа с последовательностью исторических событий, причинно-следственные связи.",
  },
  {
    id: "geo-tundra",
    subject: "География",
    title: "Почему в тундре не растут деревья",
    topic: "Природные зоны",
    grade: "7-8",
    gradeLabel: "8 класс",
    plot: "Классический вопрос природной зоны: причины безлесья тундры.",
    condition: "Объясните, почему в тундре не растут деревья. Назовите не менее трёх причин и приведите по одному примеру приспособления тундровых растений к этим условиям.",
    answer:
      "Причины:\n1) многолетняя мерзлота — корни не проникают глубоко, вода не уходит в грунт, образуется заболачивание;\n2) недостаток тепла и короткий вегетационный период;\n3) сильные ветры, повреждающие побеги и выносящие снег;\n4) маломощный, бедный почвенный слой.\nПриспособления: карликовость (карликовая берёза), стелющиеся и подушковидные формы, мелкие кожистые листья, опушение, размножение корневищами.",
    criteria:
      "2 балла — три корректные причины;\n1 балл — две;\n1 балл — два примера приспособлений;\n0 баллов — причины названы, но неверны (например «там пустыня» или «нет чернозёма»).",
    fgos: "Природные зоны, взаимосвязь климата, рельефа и растительности.",
  },
  {
    id: "bio-lemming",
    subject: "Биология",
    title: "Лемминг под снегом",
    topic: "Приспособления организмов к среде",
    grade: "5-6",
    gradeLabel: "6 класс",
    plot: "Лемминг не впадает в спячку и всю зиму остаётся активным под снегом.",
    condition: "Лемминг не впадает в спячку и активен зимой под снегом. Объясните, какие преимущества даёт животному подснежный образ жизни и какие риски он создаёт. Приведите по два примера.",
    answer:
      "Преимущества: снег — теплоизолятор, под ним температура близка к нулю; защита от ветра и хищников; доступ к корням и побегам растений.\nРиски: оттепели и образование ледяной корки лишают корма; при малой толщине снега животное доступно хищникам; ограниченная подвижность и перенаселение в малых камерах.",
    criteria:
      "1 балл — два преимущества;\n1 балл — два риска;\n1 балл — объяснение роли снега как теплоизолятора;\n0 баллов — ответ сводится к «там теплее» без пояснения.",
    fgos: "Приспособленность организмов к условиям среды, сезонные изменения в жизни животных.",
  },
  {
    id: "phys-heat",
    subject: "Физика",
    title: "Почему мех греет и сколько тепла нужно воде",
    topic: "Тепловые явления",
    grade: "7-8",
    gradeLabel: "8 класс",
    plot: "Теплопроводность меха и расчёт количества теплоты — два шага одного задания.",
    condition: "1) Почему в меховой одежде тепло? Объясните роль воздуха между волосками.\n2) Сколько теплоты нужно, чтобы нагреть 2 кг воды от 10 до 60 °C? Удельная теплоёмкость воды 4200 Дж/(кг·°C).",
    answer:
      "1) Мех сам по себе не греет: он удерживает воздух, а воздух — плохой проводник тепла. Тонкие прослойки воздуха снижают теплопередачу от тела к среде.\n2) Q = c·m·(t₂ − t₁) = 4200 · 2 · 50 = 420 000 Дж = 420 кДж.",
    criteria:
      "1 балл — названо, что греет не мех, а воздух;\n1 балл — объяснена низкая теплопроводность воздуха;\n1 балл — верная формула;\n1 балл — верный ответ с единицами (420 кДж или 420 000 Дж).",
    fgos: "Теплопроводность, количество теплоты, расчёт по формуле Q = cmΔt.",
  },
  {
    id: "eng-present",
    subject: "Иностранный язык",
    title: "My school day: Present Simple",
    topic: "Present Simple",
    grade: "5-6",
    gradeLabel: "5 класс",
    plot: "Пять предложений о своём школьном дне в Present Simple.",
    condition: "Write 5 sentences about your school day in Present Simple. Use these verbs: get up, have, go, do, like.\nAdd one negative sentence (don't / doesn't) and one question.",
    answer:
      "Образец:\nI get up at seven o'clock.\nI have breakfast and go to school.\nI do my homework after lessons.\nI like maths and PE.\nI don't go to school on Sunday.\nDo you get up at seven o'clock?\n\nПравило: в 3-м лице единственного числа к глаголу добавляется -s (he goes), отрицание и вопрос строятся через does.",
    criteria:
      "3 балла — пять корректных утвердительных предложений;\n1 балл — верное отрицание;\n1 балл — верный вопрос;\n0 баллов — порядок слов нарушен или пропущено -s в 3-м лице.",
    fgos: "Present Simple: утверждение, отрицание, вопрос; лексика «школьный день».",
  },
  {
    id: "inf-temps",
    subject: "Информатика",
    title: "Минимум и средняя по наблюдениям",
    topic: "Циклы и обработка массива",
    grade: "9",
    gradeLabel: "9 класс",
    plot: "Данные наблюдений за неделю: минимальная температура, средняя и число дней ниже −30 °C.",
    condition: "Дан список температур за неделю. Требуется вывести:\n1) минимальную температуру;\n2) среднюю температуру с одним знаком после запятой;\n3) количество дней холоднее −30 °C.\nРеализуйте на Python без сторонних библиотек, добавьте комментарии.",
    answer:
      "temperatures = [-28, -32, -35, -20, -15, -40, -38]\n\nprint(f\"Минимум: {min(temperatures)}°C\")\nprint(f\"Средняя: {sum(temperatures) / len(temperatures):.1f}°C\")\nprint(f\"Дней ниже -30°C: {sum(1 for t in temperatures if t < -30)}\")",
    criteria:
      "1 балл — минимальное значение через min или перебор;\n1 балл — среднее с форматированием до одного знака;\n1 балл — строгое сравнение t < −30 (не <= );\n1 балл — читаемые имена и комментарии.",
    fgos: "Обработка массива: min, sum, len, генераторное выражение, форматирование вывода.",
  },
  {
    id: "soc-privacy",
    subject: "Обществознание",
    title: "Фото одноклассника в чате",
    topic: "Права и обязанности школьника",
    grade: "10-11",
    gradeLabel: "10–11 класс",
    plot: "Разбор бытовой ситуации через нормы права и школьные правила.",
    condition: "Ученик сфотографировал одноклассника в неловкой ситуации и выложил фото в общий чат класса без разрешения.\n1) Какие права одноклассника нарушены?\n2) Какие последствия возможны для ученика, который сделал фото?\n3) Как должна поступить школа?",
    answer:
      "1) Право на неприкосновенность частной жизни и на изображение: публикация фото человека требует его согласия.\n2) Требование удалить материал и извинения; при распространении — гражданско-правовая ответственность; в зависимости от содержания и последствий возможна дисциплинарная и административная ответственность.\n3) Школа проводит разбор без публичного унижения участников, информирует родителей, применяет правила внутреннего распорядка и профилактическую беседу о цифровой этике.",
    criteria:
      "1 балл — названо право на изображение/частную жизнь;\n1 балл — названа необходимость согласия;\n1 балл — предложены корректные последствия;\n1 балл — ответ про школу не сводится к наказанию, есть профилактика.",
    fgos: "Права и свободы человека, защита частной жизни, ответственность несовершеннолетних.",
  },
];

const STORE_KEY = "inf_tasks_v3";

function loadCustom() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}
function saveCustom(list) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  } catch (e) {}
}

const all = TASKS.concat(loadCustom());
let subjectFilter = "all";
let gradeFilter = "all";
let topicFilter = "all";

const esc = (s) =>
  String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

const grid = document.getElementById("task-grid");
const counter = document.getElementById("task-count");

function card(t, i) {
  return [
    '<article class="task rv">',
    "  <header>",
    '    <h3><span class="task-n">' + String(i + 1).padStart(2, "0") + "</span> " + esc(t.title) + "</h3>",
    '    <div class="meta">',
    "      <span>" + esc(t.gradeLabel || t.grade) + "</span>",
    "      <span>" + esc(t.subject || "Без предмета") + "</span>",
    "      <span>" + esc(t.topic) + "</span>",
    t.custom ? "<span>добавлено участником</span>" : "",
    "    </div>",
    "  </header>",
    '  <div class="body">',
    '    <div><p class="lbl">Сюжет</p><p>' + esc(t.plot) + "</p></div>",
    '    <div><p class="lbl">Условие</p><p style="white-space:pre-wrap">' + esc(t.condition) + "</p></div>",
    "    <details>",
    "      <summary>Эталонный ответ и критерии</summary>",
    '      <pre style="margin-top:12px;white-space:pre-wrap">' + esc(t.answer) + "</pre>",
    t.criteria ? '<p class="small" style="margin-top:12px;white-space:pre-wrap"><b>Критерии:</b> ' + esc(t.criteria) + "</p>" : "",
    '      <p class="small" style="margin-top:8px"><b>ФГОС:</b> ' + esc(t.fgos || "—") + "</p>",
    "    </details>",
    '    <div class="panel-row"><button class="btn btn-ghost btn-sm" data-copy-code>Скопировать задание</button></div>',
    "  </div>",
    "</article>",
  ].join("\n");
}

function render() {
  if (!grid) return;
  const list = all.filter(
    (t) =>
      (subjectFilter === "all" || t.subject === subjectFilter) &&
      (gradeFilter === "all" || t.grade === gradeFilter) &&
      (topicFilter === "all" || t.topic === topicFilter)
  );
  if (counter) counter.textContent = list.length + " из " + all.length + " заданий";

  if (!list.length) {
    grid.innerHTML =
      '<div class="panel"><p class="small" style="margin:0">Под выбранные фильтры заданий пока нет. Сбросьте фильтр или добавьте своё.</p></div>';
    return;
  }
  grid.innerHTML = list.map(card).join("\n");
  grid.querySelectorAll("article.task").forEach((a) => a.setAttribute("data-in", ""));
}

function initFilters() {
  document.querySelectorAll("[data-grade]").forEach((chip) => {
    chip.addEventListener("click", () => {
      gradeFilter = chip.dataset.grade;
      document.querySelectorAll("[data-grade]").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      render();
    });
  });

  const subj = document.getElementById("subject-filter");
  if (subj) {
    const seen = {};
    all.forEach((t) => (seen[t.subject] = true));
    Object.keys(seen).forEach((s) => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      subj.appendChild(opt);
    });
    subj.addEventListener("change", () => {
      subjectFilter = subj.value;
      render();
    });
  }

  const sel = document.getElementById("topic-filter");
  if (sel) {
    const topics = {};
    all.forEach((t) => (topics[t.topic] = true));
    Object.keys(topics).forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      sel.appendChild(opt);
    });
    sel.addEventListener("change", () => {
      topicFilter = sel.value;
      render();
    });
  }
}

function initCopy() {
  if (!grid) return;
  grid.addEventListener("click", async (ev) => {
    const btn = ev.target.closest("[data-copy-code]");
    if (!btn) return;
    const art = btn.closest("article");
    const title = art.querySelector("h3").textContent.trim();
    const task = all.find((t) => title.includes(t.title));
    if (!task) return;
    const text = task.condition + "\n\nЭталонный ответ:\n" + task.answer + (task.criteria ? "\n\nКритерии:\n" + task.criteria : "");
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "Скопировано";
      setTimeout(() => (btn.textContent = "Скопировать задание"), 1600);
    } catch (e) {}
  });
}

function initForm() {
  const form = document.getElementById("add-form");
  if (!form) return;
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const title = document.getElementById("f-title").value.trim();
    const subject = document.getElementById("f-subject").value;
    const topic = document.getElementById("f-topic").value.trim();
    const grade = document.getElementById("f-grade").value;
    const condition = document.getElementById("f-cond").value.trim();
    const answer = document.getElementById("f-answer").value.trim();
    const note = document.getElementById("add-note");
    if (!title || !condition || !answer) {
      if (note) {
        note.hidden = false;
        note.dataset.tone = "bad";
        note.textContent = "Заполните название, условие и эталонный ответ.";
      }
      return;
    }
    const item = {
      id: "custom-" + Date.now(),
      subject,
      title,
      topic: topic || "Без темы",
      grade,
      gradeLabel: { "5-6": "5–6 класс", "7-8": "7–8 класс", 9: "9 класс", "10-11": "10–11 класс" }[grade] || grade,
      plot: "Задание, добавленное участником мастер-класса.",
      condition,
      answer,
      criteria: "",
      fgos: "—",
      custom: true,
    };
    const custom = loadCustom();
    custom.push(item);
    saveCustom(custom);
    all.push(item);

    const sel = document.getElementById("topic-filter");
    if (sel && !Array.from(sel.options).some((o) => o.value === item.topic)) {
      const opt = document.createElement("option");
      opt.value = item.topic;
      opt.textContent = item.topic;
      sel.appendChild(opt);
    }
    render();
    form.reset();
    if (note) {
      note.hidden = false;
      note.dataset.tone = "ok";
      note.textContent = "Задание добавлено в копилку — оно сохранено в этом браузере.";
    }
  });
}

render();
initFilters();
initCopy();
initForm();
