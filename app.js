const $app = document.querySelector("#app");
const APP_VERSION = "myth-v1";

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
  books: [],
  book: null,
  activeBookId: "brave-delivery",
  view: "home",
  query: "",
  readingChapterId: 1,
  settingsOpen: false,
  progressByBook: {},
  bookmarksByBook: {},
  progress: {
    chapterId: 1,
    ratio: 0
  },
  reader: {
    fontSize: 18,
    theme: "paper",
    audioRate: 0.95,
    audioPitch: 1,
    audioStyle: "story",
    audioVoiceURI: "",
    audioAutoNext: true,
    keepAwake: true,
    stopAfterChapter: false,
    sleepMinutes: 0
  },
  audio: {
    active: false,
    paused: false,
    chapterId: null
  },
  pwa: {
    installAvailable: false,
    installed: window.matchMedia("(display-mode: standalone)").matches,
    offlineReady: false
  }
};

const STORAGE_KEYS = {
  progress: "brave-delivery-progress",
  progressByBook: "brave-delivery-progress-by-book",
  selectedBook: "brave-delivery-selected-book",
  reader: "brave-delivery-reader",
  shelf: "brave-delivery-shelf",
  bookmarks: "brave-delivery-bookmarks"
};

let speechQueue = [];
let speechIndex = 0;
let activeUtterance = null;
let cachedVoices = [];
let sleepTimerId = null;
let sleepEndsAt = null;
let installPromptEvent = null;
let wakeLockSentinel = null;
let wakeLockWarningShown = false;

init();
setupPwaInstall();
registerServiceWorker();
setupMediaSessionHandlers();

if (audioSupported()) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    cachedVoices = window.speechSynthesis.getVoices();
    if (state.book) {
      render();
    }
  });
  window.addEventListener("pagehide", () => {
    releaseWakeLock();
    updateMediaSession();
  });
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    if (state.audio.active && !state.audio.paused) {
      requestWakeLock();
      updateMediaSession();
    }
  } else {
    releaseWakeLock();
  }
});

