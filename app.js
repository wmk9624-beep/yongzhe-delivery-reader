const $app = document.querySelector("#app");

const icons = {
  back: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>`,
  search: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>`,
  book: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"></path></svg>`,
  grid: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  read: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v14"></path><path d="M4 19.5V5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 1 4 19.5Z"></path><path d="M20 19.5V5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5A2.5 2.5 0 0 0 20 19.5Z"></path></svg>`,
  user: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>`,
  play: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>`,
  pause: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14"></path><path d="M16 5v14"></path></svg>`,
  stop: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10"></rect></svg>`,
  headphones: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14a8 8 0 0 1 16 0"></path><path d="M4 14v4a2 2 0 0 0 2 2h2v-8H6a2 2 0 0 0-2 2Z"></path><path d="M20 14v4a2 2 0 0 1-2 2h-2v-8h2a2 2 0 0 1 2 2Z"></path></svg>`,
  plus: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>`,
  menu: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>`,
  settings: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.24.6.84 1 1.55 1H21a2 2 0 1 1 0 4h-.08a1.7 1.7 0 0 0-1.52 1Z"></path></svg>`,
  bookmark: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"></path></svg>`
};

const state = {
  book: null,
  view: "home",
  query: "",
  readingChapterId: 1,
  settingsOpen: false,
  progress: {
    chapterId: 1,
    ratio: 0
  },
  reader: {
    fontSize: 18,
    theme: "paper",
    audioRate: 1
  },
  audio: {
    active: false,
    paused: false,
    chapterId: null
  }
};

const STORAGE_KEYS = {
  progress: "brave-delivery-progress",
  reader: "brave-delivery-reader",
  shelf: "brave-delivery-shelf"
};

let speechQueue = [];
let speechIndex = 0;
let activeUtterance = null;
let cachedVoices = [];

init();

if (audioSupported()) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    cachedVoices = window.speechSynthesis.getVoices();
  });
  window.addEventListener("pagehide", () => stopAudio(false));
}

async function init() {
  loadLocalState();

  try {
    const response = await fetch("data/book.json");
    if (!response.ok) {
      throw new Error("book data not found");
    }
    state.book = await response.json();
    state.readingChapterId = state.progress.chapterId || 1;
    render();
  } catch (error) {
    $app.innerHTML = `
      <section class="screen screen-loading">
        <div class="brand-mark" aria-hidden="true"><span></span></div>
        <p>書稿載入失敗</p>
      </section>
    `;
  }
}

function loadLocalState() {
  const storedProgress = readStorage(STORAGE_KEYS.progress);
  const storedReader = readStorage(STORAGE_KEYS.reader);

  if (storedProgress) {
    state.progress = {
      chapterId: Number(storedProgress.chapterId) || 1,
      ratio: Number(storedProgress.ratio) || 0
    };
  }

  if (storedReader) {
    state.reader = {
      fontSize: clamp(Number(storedReader.fontSize) || 18, 15, 24),
      theme: storedReader.theme || "paper",
      audioRate: clamp(Number(storedReader.audioRate) || 1, 0.7, 1.4)
    };
  }
}

function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function render() {
  if (!state.book) return;

  $app.className = `app-shell${state.view === "reader" ? " reader-open" : ""}`;
  $app.style.setProperty("--reader-font-size", `${state.reader.fontSize}px`);
  $app.innerHTML = buildView();
  bindEvents();

  if (state.view === "reader") {
    restoreReaderScroll();
  }
}

function buildView() {
  if (state.view === "reader") {
    return readerView();
  }

  const titleMap = {
    home: ["勇者書架", "今日繼續派送"],
    shelf: ["我的書架", "1 本收藏"],
    catalog: ["章節目錄", `${state.book.totalChapters} 章完整收錄`],
    profile: ["我的", "閱讀設定與紀錄"]
  };
  const [title, subtitle] = titleMap[state.view] || titleMap.home;

  return `
    <section class="screen">
      ${topbar(title, subtitle)}
      <div class="content">
        ${state.view === "home" ? homeView() : ""}
        ${state.view === "shelf" ? shelfView() : ""}
        ${state.view === "catalog" ? catalogView() : ""}
        ${state.view === "profile" ? profileView() : ""}
      </div>
      ${tabbar()}
    </section>
    ${toastHost()}
  `;
}

