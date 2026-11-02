/* ------------------------------------------------------------------
   Подсветка синтаксиса Python для песочницы.
   Работает как оверлей: <textarea> остаётся источником правды
   (его value читает Pyodide), а раскрашенная копия лежит под ним.
   Текст в textarea прячется только после успешной отрисовки
   (класс .hl-on), поэтому без JS поле остаётся обычным.
   ------------------------------------------------------------------ */

const KW = [
  "False", "None", "True", "and", "as", "assert", "async", "await", "break",
  "class", "continue", "def", "del", "elif", "else", "except", "finally",
  "for", "from", "global", "if", "import", "in", "is", "lambda", "match",
  "case", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while",
  "with", "yield",
];

const BI = [
  "abs", "all", "any", "bin", "bool", "chr", "dict", "divmod", "enumerate",
  "float", "format", "getattr", "hasattr", "hex", "input", "int", "isinstance",
  "len", "list", "map", "max", "min", "oct", "open", "ord", "pow", "print",
  "range", "repr", "reversed", "round", "set", "setattr", "sorted", "str",
  "sum", "tuple", "type", "zip",
];

const TOKEN = new RegExp(
  [
    "(^[ \\t]*@[\\w.]+)", //                                  1 декоратор
    "(#[^\\n]*)", //                                          2 комментарий
    "((?:[rRbBuUfF]{1,2})?(?:\\\"\\\"\\\"[\\s\\S]*?\\\"\\\"\\\"|'''[\\s\\S]*?'''|\\\"(?:[^\\\"\\\\\\\\\\n]|\\\\\\\\.)*\\\"|'(?:[^'\\\\\\\\\\n]|\\\\\\\\.)*'))", // 3 строка
    "\\b(0[xX][0-9a-fA-F]+|0[bB][01]+|\\d+\\.?\\d*(?:[eE][+-]?\\d+)?)\\b", // 4 число
    "\\b(def|class)(\\s+)([A-Za-z_\\u0400-\\u04FF][\\w\\u0400-\\u04FF]*)", // 5,6,7 объявление
    "\\b(" + KW.join("|") + ")\\b", //                        8 ключевое слово
    "\\b(" + BI.join("|") + ")\\b", //                        9 встроенная функция
  ].join("|"),
  "gm"
);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function paint(src) {
  let out = "";
  let last = 0;
  let m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(src))) {
    out += esc(src.slice(last, m.index));
    const x = esc(m[0]);
    if (m[1]) out += `<span class="t-d">${x}</span>`;
    else if (m[2]) out += `<span class="t-c">${x}</span>`;
    else if (m[3]) out += `<span class="t-s">${x}</span>`;
    else if (m[4]) out += `<span class="t-n">${x}</span>`;
    else if (m[5]) out += `<span class="t-k">${esc(m[5])}</span>${m[6]}<span class="t-f">${esc(m[7])}</span>`;
    else if (m[8]) out += `<span class="t-k">${x}</span>`;
    else if (m[9]) out += `<span class="t-b">${x}</span>`;
    else out += x;
    last = m.index + m[0].length;
  }
  out += esc(src.slice(last));
  // \n в конце, иначе последняя пустая строка «схлопывается»
  return out + "\n";
}

export function initHighlight(taId, outId) {
  const ta = document.getElementById(taId);
  const out = document.getElementById(outId);
  if (!ta || !out) return;
  const wrap = ta.closest(".code-wrap") || ta.parentNode;

  const sync = () => {
    // сдвигаем сам слой, а не его скролл: пиксель в пиксель, не зависит от высот
    out.style.transform = `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`;
  };

  const render = () => {
    out.innerHTML = paint(ta.value);
    sync();
    if (wrap) wrap.classList.add("hl-on");
  };

  ta.addEventListener("input", render);
  ta.addEventListener("scroll", sync, { passive: true });
  // значения могут менять программно (кнопки, примеры) — ловим и это
  const desc = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value");
  Object.defineProperty(ta, "value", {
    configurable: true,
    get() {
      return desc.get.call(this);
    },
    set(v) {
      desc.set.call(this, v);
      render();
    },
  });

  render();
}
