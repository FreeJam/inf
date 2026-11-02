/* ============================================================
   Тренажёр: конструктор промптов + браузерная песочница Python
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- данные ---------------- */

  var CONTEXTS = {
    yamal: {
      title: "Освоение Ямала и Северного морского пути",
      plot: "ледокол «Ямал» пробивается через торосы к порту Сабетта, а полярные станции каждый день фиксируют температуру воздуха и толщину льда.",
      facts: "Северный морской путь — главная арктическая магистраль России. Порт Сабетта на Ямале, запущенный в 2017 году, стал крупнейшим в Арктике терминалом сжиженного природного газа.",
      objects: "температуры станций, толщина льда, пройденные мили, расход топлива"
    },
    leb: {
      title: "Первые советские ЭВМ (МЭСМ, БЭСМ С. А. Лебедева)",
      plot: "сравниваются характеристики советских вычислительных машин разных поколений: от МЭСМ до БЭСМ-6.",
      facts: "МЭСМ (1951, Киев) — первая советская ЭВМ, около 50 операций в секунду. БЭСМ-6 (1968), созданная под руководством академика С. А. Лебедева, выполняла около 1 млн операций в секунду.",
      objects: "быстродействие машин, объём памяти, годы выпуска, количество экземпляров"
    },
    geo: {
      title: "Географические открытия и экспедиции России",
      plot: "обрабатывается бортовой журнал экспедиции: расстояния между точками маршрута, дни переходов, координаты стоянок.",
      facts: "В 1733–1743 годах состоялась Великая Северная экспедиция, описавшая берега Северного Ледовитого океана. В 1820–1821 годах Ф. Ф. Беллинсгаузен и М. П. Лазарев открыли Антарктиду.",
      objects: "длины переходов, широта и долгота, число дней в пути, скорость судна"
    },
    culture: {
      title: "Культурное наследие и ремёсла народов Севера",
      plot: "анализируется орнамент на традиционной одежде: подсчитываются повторяющиеся элементы узора и проверяется симметрия.",
      facts: "Ханты и ненцы — коренные народы Ямала. В орнаментах северных народов кодируются счёт, ритм и симметрия; традиционная мужская одежда — малица, сшитая из оленьих шкур.",
      objects: "элементы орнамента, длина строки узора, повторяющиеся фрагменты, число цветов"
    }
  };

  var LEVELS = {
    basic: {
      label: "Базовый",
      hint: "Базовый: ученик заполняет пропуски в готовом коде.",
      req: "Уровень БАЗОВЫЙ: дай готовый код с 3–5 пропусками, отмеченными ____ , и отдельно эталон заполнения пропусков. Ученик должен заполнить пропуски, а не писать код с нуля."
    },
    profile: {
      label: "Профильный",
      hint: "Профильный: ученик пишет код с нуля по условию.",
      req: "Уровень ПРОФИЛЬНЫЙ: ученик пишет программу с нуля по условию. Дай эталонное решение с подробными комментариями и укажи типичные ошибки школьников."
    },
    olympiad: {
      label: "Олимпиадный",
      hint: "Олимпиадный: ограничения по памяти и времени, обработка исключений.",
      req: "Уровень ОЛИМПИАДНЫЙ: добавь ограничения (n ≤ 10^5, время 1 с, память 256 МБ), обработку исключительных ситуаций (try-except), граничные случаи и второе решение с лучшей асимптотикой."
    }
  };

  var LANG_NOTES = {
    "Python 3": "Используй Python 3, только стандартную библиотеку, f-строки и понятные имена переменных.",
    "C++": "Используй C++17 (iostream, vector, без сторонних библиотек), комментарии на русском языке.",
    "Паскаль (FreePascal)": "Используй FreePascal, типы integer/real, ввод через readln, комментарии в фигурных скобках на русском языке."
  };

  /* ---------------- конструктор промпта ---------------- */

  var langSel = document.getElementById("lang");
  var topicSel = document.getElementById("topic");
  var ctxSel = document.getElementById("context");
  var out = document.getElementById("output");
  var outMeta = document.getElementById("out-meta");
  var levelHint = document.getElementById("level-hint");
  var currentLevel = "profile";

  document.querySelectorAll("#levels .chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      currentLevel = chip.getAttribute("data-level");
      document.querySelectorAll("#levels .chip").forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === chip));
      });
      levelHint.textContent = LEVELS[currentLevel].hint;
    });
  });

  function buildPrompt() {
    var lang = langSel.value;
    var topic = topicSel.value;
    var ctx = CONTEXTS[ctxSel.value];
    var lvl = LEVELS[currentLevel];

    return [
      "Ты — методист по информатике и эксперт по историческому просвещению.",
      "",
      "ТЕМА ПО ФГОС: " + topic + ".",
      "ЯЗЫК: " + lang + ". " + LANG_NOTES[lang],
      "",
      "ИСТОРИКО-КУЛЬТУРНЫЙ КОНТЕКСТ: " + ctx.title + ".",
      "Сюжет задачи: " + ctx.plot,
      "Историческая справка для условия (2–3 предложения, только проверенные факты): " + ctx.facts,
      "",
      lvl.req,
      "",
      "ТРЕБОВАНИЯ:",
      "— код с комментариями на русском языке;",
      "— входные данные (" + ctx.objects + ") задаются в самом коде или через input();",
      "— без сторонних библиотек и без «магических» чисел;",
      "— объём условия — не более 120 слов, доступный язык для школьников.",
      "",
      "ФОРМАТ ВЫВОДА (строго по разделам):",
      "1) Условие задачи;",
      "2) Входные и выходные данные с примером;",
      "3) Эталонное решение на " + lang + " с комментариями;",
      "4) Три тест-кейса (вход → выход), включая граничный;",
      "5) Методическая пометка: какой результат по ФГОС проверяет задача."
    ].join("\n");
  }

  function render() {
    var text = buildPrompt();
    out.textContent = text;
    outMeta.textContent = LEVELS[currentLevel].label + " · " + langSel.value + " · " + text.length + " симв.";
    return text;
  }

  document.getElementById("gen").addEventListener("click", function () {
    render();
    if (window.mumoToast) window.mumoToast("Промпт собран — можно копировать");
    out.scrollTop = 0;
  });

  document.getElementById("reset").addEventListener("click", function () {
    langSel.selectedIndex = 0;
    topicSel.selectedIndex = 0;
    ctxSel.selectedIndex = 0;
    currentLevel = "profile";
    document.querySelectorAll("#levels .chip").forEach(function (c) {
      c.setAttribute("aria-pressed", String(c.getAttribute("data-level") === "profile"));
    });
    levelHint.textContent = LEVELS.profile.hint;
    out.textContent = "// Нажмите «Сгенерировать промпт», чтобы собрать запрос\n// из выбранных параметров.";
    outMeta.textContent = "—";
  });

  [langSel, topicSel, ctxSel].forEach(function (el) {
    el.addEventListener("change", function () { if (outMeta.textContent !== "—") render(); });
  });

  /* ---------------- песочница Python (Pyodide) ---------------- */

  var PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
  var runtimePromise = null;
  var consoleEl = document.getElementById("console");
  var stateEl = document.getElementById("console-state");
  var runBtn = document.getElementById("run");
  var codeEl = document.getElementById("code");

  function setState(text) { if (stateEl) stateEl.textContent = "консоль · " + text; }

  function log(text, cls) {
    var span = document.createElement("span");
    if (cls) span.className = cls;
    span.textContent = text;
    consoleEl.appendChild(span);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  function loadRuntime() {
    if (runtimePromise) return runtimePromise;
    runtimePromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = PYODIDE_URL;
      s.onload = function () {
        if (typeof window.loadPyodide !== "function") {
          reject(new Error("Pyodide не загрузился"));
          return;
        }
        window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/" })
          .then(resolve)
          .catch(reject);
      };
      s.onerror = function () { reject(new Error("Нет доступа к CDN Pyodide")); };
      document.head.appendChild(s);
    });
    return runtimePromise;
  }

  document.getElementById("clear").addEventListener("click", function () {
    consoleEl.innerHTML = '<span class="dim">[SYSTEM] Консоль очищена.</span>';
    setState("ожидание");
  });

  runBtn.addEventListener("click", function () {
    var code = codeEl.value;
    if (!code.trim()) { log("\n[SYSTEM] Пустой код — нечего выполнять.\n", "err"); return; }

    runBtn.disabled = true;
    consoleEl.innerHTML = "";
    setState("загрузка окружения…");

    loadRuntime().then(function (py) {
      setState("выполняется…");
      py.setStdout({ batched: function (s) { log(s + "\n"); } });
      py.setStderr({ batched: function (s) { log(s + "\n", "err"); } });
      return py.runPythonAsync(code);
    }).then(function () {
      setState("готово · exit 0");
      log("[SYSTEM] Выполнение завершено.\n", "dim");
    }).catch(function (err) {
      var msg = String(err && err.message ? err.message : err);
      if (msg.indexOf("Traceback") === -1) {
        log("[SYSTEM] Ошибка окружения: " + msg + "\n", "err");
        log("Проверьте подключение к интернету — Pyodide подгружается с CDN.\n", "dim");
      } else {
        log(msg + "\n", "err");
        log("[SYSTEM] Код завершился с ошибкой — как раз такой случай разбираем в дебаг-лаборатории.\n", "dim");
      }
      setState("ошибка");
    }).finally(function () {
      runBtn.disabled = false;
    });
  });

  /* автоподстановка промпта при первом заходе с якорем #levels */
  if (location.hash === "#levels") render();
})();