function topbar(title, subtitle) {
  return `
    <header class="topbar">
      <button class="icon-button" type="button" data-action="home" aria-label="返回主頁">${icons.back}</button>
      <div class="topbar-title">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(subtitle)}</span>
      </div>
      <button class="icon-button" type="button" data-action="catalog" aria-label="搜尋章節">${icons.search}</button>
    </header>
  `;
}

function homeView() {
  const book = state.book;
  const current = currentChapter();
  const percent = progressPercent();
  const chapterPreview = book.chapters.slice(0, 3).map((chapter) => chapterRow(chapter)).join("");

  return `
    <section class="hero">
      <div class="book-hero">
        <img class="cover" src="assets/cover.png" alt="《勇者派送中》書封">
        <div>
          <h1 class="book-title">${escapeHtml(book.title)}</h1>
          <p class="author">${escapeHtml(book.author)}</p>
          <div class="tag-row">
            ${book.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><strong>${formatWan(book.totalWords)}</strong><span>總字數</span></div>
        <div class="stat"><strong>${book.totalChapters}</strong><span>章節</span></div>
        <div class="stat"><strong>${book.status}</strong><span>狀態</span></div>
      </div>
    </section>

    <section class="panel">
      <div class="progress-block">
        <div class="progress-meta">
          <span>${escapeHtml(current.title)}</span>
          <strong>${percent}%</strong>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
      </div>
      <div class="actions">
        <button class="primary-button" type="button" data-action="continue">${icons.play}<span>繼續閱讀</span></button>
        <button class="secondary-button" type="button" data-action="listen-current" aria-label="開始聽書">${icons.headphones}</button>
        <button class="secondary-button" type="button" data-action="shelf-add" aria-label="加入書架">${icons.bookmark}</button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>作品簡介</h2>
        <button class="text-link" type="button" data-action="catalog">全部章節</button>
      </div>
      <p class="synopsis">${escapeHtml(book.synopsis)}</p>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>章節預覽</h2>
        <button class="text-link" type="button" data-action="catalog">目錄</button>
      </div>
      <div class="chapter-list">${chapterPreview}</div>
    </section>
  `;
}

function shelfView() {
  const current = currentChapter();
  return `
    <article class="shelf-card">
      <img src="assets/cover.png" alt="《勇者派送中》書封">
      <div>
        <h2>${escapeHtml(state.book.title)}</h2>
        <p>${escapeHtml(current.title)} · 已讀 ${progressPercent()}%</p>
        <button class="primary-button wide-button" type="button" data-action="continue">${icons.play}<span>繼續閱讀</span></button>
        <button class="secondary-button wide-button" type="button" data-action="listen-current">${icons.headphones}<span>開始聽書</span></button>
      </div>
    </article>

    <section class="panel">
      <div class="panel-header">
        <h2>最近閱讀</h2>
        <button class="text-link" type="button" data-action="catalog">查看目錄</button>
      </div>
      <div class="chapter-list">
        ${chapterRow(current)}
        ${chapterRow(nextChapter(current.id) || state.book.chapters[0])}
      </div>
    </section>
  `;
}

function catalogView() {
  const chapters = filteredChapters();
  return `
    <div class="search-box">
      <input type="search" placeholder="搜尋章名，例如：聖印、魔王、五星" value="${escapeAttr(state.query)}" data-input="chapter-search" aria-label="搜尋章節">
    </div>
    <div class="chapter-list">
      ${chapters.length ? chapters.map((chapter) => chapterRow(chapter)).join("") : `<p class="empty">沒有找到相關章節</p>`}
    </div>
  `;
}

