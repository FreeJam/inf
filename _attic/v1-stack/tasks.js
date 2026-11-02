/* ============================================================
   Копилка задач МУМО: данные, фильтры, добавление задач
   ============================================================ */
(function () {
  "use strict";

  var TASKS = [
    {
      id: "ledokol",
      emoji: "❄️",
      title: "Маршрут ледокола «Ямал»",
      topic: "Алгоритм с ветвлением (if-else)",
      grade: "7-8",
      gradeLabel: "7–8 класс",
      plot: "Ледокол пробивает торосы разной толщины — от режима хода зависит безопасность каравана.",
      condition: "Программа принимает толщину льда h (м). Если h ≤ 1,5 — «Обычный ход (15 узлов)». Если 1,5 < h ≤ 3,0 — «Усиленный ход (7 узлов)». Если h > 3,0 — «Запрос поддержки второго ледокола».",
      code: "h = float(input(\"Введите толщину льда (м): \"))\nif h <= 1.5:\n    print(\"Обычный ход (15 узлов)\")\nelif h <= 3.0:\n    print(\"Усиленный ход (7 узлов)\")\nelse:\n    print(\"Запрос поддержки второго ледокола\")",
      tests: [["0.8", "Обычный ход (15 узлов)"], ["2.4", "Усиленный ход (7 узлов)"], ["3.5", "Запрос поддержки второго ледокола"]],
      fgos: "Условный оператор, вложенность ветвей, порядок проверки условий."
    },
    {
      id: "besm",
      emoji: "🏛️",
      title: "Расфрахтовка БЭСМ-6",
      topic: "Массивы и статистика",
      grade: "9",
      gradeLabel: "9–11 класс",
      plot: "Вычисление прироста быстродействия между поколениями советских ЭВМ С. А. Лебедева.",
      condition: "Дан массив производительности машин (МЭСМ, БЭСМ-1, БЭСМ-2, БЭСМ-6) в тысячах операций в секунду. Найдите средний прирост мощности между поколениями.",
      code: "# Данные: МЭСМ, БЭСМ-1, БЭСМ-2, БЭСМ-6\nperformance = [3, 10, 100, 1000]  # тыс. операций/сек\n\ngains = [performance[i] / performance[i - 1] for i in range(1, len(performance))]\nfor i, g in enumerate(gains, start=1):\n    print(f\"МЭСМ->{i}: прирост {g:.1f}x\")\n\nprint(f\"Средний прирост: {sum(gains) / len(gains):.2f}x\")",
      tests: [["[3, 10, 100, 1000]", "Средний прирост: 7.78x"], ["[3, 10]", "Средний прирост: 3.33x"]],
      fgos: "Обработка массива, срезы, накопление произведения/отношения, форматирование вывода."
    },
    {
      id: "station",
      emoji: "🌡️",
      title: "Полярная станция: дни ниже нормы",
      topic: "Циклы и условия",
      grade: "7-8",
      gradeLabel: "7–8 класс",
      plot: "Метеоролог станции на Ямале считает, сколько дней температура опускалась ниже −30 °C.",
      condition: "Дан список температур за месяц. Определите количество дней холоднее −30 °C и выведите их число.",
      code: "temperatures = [-31, -28, -35, -12, -40, -29, -33]\n\ncold_days = 0\nfor t in temperatures:\n    if t < -30:\n        cold_days += 1\n\nprint(f\"Дней холоднее -30 °C: {cold_days}\")",
      tests: [["[-31, -28, -35, -12, -40, -29, -33]", "Дней холоднее -30 °C: 4"], ["[-10, -20]", "Дней холоднее -30 °C: 0"]],
      fgos: "Перебор элементов, счётчик, строгое неравенство, граничное значение."
    },
    {
      id: "ornament",
      emoji: "🧵",
      title: "Орнамент народов ханты",
      topic: "Обработка символьных строк",
      grade: "9",
      gradeLabel: "9 класс",
      plot: "В орнаментах северных народов повторяющийся мотив кодирует ритм и счёт.",
      condition: "Дана строка узора и мотив (подстрока). Определите, сколько раз мотив встречается в узоре без перекрытия, и выведите длину узора.",
      code: "motif = \"◇◆\"\nrow = \"◇◆◇◆◇◆◇◆◇◆\"\n\nrepeats = row.count(motif)\nprint(f\"Мотив «{motif}» встречается {repeats} раз\")\nprint(f\"Длина узора: {len(row)} символов\")",
      tests: [["«◇◆» x5", "Мотив «◇◆» встречается 5 раз"], ["«◇◆◇◆◇◆◇◆◇◆»", "Длина узора: 10 символов"]],
      fgos: "Методы строк, подсчёт вхождений, работа с Unicode-символами."
    },
    {
      id: "bellinshausen",
      emoji: "🧭",
      title: "Дневной переход экспедиции",
      topic: "Циклы и накопление суммы",
      grade: "7-8",
      gradeLabel: "7–8 класс",
      plot: "Бортовой журнал экспедиции: расстояния дневных переходов в милях.",
      condition: "Дан список расстояний переходов. Выведите суммарный путь и среднее расстояние в день с одним знаком после запятой.",
      code: "distances = [12, 18, 25, 9, 31, 14]\n\ntotal = sum(distances)\navg = total / len(distances)\n\nprint(f\"Всего: {total} миль, в среднем {avg:.1f} мили в день\")",
      tests: [["[12, 18, 25, 9, 31, 14]", "Всего: 109 миль, в среднем 18.2 мили в день"], ["[10]", "Всего: 10 миль, в среднем 10.0 мили в день"]],
      fgos: "Сумма элементов, среднее арифметическое, деление на ноль, форматирование float."
    },
    {
      id: "mesm-faults",
      emoji: "🕹️",
      title: "Журнал сбоев МЭСМ",
      topic: "Словари",
      grade: "10-11",
      gradeLabel: "10–11 класс",
      plot: "Инженер ведёт журнал отказов первой советской ЭВМ по месяцам 1951 года.",
      condition: "Дан словарь «месяц → число сбоев». Найдите месяц с максимальным числом сбоев и выведите его вместе со значением.",
      code: "faults = {\"1951-01\": 3, \"1951-02\": 5, \"1951-03\": 2}\n\nworst = max(faults, key=faults.get)\nprint(f\"Больше всего сбоев — {worst}: {faults[worst]}\")\n\nprint(f\"Всего зафиксировано сбоев: {sum(faults.values())}\")",
      tests: [["{01:3, 02:5, 03:2}", "Больше всего сбоев — 1951-02: 5"], ["{}", "Всего зафиксировано сбоев: 0"]],
      fgos: "Словари, перебор ключей, аргумент key, граничные случаи (пустой словарь)."
    }
  ];

  /* пользовательские задачи из localStorage */
  var STORE_KEY = "mumo_tasks_v1";
  function loadCustom() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function saveCustom(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) {}
  }

  var all = TASKS.concat(loadCustom());
  var grid = document.getElementById("task-grid");
  var gradeFilter = "all";
  var topicFilter = "all";

  function esc(s) {
    return String(s).replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  }

  function render() {
    if (!grid) return;
    var list = all.filter(function (t) {
      var okGrade = gradeFilter === "all" || t.grade === gradeFilter;
      var okTopic = topicFilter === "all" || t.topic === topicFilter;
      return okGrade && okTopic;
    });

    document.getElementById("task-count").textContent = list.length + " из " + all.length + " задач";

    if (!list.length) {
      grid.innerHTML = '<div class="panel"><p class="muted" style="margin:0">Под выбранные фильтры задач пока нет. Сбросьте фильтр или добавьте свою задачу.</p></div>';
      return;
    }

    grid.innerHTML = list.map(function (t, i) {
      var tests = (t.tests || []).map(function (pair) {
        return "  " + pair[0] + "  →  " + pair[1];
      }).join("\n");
      return [
        '<article class="task" data-id="' + esc(t.id) + '">',
        '  <div class="task-top">',
        '    <div class="task-tags">',
        '      <span class="tag">' + esc(t.topic) + '</span>',
        '      <span class="tag red">' + esc(t.gradeLabel || t.grade) + '</span>',
        t.custom ? '<span class="tag gold">добавлено МУМО</span>' : '',
        '    </div>',
        '    <h3>' + (t.emoji || "📌") + " " + esc(t.title) + '</h3>',
        '    <p class="task-desc">' + esc(t.plot) + '</p>',
        '  </div>',
        '  <div class="task-body">',
        '    <p class="small" style="color:var(--ink-soft)"><b>Условие.</b> ' + esc(t.condition) + '</p>',
        '  </div>',
        '  <div class="task-solution">',
        '    <pre class="code">' + esc(t.code) + '</pre>',
        tests ? '    <div class="small muted" style="font-family:var(--font-mono);white-space:pre-wrap;margin-bottom:10px">Тесты:\n' + esc(tests) + '</div>' : '',
        '    <p class="small muted" style="margin:0"><b>ФГОС:</b> ' + esc(t.fgos || "—") + '</p>',
        '  </div>',
        '  <div class="task-foot">',
        '    <span>' + esc(t.gradeLabel || t.grade) + ' · ' + esc(t.topic) + '</span>',
        '    <span class="flex" style="gap:8px">',
        '      <button class="btn-mini js-toggle">▸ Решение</button>',
        '      <button class="btn-mini js-copy">📋 Код</button>',
        '    </span>',
        '  </div>',
        '</article>'
      ].join("\n");
    }).join("\n");
  }

  if (grid) {
    grid.addEventListener("click", function (ev) {
      var card = ev.target.closest(".task");
      if (!card) return;
      var id = card.getAttribute("data-id");
      var task = all.filter(function (t) { return String(t.id) === String(id); })[0];

      if (ev.target.closest(".js-toggle")) {
        card.classList.toggle("open");
        ev.target.textContent = card.classList.contains("open") ? "▾ Скрыть" : "▸ Решение";
        return;
      }
      if (ev.target.closest(".js-copy") && task) {
        window.mumoCopy(task.code).then(function () {
          window.mumoToast("Код задачи скопирован");
        }).catch(function () { window.mumoToast("Не удалось скопировать"); });
      }
    });
  }

  /* фильтры */
  document.querySelectorAll("[data-grade]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      gradeFilter = chip.getAttribute("data-grade");
      document.querySelectorAll("[data-grade]").forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === chip));
      });
      render();
    });
  });

  var topicSelect = document.getElementById("topic-filter");
  if (topicSelect) {
    var topics = {};
    all.forEach(function (t) { topics[t.topic] = true; });
    Object.keys(topics).forEach(function (t) {
      var opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      topicSelect.appendChild(opt);
    });
    topicSelect.addEventListener("change", function () {
      topicFilter = topicSelect.value;
      render();
    });
  }

  /* добавление задачи */
  var form = document.getElementById("add-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var title = document.getElementById("f-title").value.trim();
      var topic = document.getElementById("f-topic").value.trim();
      var grade = document.getElementById("f-grade").value;
      var condition = document.getElementById("f-cond").value.trim();
      var code = document.getElementById("f-code").value.trim();
      if (!title || !condition || !code) {
        window.mumoToast("Заполните название, условие и код решения");
        return;
      }
      var item = {
        id: "custom-" + Date.now(),
        emoji: "📌",
        title: title,
        topic: topic || "Без темы",
        grade: grade,
        gradeLabel: { "7-8": "7–8 класс", "9": "9 класс", "10-11": "10–11 класс" }[grade] || grade,
        plot: "Задача, добавленная участником площадки МУМО.",
        condition: condition,
        code: code,
        tests: [],
        fgos: "—",
        custom: true
      };
      var custom = loadCustom();
      custom.push(item);
      saveCustom(custom);
      all.push(item);

      if (topicSelect && !Array.prototype.some.call(topicSelect.options, function (o) { return o.value === item.topic; })) {
        var opt = document.createElement("option");
        opt.value = item.topic;
        opt.textContent = item.topic;
        topicSelect.appendChild(opt);
      }

      render();
      form.reset();
      window.mumoToast("Задача добавлена в копилку (сохранено в браузере)");
    });
  }

  render();
})();