async function init() {
  loadLocalState();

  try {
    await loadLibrary();
    await loadBook(state.activeBookId);
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
  const storedProgressByBook = readStorage(STORAGE_KEYS.progressByBook);
  const storedSelectedBook = readStorage(STORAGE_KEYS.selectedBook);
  const storedReader = readStorage(STORAGE_KEYS.reader);
  const storedBookmarks = readStorage(STORAGE_KEYS.bookmarks);

  state.activeBookId = storedSelectedBook || state.activeBookId;

  if (storedProgressByBook && typeof storedProgressByBook === "object") {
    state.progressByBook = storedProgressByBook;
  }

  if (storedBookmarks && typeof storedBookmarks === "object") {
    state.bookmarksByBook = storedBookmarks;
  }

  if (storedProgress && !state.progressByBook["brave-delivery"]) {
    state.progressByBook["brave-delivery"] = normalizeProgress(storedProgress);
  }

  if (storedReader) {
    state.reader = {
      fontSize: clamp(Number(storedReader.fontSize) || 18, 15, 24),
      theme: storedReader.theme || "paper",
      audioRate: clamp(Number(storedReader.audioRate) || 0.95, 0.7, 1.4),
      audioPitch: clamp(Number(storedReader.audioPitch) || 1, 0.8, 1.2),
      audioStyle: normalizeAudioStyle(storedReader.audioStyle),
      audioVoiceURI: storedReader.audioVoiceURI || "",
      audioAutoNext: storedReader.audioAutoNext !== false,
      keepAwake: storedReader.keepAwake !== false,
      stopAfterChapter: storedReader.stopAfterChapter === true,
      sleepMinutes: [0, 15, 30, 45, 60].includes(Number(storedReader.sleepMinutes)) ? Number(storedReader.sleepMinutes) : 0
    };
  }
}

async function loadLibrary() {
  const response = await fetch(`data/books.json?v=${APP_VERSION}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("book library not found");
  }

  const library = await response.json();
  const books = Array.isArray(library.books) ? library.books : [];
  if (!books.length) {
    throw new Error("empty book library");
  }

  state.books = books;
  if (!books.some((book) => book.id === state.activeBookId)) {
    state.activeBookId = library.defaultBookId || books[0].id;
  }
}

async function loadBook(bookId) {
  const meta = bookMeta(bookId) || state.books[0];
  if (!meta) {
    throw new Error("book metadata not found");
  }

  const response = await fetch(withVersion(meta.dataUrl || "data/book.json"), { cache: "no-store" });
  if (!response.ok) {
    throw new Error("book data not found");
  }

  const bookData = await response.json();
  state.activeBookId = meta.id;
  state.book = normalizeBook({ ...meta, ...bookData, cover: bookData.cover || meta.cover, dataUrl: meta.dataUrl });
  state.progress = progressForBook(state.activeBookId);
  state.readingChapterId = state.progress.chapterId || 1;
  writeStorage(STORAGE_KEYS.selectedBook, state.activeBookId);
}

function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function normalizeAudioStyle(style) {
  if (style === "plain" || style === "story" || style === "drama") return style;
  if (style === "emotive") return "story";
  return "story";
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function setupPwaInstall() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPromptEvent = event;
    state.pwa.installAvailable = true;
    render();
  });

  window.addEventListener("appinstalled", () => {
    installPromptEvent = null;
    state.pwa.installAvailable = false;
    state.pwa.installed = true;
    render();
    showToast("已安裝到主畫面");
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./service-worker.js");
      await navigator.serviceWorker.ready;
      state.pwa.offlineReady = true;
      render();
    } catch {
      state.pwa.offlineReady = false;
    }
  });
}

async function installApp() {
  if (state.pwa.installed) {
    showToast("App 已安裝");
    return;
  }

  if (!installPromptEvent) {
    showToast("可用瀏覽器選單加入主畫面");
    return;
  }

  installPromptEvent.prompt();
  const choice = await installPromptEvent.userChoice;
  installPromptEvent = null;
  state.pwa.installAvailable = false;
  state.pwa.installed = choice.outcome === "accepted";
  render();
  showToast(state.pwa.installed ? "已安裝到主畫面" : "已取消安裝");
}

function normalizeBook(book) {
  const chapters = Array.isArray(book.chapters) ? book.chapters : [];
  return {
    ...book,
    id: book.id || state.activeBookId,
    cover: book.cover || "assets/cover.png",
    tags: Array.isArray(book.tags) ? book.tags : [],
    chapters,
    totalChapters: Number(book.totalChapters) || chapters.length,
    totalWords: Number(book.totalWords) || chapters.reduce((sum, chapter) => sum + (Number(chapter.wordCount) || 0), 0)
  };
}

function normalizeProgress(progress) {
  return {
    chapterId: Number(progress?.chapterId) || 1,
    ratio: clamp(Number(progress?.ratio) || 0, 0, 1)
  };
}

function bookMeta(bookId) {
  return state.books.find((book) => book.id === bookId);
}

function activeBookMeta() {
  return bookMeta(state.activeBookId) || state.book;
}

function progressForBook(bookId) {
  return normalizeProgress(state.progressByBook[bookId] || { chapterId: 1, ratio: 0 });
}

function coverForBook(book = state.book) {
  return book?.cover || "assets/cover.png";
}

function withVersion(url) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${APP_VERSION}`;
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
    home: ["夜半偷鹹魚", "今日繼續派送"],
    shelf: ["我的書架", `${state.books.length} 本作品`],
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
  const next = nextChapter(current.id);
  const chapterPreview = listeningPreviewChapters().map((chapter) => chapterRow(chapter)).join("");

  return `
    <button class="listen-search" type="button" data-action="catalog">
      ${icons.search}<span>搜尋小說 / 章節 / 關鍵劇情</span>
    </button>

    <section class="continue-listen">
      <div class="continue-copy">
        <span class="eyebrow">繼續收聽</span>
        <h1>${escapeHtml(book.title)}</h1>
        <p>${escapeHtml(current.title)}</p>
        <div class="listen-progress-line">
          <span>已聽 ${percent}%</span>
          <span>${estimateChapterMinutes(current)} 分鐘本章</span>
        </div>
      </div>
      <button class="continue-play" type="button" data-action="listen-current" aria-label="繼續聽書">
        ${icons.play}<span>繼續播放</span>
      </button>
      <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
    </section>

    <section class="hero">
      <div class="book-hero">
        <img class="cover" src="${escapeAttr(coverForBook(book))}" alt="《${escapeAttr(book.title)}》書封">
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

    <section class="panel quick-listen-panel">
      <div class="progress-block">
        <div class="progress-meta">
          <span>${escapeHtml(next ? `下一章：${next.title}` : "已到最新章節")}</span>
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
        <h2>今日推薦</h2>
        <button class="text-link" type="button" data-action="catalog">更多</button>
      </div>
      <div class="recommend-grid">
        ${recommendationCard("今晚適合聽", "爆笑異世冒險", "搞笑")}
        ${recommendationCard("一聽停不下來", "王宮危機與魔物", "聖印")}
        ${recommendationCard("30 分鐘一章", "通勤剛剛好", "配送")}
        ${recommendationCard("完結可連播", `${book.totalChapters} 章全收錄`, "完結")}
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>我的書架</h2>
        <button class="text-link" type="button" data-action="shelf">打開</button>
      </div>
      <div class="library-shortcuts">
        <button type="button" data-action="shelf"><strong>${shelfCount()}</strong><span>收藏中</span></button>
        <button type="button" data-action="catalog"><strong>${book.totalChapters}</strong><span>已離線</span></button>
        <button type="button" data-action="continue"><strong>${current.id}</strong><span>最近聽過</span></button>
        <button type="button" data-action="catalog"><strong>${book.status}</strong><span>完結小說</span></button>
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
        <h2>本週最熱</h2>
        <button class="text-link" type="button" data-action="catalog">目錄</button>
      </div>
      <div class="chapter-list">${chapterPreview}</div>
    </section>
  `;
}

function shelfView() {
  const current = currentChapter();
  const bookCards = state.books.map((book) => bookShelfCard(book)).join("");
  const bookmarks = bookmarkedChapters();
  return `
    <section class="panel">
      <div class="panel-header">
        <h2>繼續收聽</h2>
        <button class="text-link" type="button" data-action="catalog">查看目錄</button>
      </div>
      <article class="shelf-card current-book-card">
        <img src="${escapeAttr(coverForBook(state.book))}" alt="《${escapeAttr(state.book.title)}》書封">
        <div>
          <h2>${escapeHtml(state.book.title)}</h2>
          <p>${escapeHtml(current.title)} · 已聽 ${progressPercent()}% · 約 ${estimateChapterMinutes(current)} 分鐘</p>
          <button class="primary-button wide-button" type="button" data-action="listen-current">${icons.headphones}<span>繼續播放</span></button>
          <button class="secondary-button wide-button" type="button" data-action="continue">${icons.play}<span>邊聽邊看</span></button>
        </div>
      </article>
      <div class="chapter-list">
        ${chapterRow(current)}
        ${chapterRow(nextChapter(current.id) || state.book.chapters[0])}
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>劇情書籤</h2>
        <span class="panel-count">${bookmarks.length} 個</span>
      </div>
      <div class="chapter-list">
        ${bookmarks.length ? bookmarks.map((chapter) => chapterRow(chapter)).join("") : `<p class="empty">還未收藏章節</p>`}
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <h2>作品庫</h2>
        <span class="panel-count">${state.books.length} 本</span>
      </div>
      <div class="book-library">${bookCards}</div>
    </section>
  `;
}

function catalogView() {
  const chapters = filteredChapters();
  return `
    <div class="search-box">
      <input type="search" placeholder="搜尋章名，例如：聖印、魔王、五星" value="${escapeAttr(state.query)}" data-input="chapter-search" aria-label="搜尋章節">
    </div>
    <div class="category-strip">
      ${categoryButton("", "全部")}
      ${categoryButton("搞笑", "搞笑")}
      ${categoryButton("聖印", "奇幻")}
      ${categoryButton("王宮", "王宮")}
      ${categoryButton("配送", "打工人")}
      ${categoryButton("魔王", "魔王")}
    </div>
    <div class="catalog-summary">
      <strong>${chapters.length}</strong><span>個章節結果</span>
      <strong>${progressPercent()}%</strong><span>已聽進度</span>
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
      <div class="setting-row">
        <span>朗讀</span>
        <div class="segmented">
          ${audioStyleButton("plain", "標準")}
          ${audioStyleButton("story", "聽書")}
          ${audioStyleButton("drama", "戲劇")}
        </div>
      </div>
      <div class="setting-row">
        <span>聲音</span>
        ${voiceSelect()}
      </div>
      <div class="setting-row">
        <span>音高</span>
        <div class="speed-control">
          <button type="button" data-action="audio-pitch-minus">低</button>
          <strong>${state.reader.audioPitch.toFixed(1)}</strong>
          <button type="button" data-action="audio-pitch-plus">高</button>
        </div>
      </div>
      <div class="setting-row">
        <span>連播</span>
        <div class="segmented">
          ${autoNextButton(true, "開")}
          ${autoNextButton(false, "關")}
        </div>
      </div>
      <div class="setting-row">
        <span>防黑屏</span>
        <div class="segmented">
          ${keepAwakeButton(true, "開")}
          ${keepAwakeButton(false, "關")}
        </div>
      </div>
      <div class="setting-row">
        <span>定時</span>
        <div class="timer-buttons">
          ${sleepButton(0, "關")}
          ${sleepButton(15, "15")}
          ${sleepButton(30, "30")}
          ${sleepButton(45, "45")}
          ${sleepButton(60, "60")}
          ${sleepChapterButton()}
        </div>
      </div>
    </section>
    <section class="panel">
      <div class="panel-header">
        <h2>App 模式</h2>
      </div>
      <div class="app-mode-grid">
        <div><strong>${state.pwa.offlineReady ? "已啟用" : "準備中"}</strong><span>離線閱讀</span></div>
        <div><strong>${state.pwa.installed ? "已安裝" : "可安裝"}</strong><span>手機主畫面</span></div>
      </div>
      <button class="primary-button wide-button" type="button" data-action="install-app" ${state.pwa.installed ? "disabled" : ""}>
        ${icons.plus}<span>${state.pwa.installed ? "已安裝" : "安裝 App"}</span>
      </button>
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
  const prev = previousChapter(chapter.id);
  const next = nextChapter(chapter.id);
  const bookmarked = isChapterBookmarked(chapter.id);

  return `
    <div class="audio-dock ${active ? "active" : ""}">
      <div class="audio-meta">
        <strong>${status}</strong>
        <span>${escapeHtml(shortChapterTitle(chapter.title))} · ${escapeHtml(audioModeLabel())} · ${escapeHtml(wakeLockStatusLabel())} · ${state.reader.audioRate.toFixed(1)}x · ${sleepStatusLabel()}</span>
      </div>
      <div class="audio-controls">
        <button type="button" data-action="audio-prev-chapter" ${prev ? "" : "disabled"} aria-label="上一章">${icons.back}</button>
        <button type="button" data-action="audio-rewind" ${active ? "" : "disabled"} aria-label="倒退 15 秒"><span>15</span></button>
        <button class="audio-main" type="button" data-action="${mainAction}" ${supported ? "" : "disabled"} aria-label="${mainLabel}">
          ${mainIcon}<span>${mainLabel}</span>
        </button>
        <button type="button" data-action="audio-forward" ${active ? "" : "disabled"} aria-label="快進 15 秒"><span>15</span></button>
        <button type="button" data-action="audio-next-chapter" ${next ? "" : "disabled"} aria-label="下一章">${icons.back}</button>
      </div>
      <div class="audio-extra">
        <button type="button" data-action="toggle-bookmark" class="${bookmarked ? "active" : ""}">${icons.bookmark}<span>${bookmarked ? "已收藏" : "收藏本章"}</span></button>
        <button type="button" data-action="sleep-chapter-end" class="${state.reader.stopAfterChapter ? "active" : ""}"><span>${state.reader.stopAfterChapter ? "本章後停" : "本章停止"}</span></button>
        <button type="button" data-action="audio-stop" ${active ? "" : "disabled"}>${icons.stop}<span>停止</span></button>
      </div>
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
      <div class="setting-row">
        <span>朗讀</span>
        <div class="segmented">
          ${audioStyleButton("plain", "標準")}
          ${audioStyleButton("story", "聽書")}
          ${audioStyleButton("drama", "戲劇")}
        </div>
      </div>
      <div class="setting-row">
        <span>聲音</span>
        ${voiceSelect()}
      </div>
      <div class="setting-row">
        <span>音高</span>
        <div class="speed-control">
          <button type="button" data-action="audio-pitch-minus">低</button>
          <strong>${state.reader.audioPitch.toFixed(1)}</strong>
          <button type="button" data-action="audio-pitch-plus">高</button>
        </div>
      </div>
      <div class="setting-row">
        <span>連播</span>
        <div class="segmented">
          ${autoNextButton(true, "開")}
          ${autoNextButton(false, "關")}
        </div>
      </div>
      <div class="setting-row">
        <span>防黑屏</span>
        <div class="segmented">
          ${keepAwakeButton(true, "開")}
          ${keepAwakeButton(false, "關")}
        </div>
      </div>
      <div class="setting-row">
        <span>定時</span>
        <div class="timer-buttons">
          ${sleepButton(0, "關")}
          ${sleepButton(15, "15")}
          ${sleepButton(30, "30")}
          ${sleepButton(45, "45")}
          ${sleepButton(60, "60")}
          ${sleepChapterButton()}
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
  const bookmarked = isChapterBookmarked(chapter.id);
  return `
    <button class="chapter-row${active}" type="button" data-chapter="${chapter.id}">
      <span>
        <strong>${bookmarked ? "★ " : ""}${escapeHtml(chapter.title)}</strong>
        <span>${formatWords(chapter.wordCount)} · 約 ${estimateChapterMinutes(chapter)} 分鐘</span>
      </span>
      <span class="badge">${chapter.id}/${state.book.totalChapters}</span>
    </button>
  `;
}

function bookShelfCard(book) {
  const progress = progressForBook(book.id);
  const percent = progressPercentForBook(book, progress);
  const active = book.id === state.activeBookId ? " active" : "";
  return `
    <article class="shelf-card library-book${active}">
      <img src="${escapeAttr(coverForBook(book))}" alt="《${escapeAttr(book.title)}》書封">
      <div>
        <h2>${escapeHtml(book.title)}</h2>
        <p>${escapeHtml(book.category || book.subtitle || "")} · ${book.totalChapters || 0} 章 · 已讀 ${percent}%</p>
        <button class="secondary-button wide-button" type="button" data-book-id="${escapeAttr(book.id)}">
          ${icons.book}<span>${active ? "目前閱讀" : "打開作品"}</span>
        </button>
      </div>
    </article>
  `;
}

function recommendationCard(label, title, query) {
  return `
    <button class="recommend-card" type="button" data-query="${escapeAttr(query)}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(title)}</strong>
    </button>
  `;
}

function categoryButton(query, label) {
  const active = state.query === query ? " active" : "";
  return `<button class="${active}" type="button" data-query="${escapeAttr(query)}">${escapeHtml(label)}</button>`;
}

function themeButton(theme, label) {
  return `<button type="button" class="${state.reader.theme === theme ? "active" : ""}" data-theme="${theme}">${label}</button>`;
}

function audioStyleButton(style, label) {
  return `<button type="button" class="${state.reader.audioStyle === style ? "active" : ""}" data-audio-style="${style}">${label}</button>`;
}

function voiceSelect() {
  const voices = voiceOptions();
  return `
    <select class="voice-select" data-input="voice-select" aria-label="選擇朗讀聲音">
      <option value="">自動選擇中文聲音</option>
      ${voices.map((voice) => `
        <option value="${escapeAttr(voice.voiceURI)}" ${state.reader.audioVoiceURI === voice.voiceURI ? "selected" : ""}>
          ${escapeHtml(voice.name)} · ${escapeHtml(voice.lang)}
        </option>
      `).join("")}
    </select>
  `;
}

function voiceOptions() {
  if (!audioSupported()) return [];
  cachedVoices = window.speechSynthesis.getVoices();
  return cachedVoices
    .filter((voice) => /^zh/i.test(voice.lang) || /Chinese|Cantonese|Mandarin|中文|粵|台|臺|香港|普通話|Natural|Neural|Xiaoxiao|Xiaoyi|Yunxi|Yunjian|Yunyang/i.test(voice.name))
    .sort((a, b) => voiceRank(a) - voiceRank(b) || a.name.localeCompare(b.name));
}

function voiceRank(voice) {
  const name = voice.name || "";
  const lang = voice.lang || "";
  if (/zh-(HK|TW|MO)/i.test(lang) && /Natural|Neural|Online/i.test(name)) return 0;
  if (/zh-(HK|MO)/i.test(lang) || /Cantonese|粵|香港/i.test(name)) return 1;
  if (/zh-TW/i.test(lang) || /台|臺/i.test(name)) return 2;
  if (/zh-CN/i.test(lang) && /Natural|Neural|Online|Xiaoxiao|Xiaoyi|Yunxi|Yunjian|Yunyang/i.test(name)) return 3;
  if (/zh-CN/i.test(lang) || /Mandarin|普通話/i.test(name)) return 4;
  if (/^zh/i.test(lang)) return 5;
  return 6;
}

function autoNextButton(value, label) {
  return `<button type="button" class="${state.reader.audioAutoNext === value ? "active" : ""}" data-auto-next="${value}">${label}</button>`;
}

function keepAwakeButton(value, label) {
  return `<button type="button" class="${state.reader.keepAwake === value ? "active" : ""}" data-keep-awake="${value}">${label}</button>`;
}

function sleepButton(minutes, label) {
  const active = !state.reader.stopAfterChapter && state.reader.sleepMinutes === minutes ? "active" : "";
  return `<button type="button" class="${active}" data-sleep-minutes="${minutes}">${label}</button>`;
}

function sleepChapterButton() {
  return `<button type="button" class="${state.reader.stopAfterChapter ? "active" : ""}" data-action="sleep-chapter-end">本章</button>`;
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

  $app.querySelectorAll("[data-book-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectBook(button.dataset.bookId);
    });
  });

  $app.querySelectorAll("[data-query]").forEach((button) => {
    button.addEventListener("click", () => {
      state.query = button.dataset.query || "";
      state.view = "catalog";
      state.settingsOpen = false;
      render();
    });
  });

  const search = $app.querySelector("[data-input='chapter-search']");
  if (search) {
    search.addEventListener("input", () => {
      state.query = search.value.trim();
      const list = $app.querySelector(".chapter-list");
      const chapters = filteredChapters();
      const summary = $app.querySelector(".catalog-summary");
      list.innerHTML = chapters.length
        ? chapters.map((chapter) => chapterRow(chapter)).join("")
        : `<p class="empty">沒有找到相關章節</p>`;
      if (summary) {
        summary.innerHTML = `<strong>${chapters.length}</strong><span>個章節結果</span><strong>${progressPercent()}%</strong><span>已聽進度</span>`;
      }
      $app.querySelectorAll(".category-strip button").forEach((button) => {
        button.classList.toggle("active", button.dataset.query === state.query);
      });
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

  $app.querySelectorAll("[data-audio-style]").forEach((button) => {
    button.addEventListener("click", () => {
      state.reader.audioStyle = normalizeAudioStyle(button.dataset.audioStyle);
      persistReader();
      render();
    });
  });

  const voiceSelectElement = $app.querySelector("[data-input='voice-select']");
  if (voiceSelectElement) {
    voiceSelectElement.addEventListener("change", () => {
      state.reader.audioVoiceURI = voiceSelectElement.value;
      persistReader();
      render();
    });
  }

  $app.querySelectorAll("[data-auto-next]").forEach((button) => {
    button.addEventListener("click", () => {
      state.reader.audioAutoNext = button.dataset.autoNext === "true";
      persistReader();
      render();
    });
  });

  $app.querySelectorAll("[data-keep-awake]").forEach((button) => {
    button.addEventListener("click", () => {
      state.reader.keepAwake = button.dataset.keepAwake === "true";
      persistReader();
      if (state.reader.keepAwake) {
        requestWakeLock().then(() => render());
      } else {
        releaseWakeLock();
      }
      render();
    });
  });

  $app.querySelectorAll("[data-sleep-minutes]").forEach((button) => {
    button.addEventListener("click", () => {
      setSleepTimer(Number(button.dataset.sleepMinutes));
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
    case "shelf":
      state.view = "shelf";
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
      writeStorage(STORAGE_KEYS.shelf, {
        ...readStorage(STORAGE_KEYS.shelf),
        [state.activeBookId]: { added: true, at: Date.now() }
      });
      showToast("已加入書架");
      break;
    case "install-app":
      installApp();
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
    case "audio-prev-chapter":
      startAdjacentAudio(-1);
      break;
    case "audio-next-chapter":
      startAdjacentAudio(1);
      break;
    case "audio-rewind":
      skipSpeechSegments(-2);
      break;
    case "audio-forward":
      skipSpeechSegments(2);
      break;
    case "toggle-bookmark":
      toggleBookmark(state.readingChapterId);
      break;
    case "sleep-chapter-end":
      setStopAfterChapter(!state.reader.stopAfterChapter);
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
    case "audio-pitch-minus":
      state.reader.audioPitch = clamp(Number((state.reader.audioPitch - 0.1).toFixed(1)), 0.8, 1.2);
      persistReader();
      render();
      break;
    case "audio-pitch-plus":
      state.reader.audioPitch = clamp(Number((state.reader.audioPitch + 0.1).toFixed(1)), 0.8, 1.2);
      persistReader();
      render();
      break;
  }
}

async function selectBook(bookId, targetView = "home") {
  if (!bookId || bookId === state.activeBookId) {
    state.view = targetView;
    state.settingsOpen = false;
    render();
    return;
  }

  try {
    stopAudio(false);
    await loadBook(bookId);
    state.view = targetView;
    state.query = "";
    state.settingsOpen = false;
    render();
    showToast("已切換作品");
  } catch {
    showToast("作品載入失敗");
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

function wakeLockSupported() {
  return "wakeLock" in navigator && window.isSecureContext;
}

async function requestWakeLock() {
  if (!state.reader.keepAwake || !state.audio.active || state.audio.paused || document.visibilityState !== "visible") {
    releaseWakeLock();
    return false;
  }

  if (!wakeLockSupported()) {
    if (!wakeLockWarningShown) {
      wakeLockWarningShown = true;
      showToast("這部手機不支援防黑屏，鎖屏後可能暫停");
    }
    return false;
  }

  if (wakeLockSentinel && !wakeLockSentinel.released) {
    return true;
  }

  try {
    wakeLockSentinel = await navigator.wakeLock.request("screen");
    wakeLockSentinel.addEventListener("release", () => {
      wakeLockSentinel = null;
      if (state.audio.active && !state.audio.paused) {
        render();
      }
    });
    return true;
  } catch (error) {
    if (!wakeLockWarningShown) {
      wakeLockWarningShown = true;
      showToast("防黑屏未能啟用，請保持頁面在前台");
    }
    wakeLockSentinel = null;
    return false;
  }
}

function releaseWakeLock() {
  if (!wakeLockSentinel) return;
  const sentinel = wakeLockSentinel;
  wakeLockSentinel = null;
  sentinel.release().catch(() => {});
}

function wakeLockStatusLabel() {
  if (!state.reader.keepAwake) return "防黑屏關";
  if (!wakeLockSupported()) return "防黑屏未支援";
  return wakeLockSentinel ? "防黑屏開" : "防黑屏待命";
}

function setupMediaSessionHandlers() {
  if (!("mediaSession" in navigator)) return;

  setMediaActionHandler("play", () => {
    if (state.audio.active && state.audio.paused) {
      resumeAudio();
    } else {
      startAudio(state.readingChapterId || state.progress.chapterId || 1);
    }
  });
  setMediaActionHandler("pause", pauseAudio);
  setMediaActionHandler("stop", () => stopAudio());
  setMediaActionHandler("nexttrack", () => {
    const next = nextChapter(state.audio.chapterId || state.readingChapterId || state.progress.chapterId);
    if (next) {
      openChapter(next.id);
      startAudio(next.id);
    }
  });
  setMediaActionHandler("previoustrack", () => {
    const previous = previousChapter(state.audio.chapterId || state.readingChapterId || state.progress.chapterId);
    if (previous) {
      openChapter(previous.id);
      startAudio(previous.id);
    }
  });
}

function setMediaActionHandler(action, handler) {
  try {
    navigator.mediaSession.setActionHandler(action, handler);
  } catch (error) {
    // Some platforms only support part of the Media Session action list.
  }
}

function updateMediaSession(chapter = currentAudioChapter()) {
  if (!("mediaSession" in navigator)) return;

  if (chapter && "MediaMetadata" in window) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: chapter.title,
      artist: state.book?.title || "夜半偷鹹魚",
      album: "夜半偷鹹魚"
    });
  }

  navigator.mediaSession.playbackState = state.audio.active
    ? (state.audio.paused ? "paused" : "playing")
    : "none";
}

function currentAudioChapter() {
  if (!state.book || !state.audio.chapterId) return null;
  return state.book.chapters.find((item) => item.id === state.audio.chapterId) || null;
}

function startAudio(chapterId, options = {}) {
  if (!audioSupported()) {
    showToast("這個瀏覽器暫時不支援聽書");
    return;
  }

  const chapter = state.book.chapters.find((item) => item.id === chapterId);
  if (!chapter) return;

  stopAudio(false, { keepSleepTimer: options.keepSleepTimer === true });
  speechQueue = buildSpeechQueue(chapter);
  speechIndex = 0;
  state.audio = {
    active: true,
    paused: false,
    chapterId: chapter.id
  };

  ensureSleepTimer();
  requestWakeLock().then((locked) => {
    if (locked && state.audio.active && !state.audio.paused) {
      render();
    }
  });
  updateMediaSession(chapter);
  speakNextChunk();
  render();
}

function pauseAudio() {
  if (!state.audio.active || !audioSupported()) return;
  window.speechSynthesis.pause();
  state.audio.paused = true;
  releaseWakeLock();
  updateMediaSession();
  render();
}

function resumeAudio() {
  if (!state.audio.active || !audioSupported()) return;
  window.speechSynthesis.resume();
  state.audio.paused = false;
  ensureSleepTimer();
  requestWakeLock().then((locked) => {
    if (locked && state.audio.active && !state.audio.paused) {
      render();
    }
  });
  updateMediaSession();
  render();
}

function startAdjacentAudio(direction) {
  const chapterId = state.audio.chapterId || state.readingChapterId || state.progress.chapterId || 1;
  const chapter = direction < 0 ? previousChapter(chapterId) : nextChapter(chapterId);
  if (!chapter) return;

  openChapter(chapter.id);
  startAudio(chapter.id);
}

function skipSpeechSegments(offset) {
  if (!state.audio.active || state.audio.paused || !audioSupported() || !speechQueue.length) return;

  speechIndex = clamp(speechIndex + offset, 0, Math.max(0, speechQueue.length - 1));
  window.speechSynthesis.cancel();
  activeUtterance = null;
  window.setTimeout(() => {
    if (state.audio.active && !state.audio.paused) {
      speakNextChunk();
      render();
    }
  }, 80);
}

function stopAudio(shouldRender = true, options = {}) {
  if (audioSupported()) {
    window.speechSynthesis.cancel();
  }

  if (!options.keepSleepTimer) {
    clearSleepTimer();
  }
  releaseWakeLock();
  speechQueue = [];
  speechIndex = 0;
  activeUtterance = null;
  state.audio = {
    active: false,
    paused: false,
    chapterId: null
  };

  if (shouldRender) {
    updateMediaSession();
    render();
  }
}

function finishAudio() {
  const finishedChapterId = state.audio.chapterId;
  const shouldStopAfterChapter = state.reader.stopAfterChapter;
  const followingChapter = !shouldStopAfterChapter && state.reader.audioAutoNext ? nextChapter(finishedChapterId) : null;

  speechQueue = [];
  speechIndex = 0;
  activeUtterance = null;
  state.audio = {
    active: false,
    paused: false,
    chapterId: null
  };

  if (shouldStopAfterChapter) {
    state.reader.stopAfterChapter = false;
    persistReader();
  }

  if (followingChapter && !sleepTimerExpired()) {
    state.progress = { chapterId: followingChapter.id, ratio: 0 };
    state.readingChapterId = followingChapter.id;
    state.view = "reader";
    state.settingsOpen = false;
    persistProgress();
    render();
    showToast("自動播放下一章");
    startAudio(followingChapter.id, { keepSleepTimer: true });
    return;
  }

  releaseWakeLock();
  updateMediaSession();
  clearSleepTimer(false);
  render();
  showToast(shouldStopAfterChapter ? "已播完本章並停止" : followingChapter ? "睡眠定時已停止朗讀" : "本章朗讀完畢");
}

function setSleepTimer(minutes) {
  const allowedMinutes = [0, 15, 30, 45, 60].includes(minutes) ? minutes : 0;
  state.reader.sleepMinutes = allowedMinutes;
  state.reader.stopAfterChapter = false;
  persistReader();
  clearSleepTimer();

  if (allowedMinutes && state.audio.active && !state.audio.paused) {
    sleepEndsAt = Date.now() + allowedMinutes * 60 * 1000;
    scheduleSleepTimer();
  }

  render();
  showToast(allowedMinutes ? `已設定 ${allowedMinutes} 分鐘後停止` : "已關閉睡眠定時");
}

function setStopAfterChapter(enabled) {
  state.reader.stopAfterChapter = Boolean(enabled);
  if (enabled) {
    state.reader.sleepMinutes = 0;
    clearSleepTimer();
  }
  persistReader();
  render();
  showToast(enabled ? "會在本章播完後停止" : "已關閉本章停止");
}

function ensureSleepTimer() {
  if (!state.reader.sleepMinutes || !state.audio.active || state.audio.paused) {
    clearSleepTimer();
    return;
  }

  if (!sleepEndsAt) {
    sleepEndsAt = Date.now() + state.reader.sleepMinutes * 60 * 1000;
  }

  scheduleSleepTimer();
}

function scheduleSleepTimer() {
  window.clearTimeout(sleepTimerId);
  if (!sleepEndsAt) return;

  const delay = Math.max(0, sleepEndsAt - Date.now());
  sleepTimerId = window.setTimeout(() => {
    sleepTimerId = null;
    sleepEndsAt = null;
    state.reader.sleepMinutes = 0;
    persistReader();
    stopAudio(false, { keepSleepTimer: true });
    render();
    showToast("睡眠定時已停止朗讀");
  }, delay);
}

function clearSleepTimer() {
  window.clearTimeout(sleepTimerId);
  sleepTimerId = null;
  sleepEndsAt = null;
}

function sleepTimerExpired() {
  return Boolean(sleepEndsAt && Date.now() >= sleepEndsAt);
}

function sleepStatusLabel() {
  if (state.reader.stopAfterChapter) return "本章後停";

  if (sleepEndsAt) {
    const remaining = Math.max(1, Math.ceil((sleepEndsAt - Date.now()) / 60000));
    return `${remaining} 分鐘後停`;
  }

  return state.reader.sleepMinutes ? `${state.reader.sleepMinutes} 分鐘定時` : "定時關";
}

function audioModeLabel() {
  const labels = {
    plain: "標準",
    story: "聽書",
    drama: "戲劇"
  };
  const style = labels[normalizeAudioStyle(state.reader.audioStyle)];
  const voice = selectedVoice();
  return voice ? `${style} · ${voice.name}` : style;
}

function speakNextChunk() {
  if (!state.audio.active || !audioSupported()) return;

  if (speechIndex >= speechQueue.length) {
    finishAudio();
    return;
  }

  const segment = speechQueue[speechIndex];
  const prosody = segmentProsody(segment);
  const utterance = new SpeechSynthesisUtterance(segment.text);
  const voice = preferredVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "zh-Hant";
  }
  utterance.rate = prosody.rate;
  utterance.pitch = prosody.pitch;
  utterance.volume = 1;

  utterance.onend = () => {
    if (!state.audio.active) return;
    speechIndex += 1;
    window.setTimeout(() => {
      if (state.audio.active && !state.audio.paused) {
        speakNextChunk();
      }
    }, prosody.pauseAfter);
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
  const segments = [];
  pushSpeechSegment(segments, chapter.title, "title");

  chapter.content
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .forEach((paragraph) => {
      const type = classifySpeechText(paragraph);
      const sentences = splitSpeechText(paragraph);
      sentences.forEach((sentence, index) => {
        pushSpeechSegment(segments, sentence, type, { paragraphEnd: index === sentences.length - 1 });
      });
    });

  return segments;
}

function splitSpeechText(text) {
  const sentences = text
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .match(/[^。！？!?；;]+[。！？!?；;]?|[^，,、。！？!?；;]{22,}[，,、]/g);

  return sentences?.length ? sentences.map((sentence) => sentence.trim()).filter(Boolean) : [text.trim()].filter(Boolean);
}

function pushSpeechSegment(segments, text, type, options = {}) {
  const clean = normalizeSpokenText(text, type);
  if (!clean) return;

  const maxLength = type === "dialogue" ? 96 : 132;
  for (let index = 0; index < clean.length; index += maxLength) {
    const part = clean.slice(index, index + maxLength).trim();
    if (part) {
      const isLastPart = index + maxLength >= clean.length;
      segments.push(createSpeechSegment(part, type, options.paragraphEnd && isLastPart));
    }
  }
}

function normalizeSpokenText(text, type) {
  const clean = String(text || "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (type === "system") {
    return clean.replace(/^【\s*/, "").replace(/\s*】$/, "");
  }

  return clean;
}

function classifySpeechText(text) {
  const clean = text.trim();
  if (/^【.+】$/.test(clean)) return "system";
  if (/^[「“『].+[」”』]$/.test(clean) || /[：:]\s*[「“『]/.test(clean) || /[「」“”『』]/.test(clean)) return "dialogue";
  if (/[？！!?]$/.test(clean) || /轟|咚|砰|叮|咔|警告|倒計時/.test(clean)) return "emphasis";
  return "narration";
}

function createSpeechSegment(text, type, paragraphEnd = false) {
  return {
    text,
    type,
    paragraphEnd
  };
}

function segmentProsody(segment) {
  const text = segment.text;
  const type = segment.type;
  const style = normalizeAudioStyle(state.reader.audioStyle);
  const baseRate = state.reader.audioRate;
  const basePitch = state.reader.audioPitch;

  if (style === "plain") {
    return {
      rate: baseRate,
      pitch: basePitch,
      pauseAfter: punctuationPause(text, 140, segment.paragraphEnd)
    };
  }

  const exclaim = /[！!]/.test(text);
  const question = /[？?]/.test(text);
  const dramatic = style === "drama";

  if (type === "title") {
    return {
      rate: clamp(baseRate * (dramatic ? 0.84 : 0.88), 0.7, 1.4),
      pitch: clamp(basePitch + 0.02, 0.8, 1.2),
      pauseAfter: 900
    };
  }

  if (type === "system") {
    return {
      rate: clamp(baseRate * (dramatic ? 0.9 : 0.92), 0.7, 1.4),
      pitch: clamp(basePitch - (dramatic ? 0.08 : 0.05), 0.8, 1.2),
      pauseAfter: punctuationPause(text, dramatic ? 520 : 420, segment.paragraphEnd)
    };
  }

  if (type === "dialogue") {
    return {
      rate: clamp(baseRate * (dramatic ? (exclaim ? 1.08 : 1.02) : 1), 0.7, 1.4),
      pitch: clamp(basePitch + (dramatic ? (question ? 0.08 : 0.05) : 0.03), 0.8, 1.2),
      pauseAfter: punctuationPause(text, dramatic && exclaim ? 320 : 260, segment.paragraphEnd)
    };
  }

  if (type === "emphasis") {
    return {
      rate: clamp(baseRate * (dramatic ? (exclaim ? 1.04 : 0.96) : 0.97), 0.7, 1.4),
      pitch: clamp(basePitch + (dramatic && exclaim ? 0.08 : 0.03), 0.8, 1.2),
      pauseAfter: punctuationPause(text, dramatic ? 420 : 340, segment.paragraphEnd)
    };
  }

  return {
    rate: clamp(baseRate * (dramatic ? 0.94 : 0.96), 0.7, 1.4),
    pitch: basePitch,
    pauseAfter: punctuationPause(text, dramatic ? 300 : 260, segment.paragraphEnd)
  };
}

function punctuationPause(text, basePause, paragraphEnd = false) {
  let pause = basePause;
  if (/[。！？!?]$/.test(text)) pause += 240;
  if (/[；;：:]$/.test(text)) pause += 150;
  if (/[，,、]$/.test(text)) pause += 80;
  if (paragraphEnd) pause += 260;
  return pause;
}

function preferredVoice() {
  if (!audioSupported()) return null;

  cachedVoices = window.speechSynthesis.getVoices();
  return selectedVoice()
    || cachedVoices.find((voice) => /^zh-(HK|TW|MO)$/i.test(voice.lang) && /Natural|Neural|Online/i.test(voice.name))
    || cachedVoices.find((voice) => /^zh-(HK|TW|MO)$/i.test(voice.lang))
    || cachedVoices.find((voice) => /^zh-Hant/i.test(voice.lang))
    || cachedVoices.find((voice) => /^zh-CN$/i.test(voice.lang) && /Natural|Neural|Online|Xiaoxiao|Xiaoyi|Yunxi|Yunjian|Yunyang/i.test(voice.name))
    || cachedVoices.find((voice) => /^zh/i.test(voice.lang))
    || null;
}

function selectedVoice() {
  if (!audioSupported() || !state.reader.audioVoiceURI) return null;
  cachedVoices = window.speechSynthesis.getVoices();
  return cachedVoices.find((voice) => voice.voiceURI === state.reader.audioVoiceURI) || null;
}

function listeningPreviewChapters() {
  const current = currentChapter();
  const candidates = [
    current,
    nextChapter(current.id),
    state.book.chapters.find((chapter) => /聖印|魔王|王宮|配送|五星/.test(chapter.title + chapter.content))
  ].filter(Boolean);
  return uniqueChapters(candidates).slice(0, 3);
}

function uniqueChapters(chapters) {
  const seen = new Set();
  return chapters.filter((chapter) => {
    if (seen.has(chapter.id)) return false;
    seen.add(chapter.id);
    return true;
  });
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

function bookmarkedChapters() {
  const ids = bookmarkIds();
  return ids
    .map((id) => state.book.chapters.find((chapter) => chapter.id === id))
    .filter(Boolean);
}

function bookmarkIds() {
  return Array.isArray(state.bookmarksByBook[state.activeBookId]) ? state.bookmarksByBook[state.activeBookId] : [];
}

function isChapterBookmarked(chapterId) {
  return bookmarkIds().includes(chapterId);
}

function toggleBookmark(chapterId) {
  const id = Number(chapterId || state.readingChapterId || state.progress.chapterId || 1);
  const ids = bookmarkIds();
  const exists = ids.includes(id);
  state.bookmarksByBook[state.activeBookId] = exists ? ids.filter((item) => item !== id) : [...ids, id].sort((a, b) => a - b);
  persistBookmarks();
  render();
  showToast(exists ? "已移除章節書籤" : "已收藏本章");
}

function shelfCount() {
  const shelf = readStorage(STORAGE_KEYS.shelf) || {};
  return Object.keys(shelf).length || state.books.length;
}

function estimateChapterMinutes(chapter) {
  const words = Math.max(1, Number(chapter?.wordCount) || 2600);
  return Math.max(1, Math.round(words / 420));
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
  state.progressByBook[state.activeBookId] = normalizeProgress(state.progress);
  writeStorage(STORAGE_KEYS.progressByBook, state.progressByBook);
  if (state.activeBookId === "brave-delivery") {
    writeStorage(STORAGE_KEYS.progress, state.progress);
  }
}

function persistReader() {
  writeStorage(STORAGE_KEYS.reader, state.reader);
}

function persistBookmarks() {
  writeStorage(STORAGE_KEYS.bookmarks, state.bookmarksByBook);
}

function progressPercent() {
  return progressPercentForBook(state.book, state.progress);
}

function progressPercentForBook(book, progress) {
  const totalChapters = Math.max(1, Number(book?.totalChapters) || 1);
  const chapterPart = (progress.chapterId - 1) / totalChapters;
  const currentPart = (progress.ratio || 0) / totalChapters;
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