function profileView() {
  const current = currentChapter();
  return `
    <div class="profile-grid">
      <div class="profile-cell"><strong>${progressPercent()}%</strong><span>閱讀進度</span></div>
      <div class="profile-cell"><strong>${state.reader.fontSize}px</strong><span>字體大小</span></div>
      <div class="profile-cell"><strong>${state.book.totalChapters}</strong><span>已收錄章節</span></div>
      <div class="profile-cell"><strong>${formatWan(state.book.totalWords)}</strong><span>總字數</span></div>
    </div>
    <section class="panel">
      <div class="panel-header">
        <h2>目前閱讀</h2>
        <button class="text-link" type="button" data-action="continue">打開</button>
      </div>
      <div class="chapter-list">${chapterRow(current)}</div>
    </section>
    <section class="panel">
      <div class="panel-header">
        <h2>閱讀偏好</h2>
      </div>
      <div class="setting-row">
        <span>背景</span>
        <div class="segmented">
          ${themeButton("paper", "紙本")}
          ${themeButton("green", "護眼")}
          ${themeButton("dark", "夜間")}
        </div>
      </div>
      <div class="setting-row">
        <span>字體</span>
        <div class="stepper">
          <button type="button" data-action="font-minus">A-</button>
          <button type="button" data-action="font-plus">A+</button>
        </div>
      </div>
      <div class="setting-row">
        <span>語速</span>
        <div class="speed-control">
          <button type="button" data-action="audio-rate-minus">慢</button>
          <strong>${state.reader.audioRate.toFixed(1)}x</strong>
          <button type="button" data-action="audio-rate-plus">快</button>
        </div>
      </div>
    </section>
  `;
}

function readerView() {
  const chapter = currentReaderChapter();
  const paragraphs = chapter.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
  const prev = previousChapter(chapter.id);
  const next = nextChapter(chapter.id);

  return `
    <section class="screen reader-screen ${readerThemeClass()}">
      <header class="topbar reader-topbar">
        <button class="icon-button" type="button" data-action="exit-reader" aria-label="返回">${icons.back}</button>
        <div class="topbar-title">
          <strong>${escapeHtml(chapter.numberText)}</strong>
          <span>${escapeHtml(shortChapterTitle(chapter.title))}</span>
        </div>
        <button class="icon-button" type="button" data-action="toggle-settings" aria-label="閱讀設定">${icons.settings}</button>
      </header>
      <article class="reader-content" data-reader-content>
        <h1>${escapeHtml(chapter.title)}</h1>
        ${paragraphs}
        <div class="reader-actions">
          <button type="button" data-chapter="${prev ? prev.id : ""}" ${prev ? "" : "disabled"}>上一章</button>
          <button type="button" data-chapter="${next ? next.id : ""}" ${next ? "" : "disabled"}>下一章</button>
        </div>
      </article>
      ${audioDock(chapter)}
      ${settingsSheet()}
    </section>
    ${toastHost()}
  `;
}

function audioDock(chapter) {
  const supported = audioSupported();
  const active = state.audio.active && state.audio.chapterId === chapter.id;
  const paused = active && state.audio.paused;
  const mainAction = active ? (paused ? "audio-resume" : "audio-pause") : "audio-play";
  const mainIcon = active && !paused ? icons.pause : icons.headphones;
  const mainLabel = !supported ? "不支援聽書" : active ? (paused ? "繼續播放" : "暫停") : "朗讀本章";
  const status = !supported ? "瀏覽器未支援" : active ? (paused ? "已暫停" : "朗讀中") : "聽書模式";

  return `
    <div class="audio-dock ${active ? "active" : ""}">
      <button class="audio-main" type="button" data-action="${mainAction}" ${supported ? "" : "disabled"} aria-label="${mainLabel}">
        ${mainIcon}<span>${mainLabel}</span>
      </button>
      <div class="audio-meta">
        <strong>${status}</strong>
        <span>${escapeHtml(shortChapterTitle(chapter.title))} · ${state.reader.audioRate.toFixed(1)}x</span>
      </div>
      <button class="audio-stop" type="button" data-action="audio-stop" ${active ? "" : "disabled"} aria-label="停止朗讀">${icons.stop}</button>
    </div>
  `;
}

