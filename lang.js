// 多語系切換系統：繁體中文 (zh-Hant, 預設) / 簡體中文 (zh-Hans) / 英文 (en)
// 符合 BCP 47 標準，支援 JSON 文件載入與模板插值

const LANG_STORAGE_KEY = 'dse-sql-lang';
const DEFAULT_LANG = 'zh-Hant'; // 預設為繁體中文（符合 BCP 47）

// 語言代碼映射（向後兼容舊的 zh-TW/zh-CN）
const LANG_MAP = {
  'zh-TW': 'zh-Hant',
  'zh-CN': 'zh-Hans',
  'zh-Hant': 'zh-Hant',
  'zh-Hans': 'zh-Hans',
  'en': 'en'
};

// 翻譯字典（將從 JSON 文件載入）
let i18nDict = {};

// 語言代碼標準化
function normalizeLang(lang) {
  return LANG_MAP[lang] || DEFAULT_LANG;
}

// 從 JSON 文件載入翻譯
async function loadTranslations(lang) {
  const normalizedLang = normalizeLang(lang);
  
  try {
    const response = await fetch(`locales/${normalizedLang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${normalizedLang}.json`);
    }
    const data = await response.json();
    i18nDict[normalizedLang] = data;
    return data;
  } catch (error) {
    console.warn(`⚠️  無法載入 ${normalizedLang}.json，使用內嵌翻譯`, error);
    // 如果載入失敗，使用內嵌的 fallback 翻譯
    return getFallbackTranslations(normalizedLang);
  }
}

// Fallback 翻譯（當 JSON 載入失敗時使用）
function getFallbackTranslations(lang) {
  // 這裡保留一些關鍵翻譯作為 fallback
  const fallback = {
    'zh-Hant': {
      'nav.home': '首頁',
      'nav.practice': '題庫練習',
      'lang.label': '語言'
    },
    'zh-Hans': {
      'nav.home': '首页',
      'nav.practice': '题库练习',
      'lang.label': '语言'
    },
    'en': {
      'nav.home': 'Home',
      'nav.practice': 'SQL Practice',
      'lang.label': 'Language'
    }
  };
  return fallback[lang] || fallback[DEFAULT_LANG];
}

// 初始化所有語言
async function initTranslations() {
  const languages = ['zh-Hant', 'zh-Hans', 'en'];
  await Promise.all(languages.map(lang => loadTranslations(lang)));
}

// 獲取當前語言（標準化）
function getCurrentLang() {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  if (stored) {
    const normalized = normalizeLang(stored);
    if (['zh-Hant', 'zh-Hans', 'en'].includes(normalized)) {
      return normalized;
    }
  }
  return DEFAULT_LANG;
}

// 設置當前語言
function setCurrentLang(lang) {
  const normalized = normalizeLang(lang);
  if (['zh-Hant', 'zh-Hans', 'en'].includes(normalized)) {
    localStorage.setItem(LANG_STORAGE_KEY, normalized);
    return normalized;
  }
  return DEFAULT_LANG;
}

// 翻譯函數（支援模板插值）
function t(key, params = {}) {
  const lang = getCurrentLang();
  const dict = i18nDict[lang] || {};
  let str = dict[key] || key;
  
  // 模板插值：支援 {{name}}、{{count}} 等
  if (params && Object.keys(params).length > 0) {
    str = str.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : match;
    });
  }
  
  return str;
}

// 應用語言切換
async function applyLanguage(lang) {
  const normalizedLang = normalizeLang(lang);
  
  // 確保翻譯已載入
  if (!i18nDict[normalizedLang]) {
    await loadTranslations(normalizedLang);
  }
  
  // 更新所有有 data-i18n-key 的元素
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-key');
    const dict = i18nDict[normalizedLang] || {};
    const value = dict[key];
    
    if (value) {
      // 處理 placeholder 屬性（輸入框和文字區域）
      if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.hasAttribute('data-i18n-placeholder')) {
        const placeholderKey = key + '.placeholder';
        const placeholderValue = dict[placeholderKey];
        if (placeholderValue) {
          el.placeholder = placeholderValue;
        }
      }
      // 處理 title 屬性
      if (el.hasAttribute('data-i18n-title')) {
        const titleKey = el.getAttribute('data-i18n-title');
        const titleValue = dict[titleKey];
        if (titleValue) {
          el.title = titleValue;
        }
      }
      // 更新文字內容（非輸入框元素）
      if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
        el.textContent = value;
      } else if (el.hasAttribute('data-i18n-value')) {
        // 如果輸入框有 data-i18n-value，也更新 value
        el.value = value;
      }
    }
  });

  // 更新下拉選單顯示
  const select = document.getElementById('lang-switcher');
  if (select) {
    select.value = normalizedLang;
  }

  // 更新 HTML lang 屬性（符合 BCP 47）
  document.documentElement.lang = normalizedLang;
  document.documentElement.setAttribute('data-lang', normalizedLang);
  
  // 更新頁面標題（如果有 data-i18n-key 的 title 元素）
  const titleEl = document.querySelector('title[data-i18n-key]');
  if (titleEl) {
    const titleKey = titleEl.getAttribute('data-i18n-key');
    const titleValue = i18nDict[normalizedLang]?.[titleKey];
    if (titleValue) {
      document.title = titleValue;
    }
  }
}

// 初始化語言系統
async function initLanguage() {
  // 先載入所有翻譯
  await initTranslations();
  
  // 應用當前語言
  const lang = getCurrentLang();
  await applyLanguage(lang);
}

// DOM 載入完成後初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguage);
} else {
  // DOM 已經載入完成
  initLanguage();
}

// 語言切換器事件監聽
document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('lang-switcher');
  if (select) {
    select.addEventListener('change', async (e) => {
      const lang = e.target.value;
      const normalizedLang = setCurrentLang(lang);
      await applyLanguage(normalizedLang);
    });
  }
});

// 導出函數供其他腳本使用
window.i18n = {
  t,
  getCurrentLang,
  setCurrentLang,
  applyLanguage,
  initLanguage
};
