/* ============================================================
   Дебаг-лаборатория: разбор кода, мини-тест, чек-лист
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- разбор строк «сломанного» кода ---------------- */

  var codeEl = document.getElementById("broken-code");
  var errBox = document.getElementById("error-card");
  var errText = document.getElementById("err-text");

  var ANALYSIS = {
    1: { t: "Комментарий", d: "Ученик сам сформулировал проблему: «бесконечный цикл и выход за границы». Диагностический шаг уже сделан — половина решения." },
    2: { t: "Данные корректны", d: "Строка-документ задана верно. В ней действительно есть буквы «Э» (в словах «ЭВМ» и «МЭСМ»), поэтому ответ должен быть равен 2." },
    3: { t: "Инициализация индекса", d: "i = 0 — правильно: индексы в Python начинаются с нуля." },
    4: { t: "Счётчик", d: "count = 0 — правильно. Аккумулятор обнуляется до цикла, а не внутри него." },
    6: { t: "⚠️ Ошибка 2: граница условия", d: "while i &lt;= len(text) допускает i == len(text), но последний допустимый индекс — len(text) - 1. На этом шаге text[i] выбросит IndexError. Правильно: while i &lt; len(text)." },
    7: { t: "Проверка символа", d: "Сравнение с «Э» верхнего регистра — верное по условию. Не путать с «э» в слове «это»: регистр важен, и это стоит проговорить с учеником." },
    8: { t: "Инкремент счётчика", d: "count += 1 — логика подсчёта верна, но строка выполняется бесконечно, потому что индекс не меняется." },
    9: { t: "🔥 Главная ошибка", d: "В теле цикла отсутствует i += 1. Переменная-счётчик не растёт, условие всегда истинно → бесконечный цикл, программа зависает. Это и есть «забытая строка»." },
    11: { t: "Вывод", d: "Строка print никогда не выполнится: до неё управление не дойдёт, пока цикл не завершится." }
  };

  function lineAtPoint(x, y) {
    var range = null;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(x, y);
    } else if (document.caretPositionFromPoint) {
      var pos = document.caretPositionFromPoint(x, y);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true);
      }
    }
    if (!range || !codeEl.contains(range.startContainer)) return null;

    var walker = document.createTreeWalker(codeEl, NodeFilter.SHOW_TEXT, null);
    var seen = 0, node, line = 1;
    while ((node = walker.nextNode())) {
      if (node === range.startContainer) {
        return (codeEl.textContent.slice(0, offsetOf(node) + range.startOffset).match(/\n/g) || []).length + 1;
      }
      seen += node.nodeValue.length;
    }
    return line;
  }

  function offsetOf(node) {
    var off = 0, walker = document.createTreeWalker(codeEl, NodeFilter.SHOW_TEXT, null), n;
    while ((n = walker.nextNode())) {
      if (n === node) return off;
      off += n.nodeValue.length;
    }
    return off;
  }

  function showAnalysis(line) {
    var info = ANALYSIS[line];
    if (!info) {
      errText.innerHTML = "Строка " + line + ": изменение данных или пустая строка — ошибки здесь нет.";
      errBox.style.borderColor = "var(--line)";
      return;
    }
    var isMain = line === 9 || line === 6;
    errBox.style.borderColor = isMain ? "rgba(229,72,77,.5)" : "var(--line)";
    errText.innerHTML = "<b>Строка " + line + " — " + info.t + "</b><br>" + info.d;
  }

  if (codeEl) {
    codeEl.addEventListener("click", function (ev) {
      var line = lineAtPoint(ev.clientX, ev.clientY);
      if (line) showAnalysis(line);
    });
  }

  /* ---------------- мини-тест ---------------- */

  var QUESTIONS = [
    {
      text: "«Твой цикл бесконечный — добавь i += 1 после count += 1».",
      ok: false,
      why: "Это готовый ответ. Ученик получит работающий код, но не научится находить причину. Наставник так не поступает."
    },
    {
      text: "«Отлично, проверка буквы верная! Смотри: как меняется i на каждом шаге цикла? Сможет ли i стать больше длины текста, если оно не растёт?»",
      ok: true,
      why: "Идеально: сначала признание успеха, затем два вопроса, которые ведут ученика к причине (нет инкремента) и следствию (условие никогда не станет ложным)."
    },
    {
      text: "«Не мучайся с while — перепиши через for c in text, там ошибки не будет».",
      ok: false,
      why: "Подмена задачи. Ученик не разберётся со счётчиком и границами — на контрольной с while повторит ту же ошибку."
    }
  ];

  var quiz = document.getElementById("quiz");
  var quizResult = document.getElementById("quiz-result");

  if (quiz) {
    QUESTIONS.forEach(function (q, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-ghost";
      btn.style.textAlign = "left";
      btn.style.justifyContent = "flex-start";
      btn.style.whiteSpace = "normal";
      btn.style.lineHeight = "1.5";
      btn.textContent = (i + 1) + ". " + q.text;
      btn.addEventListener("click", function () {
        quizResult.style.display = "block";
        if (q.ok) {
          quizResult.className = "callout";
          quizResult.style.borderLeftColor = "var(--ok)";
          quizResult.style.background = "rgba(53,196,138,.1)";
          quizResult.innerHTML = "<b>Верно.</b> " + q.why;
          btn.style.borderColor = "var(--ok)";
        } else {
          quizResult.className = "callout bad";
          quizResult.style.borderLeftColor = "var(--red)";
          quizResult.style.background = "rgba(229,72,77,.1)";
          quizResult.innerHTML = "<b>Не лучший вариант.</b> " + q.why;
          btn.style.borderColor = "var(--red)";
        }
      });
      quiz.appendChild(btn);
    });
  }

  /* ---------------- чек-лист ---------------- */

  var CHECKS = [
    "Промпт задаёт роль: «учитель-наставник», а не «генератор решений».",
    "Есть прямой запрет: не давать готовый код.",
    "Запрет называть ошибку прямо — только наводить.",
    "Указано точное число вопросов (2–3), иначе ИИ «вывалит» лекцию.",
    "Ученику даётся следующий шаг: что попробовать самому.",
    "Учитель проверяет ответ ИИ: факты, даты, корректность подсказки."
  ];

  var list = document.getElementById("checklist");
  var counter = document.getElementById("check-count");
  var bar = document.getElementById("check-bar");

  function refreshCount() {
    var total = list.querySelectorAll('input[type="checkbox"]').length;
    var done = list.querySelectorAll('input[type="checkbox"]:checked').length;
    counter.textContent = done + " из " + total;
    bar.style.width = Math.round((done / total) * 100) + "%";
  }

  if (list) {
    CHECKS.forEach(function (text) {
      var label = document.createElement("label");
      label.style.display = "flex";
      label.style.gap = "10px";
      label.style.alignItems = "flex-start";
      label.style.fontSize = "14.5px";
      label.style.color = "var(--ink-soft)";
      label.style.cursor = "pointer";

      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.style.marginTop = "4px";
      cb.style.width = "16px";
      cb.style.height = "16px";
      cb.style.accentColor = "#3b82f6";
      cb.addEventListener("change", refreshCount);

      var span = document.createElement("span");
      span.textContent = text;

      label.appendChild(cb);
      label.appendChild(span);
      list.appendChild(label);
    });
    refreshCount();
  }
})();