function settingsSheet() {
  return `
    <aside class="settings-sheet ${state.settingsOpen ? "open" : ""}">
      <div class="setting-row">
        <span>背景</span>
        <div class="segmented">
          ${themeButton("paper", "紙本")}
          ${themeButton("green", "護眼")}
          ${themeButton("dark", "夜間")}
        </div>
      </div>
      <div class="setting-row">
        <span>字體</span>
        <div class="stepper">
          <button type="button" data-action="font-minus">A-</button>
          <button type="button" data-action="font-plus">A+</button>
        </div>
      </div>
      <div class="setting-row">
        <span>語速</span>
        <div class="speed-control">
          <button type="button" data-action="audio-rate-minus">慢</button>
          <strong>${state.reader.audioRate.toFixed(1)}x</strong>
          <button type="button" data-action="audio-rate-plus">快</button>
        </div>
      </div>
      <button class="primary-button wide-button" type="button" data-action="toggle-settings">完成</button>
    </aside>
  `;
}

function tabbar() {
  const items = [
    ["shelf", "書架", icons.book],
    ["catalog", "分類", icons.grid],
    ["home", "閱讀", icons.read],
    ["profile", "我的", icons.user]
  ];

  return `
    <nav class="tabbar" aria-label="主要導覽">
      ${items.map(([view, label, icon]) => `
        <button class="tab-button ${state.view === view ? "active" : ""}" type="button" data-view="${view}" aria-label="${label}">
          ${icon}<span>${label}</span>
        </button>
      `).join("")}
    </nav>
  `;
}

function chapterRow(chapter) {
  const active = chapter.id === state.progress.chapterId ? " active" : "";
  return `
    <button class="chapter-row${active}" type="button" data-chapter="${chapter.id}">
      <span>
        <strong>${escapeHtml(chapter.title)}</strong>
        <span>${formatWords(chapter.wordCount)}</span>
      </span>
      <span class="badge">${chapter.id}/${state.book.totalChapters}</span>
    </button>
  `;
}

function themeButton(theme, label) {
  return `<button type="button" class="${state.reader.theme === theme ? "active" : ""}" data-theme="${theme}">${label}</button>`;
}

function toastHost() {
  return `<div data-toast-root></div>`;
}

function bindEvents() {
  $app.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      state.settingsOpen = false;
      render();
    });
  });

  $app.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button.dataset.action));
  });

  $app.querySelectorAll("[data-chapter]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.chapter);
      if (id) openChapter(id);
    });
  });

  const search = $app.querySelector("[data-input='chapter-search']");
  if (search) {
    search.addEventListener("input", () => {
      state.query = search.value.trim();
      const list = $app.querySelector(".chapter-list");
      const chapters = filteredChapters();
      list.innerHTML = chapters.length
        ? chapters.map((chapter) => chapterRow(chapter)).join("")
        : `<p class="empty">沒有找到相關章節</p>`;
      list.querySelectorAll("[data-chapter]").forEach((button) => {
        button.addEventListener("click", () => openChapter(Number(button.dataset.chapter)));
      });
    });
  }

  $app.querySelectorAll("[data-theme]").forEach((button) => {
    button.addEventListener("click", () => {
      state.reader.theme = button.dataset.theme;
      persistReader();
      render();
    });
  });

  const reader = $app.querySelector("[data-reader-content]");
  if (reader) {
    reader.addEventListener("scroll", throttle(() => saveReaderProgress(reader), 280));
  }
}

