/* ============================================================
   Общие скрипты портала МУМО
   ============================================================ */
(function () {
  "use strict";

  /* ——— шапка при скролле ——— */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ——— активный пункт меню ——— */
  var path = location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
  document.querySelectorAll(".nav a").forEach(function (a) {
    var href = a.getAttribute("href") || "";
    var norm = href.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
    if (norm === path) a.classList.add("active");
  });

  /* ——— reveal on scroll ——— */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* ——— тост ——— */
  var toastEl = document.querySelector(".toast");
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2100);
  }
  window.mumoToast = toast;

  /* ——— копирование ——— */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("copy failed"));
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }
  window.mumoCopy = copyText;

  /* ——— источника значения для кнопок копирования ——— */
  function resolveCopySource(el) {
    var sel = el.getAttribute("data-copy-from");
    if (sel) {
      var node = document.querySelector(sel);
      if (node) return node.innerText || node.textContent || "";
    }
    if (el.hasAttribute("data-copy")) return el.getAttribute("data-copy");
    return "";
  }

  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-copy], [data-copy-from]");
    if (!btn) return;
    ev.preventDefault();
    var text = resolveCopySource(btn);
    if (!text.trim()) { toast("Нечего копировать — сначала сформируйте текст"); return; }
    copyText(text).then(function () {
      toast("Скопировано в буфер обмена");
      var old = btn.getAttribute("data-label") || btn.textContent;
      if (!btn.hasAttribute("data-label")) btn.setAttribute("data-label", old);
      btn.textContent = "✓ Скопировано";
      setTimeout(function () { btn.textContent = btn.getAttribute("data-label"); }, 1600);
    }).catch(function () {
      toast("Браузер запретил копирование — выделите текст вручную");
    });
  });

  window.mumoResolveCopy = resolveCopySource;
})();