function handleAction(action) {
  switch (action) {
    case "home":
      stopAudio(false);
      state.view = "home";
      state.settingsOpen = false;
      render();
      break;
    case "catalog":
      stopAudio(false);
      state.view = "catalog";
      state.settingsOpen = false;
      render();
      break;
    case "continue":
      openChapter(state.progress.chapterId || 1, true);
      break;
    case "listen-current":
      openChapter(state.progress.chapterId || 1, true);
      startAudio(state.readingChapterId);
      break;
    case "shelf-add":
      writeStorage(STORAGE_KEYS.shelf, { added: true, at: Date.now() });
      showToast("已加入書架");
      break;
    case "exit-reader":
      stopAudio(false);
      state.view = "home";
      state.settingsOpen = false;
      render();
      break;
    case "audio-play":
      startAudio(state.readingChapterId);
      break;
    case "audio-pause":
      pauseAudio();
      break;
    case "audio-resume":
      resumeAudio();
      break;
    case "audio-stop":
      stopAudio();
      break;
    case "toggle-settings":
      state.settingsOpen = !state.settingsOpen;
      render();
      break;
    case "font-minus":
      state.reader.fontSize = clamp(state.reader.fontSize - 1, 15, 24);
      persistReader();
      render();
      break;
    case "font-plus":
      state.reader.fontSize = clamp(state.reader.fontSize + 1, 15, 24);
      persistReader();
      render();
      break;
    case "audio-rate-minus":
      state.reader.audioRate = clamp(Number((state.reader.audioRate - 0.1).toFixed(1)), 0.7, 1.4);
      persistReader();
      render();
      break;
    case "audio-rate-plus":
      state.reader.audioRate = clamp(Number((state.reader.audioRate + 0.1).toFixed(1)), 0.7, 1.4);
      persistReader();
      render();
      break;
  }
}

function openChapter(id, restore = false) {
  const chapter = state.book.chapters.find((item) => item.id === id);
  if (!chapter) return;

  if (state.audio.active && state.audio.chapterId !== id) {
    stopAudio(false);
  }

  state.readingChapterId = id;
  state.view = "reader";
  state.settingsOpen = false;

  if (!restore || state.progress.chapterId !== id) {
    state.progress = { chapterId: id, ratio: 0 };
    persistProgress();
  }

  render();
}

function audioSupported() {
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function startAudio(chapterId) {
  if (!audioSupported()) {
    showToast("這個瀏覽器暫時不支援聽書");
    return;
  }

  const chapter = state.book.chapters.find((item) => item.id === chapterId);
  if (!chapter) return;

  stopAudio(false);
  speechQueue = buildSpeechQueue(chapter);
  speechIndex = 0;
  state.audio = {
    active: true,
    paused: false,
    chapterId: chapter.id
  };

  speakNextChunk();
  render();
}

function pauseAudio() {
  if (!state.audio.active || !audioSupported()) return;
  window.speechSynthesis.pause();
  state.audio.paused = true;
  render();
}

function resumeAudio() {
  if (!state.audio.active || !audioSupported()) return;
  window.speechSynthesis.resume();
  state.audio.paused = false;
  render();
}

function stopAudio(shouldRender = true) {
  if (audioSupported()) {
    window.speechSynthesis.cancel();
  }

  speechQueue = [];
  speechIndex = 0;
  activeUtterance = null;
  state.audio = {
    active: false,
    paused: false,
    chapterId: null
  };

  if (shouldRender) {
    render();
  }
}

function finishAudio() {
  speechQueue = [];
  speechIndex = 0;
  activeUtterance = null;
  state.audio = {
    active: false,
    paused: false,
    chapterId: null
  };
  render();
  showToast("本章朗讀完畢");
}

function speakNextChunk() {
  if (!state.audio.active || !audioSupported()) return;

  if (speechIndex >= speechQueue.length) {
    finishAudio();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(speechQueue[speechIndex]);
  const voice = preferredVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "zh-Hant";
  }
  utterance.rate = state.reader.audioRate;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onend = () => {
    if (!state.audio.active) return;
    speechIndex += 1;
    speakNextChunk();
  };

  utterance.onerror = (event) => {
    if (!state.audio.active || event.error === "interrupted" || event.error === "canceled") return;
    stopAudio(false);
    render();
    showToast("朗讀被瀏覽器中止");
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function buildSpeechQueue(chapter) {
  const text = `${chapter.title}\n${chapter.content}`
    .replace(/\r/g, "")
    .replace(/\n+/g, "。")
    .replace(/\s+/g, " ")
    .trim();
  const sentences = text.match(/[^。！？!?；;：:]+[。！？!?；;：:]?/g) || [text];
  const chunks = [];
  let current = "";

  sentences.forEach((sentence) => {
    const clean = sentence.trim();
    if (!clean) return;

    if (clean.length > 170) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      for (let index = 0; index < clean.length; index += 150) {
        chunks.push(clean.slice(index, index + 150));
      }
      return;
    }

    if ((current + clean).length > 170) {
      chunks.push(current);
      current = clean;
    } else {
      current += clean;
    }
  });

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function preferredVoice() {
  if (!audioSupported()) return null;

  cachedVoices = window.speechSynthesis.getVoices();
  return cachedVoices.find((voice) => /^zh-(HK|TW|MO)$/i.test(voice.lang))
    || cachedVoices.find((voice) => /^zh-Hant/i.test(voice.lang))
    || cachedVoices.find((voice) => /^zh/i.test(voice.lang))
    || null;
}

function currentChapter() {
  return state.book.chapters.find((chapter) => chapter.id === state.progress.chapterId) || state.book.chapters[0];
}

function currentReaderChapter() {
  return state.book.chapters.find((chapter) => chapter.id === state.readingChapterId) || currentChapter();
}

function previousChapter(id) {
  return state.book.chapters.find((chapter) => chapter.id === id - 1);
}

function nextChapter(id) {
  return state.book.chapters.find((chapter) => chapter.id === id + 1);
}

function filteredChapters() {
  if (!state.query) return state.book.chapters;
  const query = state.query.toLowerCase();
  return state.book.chapters.filter((chapter) => chapter.title.toLowerCase().includes(query) || chapter.content.toLowerCase().includes(query));
}

function saveReaderProgress(reader) {
  const max = reader.scrollHeight - reader.clientHeight;
  const ratio = max > 0 ? reader.scrollTop / max : 0;
  state.progress = {
    chapterId: state.readingChapterId,
    ratio: clamp(ratio, 0, 1)
  };
  persistProgress();
}

function restoreReaderScroll() {
  const reader = $app.querySelector("[data-reader-content]");
  if (!reader) return;

  requestAnimationFrame(() => {
    if (state.progress.chapterId === state.readingChapterId) {
      const max = reader.scrollHeight - reader.clientHeight;
      reader.scrollTop = Math.max(0, max * state.progress.ratio);
    }
  });
}

function persistProgress() {
  writeStorage(STORAGE_KEYS.progress, state.progress);
}

function persistReader() {
  writeStorage(STORAGE_KEYS.reader, state.reader);
}

function progressPercent() {
  const chapterPart = (state.progress.chapterId - 1) / state.book.totalChapters;
  const currentPart = (state.progress.ratio || 0) / state.book.totalChapters;
  return Math.round((chapterPart + currentPart) * 100);
}

function readerThemeClass() {
  if (state.reader.theme === "dark") return "reader-dark";
  if (state.reader.theme === "green") return "reader-green";
  return "";
}

function shortChapterTitle(title) {
  return title.replace(/^第[一二三四五六七八九十百]+章　?/, "");
}

function formatWan(value) {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}萬`;
  }
  return String(value);
}

function formatWords(value) {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}萬字`;
  }
  return `${value}字`;
}

function showToast(message) {
  const root = $app.querySelector("[data-toast-root]");
  if (!root) return;
  root.innerHTML = `<div class="toast">${escapeHtml(message)}</div>`;
  window.setTimeout(() => {
    root.innerHTML = "";
  }, 1700);
}

function throttle(fn, delay) {
  let last = 0;
  let timer = null;
  return (...args) => {
    const now = Date.now();
    const remaining = delay - (now - last);
    if (remaining <= 0) {
      window.clearTimeout(timer);
      timer = null;
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = window.setTimeout(() => {
        last = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
