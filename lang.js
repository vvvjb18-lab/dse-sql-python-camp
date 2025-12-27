// 簡易多語系切換：繁體 (zh-TW, 預設) / 簡體 (zh-CN) / 英文 (en)

const LANG_STORAGE_KEY = 'dse-sql-lang';
const DEFAULT_LANG = 'zh-TW';

const i18nDict = {
  'nav.home': {
    'zh-TW': '首頁',
    'zh-CN': '首页',
    'en': 'Home'
  },
  'nav.practice': {
    'zh-TW': '題庫練習',
    'zh-CN': '题库练习',
    'en': 'SQL Practice'
  },
  'nav.python': {
    'zh-TW': 'Python中心',
    'zh-CN': 'Python中心',
    'en': 'Python Center'
  },
  'nav.allPractice': {
    'zh-TW': '綜合練習',
    'zh-CN': '综合练习',
    'en': 'All Exercises'
  },
  'nav.interactive': {
    'zh-TW': '互動練習',
    'zh-CN': '互动练习',
    'en': 'Interactive'
  },
  'nav.guide': {
    'zh-TW': '學習指南',
    'zh-CN': '学习指南',
    'en': 'Study Guide'
  },
  'nav.progress': {
    'zh-TW': '學習進度',
    'zh-CN': '学习进度',
    'en': 'Progress'
  },
  'nav.user': {
    'zh-TW': '用戶中心',
    'zh-CN': '用户中心',
    'en': 'User Center'
  },
  'lang.label': {
    'zh-TW': '語言',
    'zh-CN': '语言',
    'en': 'Language'
  },
  'lang.zhTW': {
    'zh-TW': '繁體',
    'zh-CN': '繁体',
    'en': 'Traditional'
  },
  'lang.zhCN': {
    'zh-TW': '簡體',
    'zh-CN': '简体',
    'en': 'Simplified'
  },
  'lang.en': {
    'zh-TW': 'English',
    'zh-CN': 'English',
    'en': 'English'
  },

  // 用戶中心頁面 User Center page
  'user.title': {
    'zh-TW': '用戶中心',
    'zh-CN': '用户中心',
    'en': 'User Center'
  },
  'user.subtitle': {
    'zh-TW': '登入 · 個人資料 · 學習進度',
    'zh-CN': '登录 · 个人资料 · 学习进度',
    'en': 'Sign in · Profile · Progress'
  },
  'user.description': {
    'zh-TW': '在這裡管理你的登入帳號、個人資料，並查看與同步學習進度。',
    'zh-CN': '在這裡管理你的登录帐号、个人资料，并查看与同步学习进度。',
    'en': 'Manage your account, profile, and sync learning progress here.'
  },
  'user.badge.sqlite': {
    'zh-TW': 'SQLite 持久化',
    'zh-CN': 'SQLite 持久化',
    'en': 'SQLite Persistence'
  },
  'user.badge.ai': {
    'zh-TW': 'AI 學習助手已啟用',
    'zh-CN': 'AI 学习助手已启用',
    'en': 'AI Learning Assistant Enabled'
  },

  'login.title': {
    'zh-TW': '登入',
    'zh-CN': '登录',
    'en': 'Sign in'
  },
  'login.badgeExisting': {
    'zh-TW': '現有帳號',
    'zh-CN': '已有帳號',
    'en': 'Existing account'
  },
  'login.username': {
    'zh-TW': '用戶名 / 電郵',
    'zh-CN': '用户名 / 邮箱',
    'en': 'Username / Email'
  },
  'login.username.placeholder': {
    'zh-TW': '輸入用戶名或電子郵件',
    'zh-CN': '输入用户名或电子邮箱',
    'en': 'Enter username or email'
  },
  'login.password': {
    'zh-TW': '密碼',
    'zh-CN': '密码',
    'en': 'Password'
  },
  'login.password.placeholder': {
    'zh-TW': '輸入密碼',
    'zh-CN': '输入密码',
    'en': 'Enter password'
  },
  'login.remember': {
    'zh-TW': '在此裝置記住登入狀態',
    'zh-CN': '在此装置记住登录状态',
    'en': 'Remember me on this device'
  },
  'login.forgot': {
    'zh-TW': '忘記密碼？',
    'zh-CN': '忘记密码？',
    'en': 'Forgot password?'
  },
  'login.submit': {
    'zh-TW': '登入',
    'zh-CN': '登录',
    'en': 'Sign in'
  },

  'register.title': {
    'zh-TW': '註冊',
    'zh-CN': '注册',
    'en': 'Sign up'
  },
  'register.badgeNew': {
    'zh-TW': '新帳號',
    'zh-CN': '新帐号',
    'en': 'New account'
  },
  'register.username': {
    'zh-TW': '用戶名',
    'zh-CN': '用户名',
    'en': 'Username'
  },
  'register.username.placeholder': {
    'zh-TW': '例如：sql_student01',
    'zh-CN': '例如：sql_student01',
    'en': 'e.g. sql_student01'
  },
  'register.email': {
    'zh-TW': '電子郵件',
    'zh-CN': '电子邮箱',
    'en': 'Email'
  },
  'register.email.placeholder': {
    'zh-TW': '例如：student@example.com',
    'zh-CN': '例如：student@example.com',
    'en': 'e.g. student@example.com'
  },
  'register.password': {
    'zh-TW': '密碼',
    'zh-CN': '密码',
    'en': 'Password'
  },
  'register.password.placeholder': {
    'zh-TW': '至少 6 個字符',
    'zh-CN': '至少 6 个字符',
    'en': 'At least 6 characters'
  },
  'register.confirmPassword': {
    'zh-TW': '確認密碼',
    'zh-CN': '确认密码',
    'en': 'Confirm password'
  },
  'register.confirmPassword.placeholder': {
    'zh-TW': '再次輸入密碼',
    'zh-CN': '再次输入密码',
    'en': 'Re-enter password'
  },
  'register.tosText': {
    'zh-TW': '提交即表示你同意我們的',
    'zh-CN': '提交即表示你同意我们的',
    'en': 'By submitting, you agree to our'
  },
  'register.tosLink': {
    'zh-TW': '使用條款',
    'zh-CN': '使用条款',
    'en': 'Terms of Use'
  },
  'register.privacyLink': {
    'zh-TW': '私隱政策',
    'zh-CN': '隐私政策',
    'en': 'Privacy Policy'
  },
  'register.submit': {
    'zh-TW': '建立新帳號',
    'zh-CN': '建立新帐号',
    'en': 'Create account'
  },

  'notLoggedIn.title': {
    'zh-TW': '尚未登入',
    'zh-CN': '尚未登录',
    'en': 'Not signed in'
  },
  'notLoggedIn.desc': {
    'zh-TW': '登入後可以同步學習進度、保存題目完成情況，並在不同裝置之間延續學習。',
    'zh-CN': '登录后可以同步学习进度、保存题目完成情况，并在不同装置之间延续学习。',
    'en': 'Sign in to sync progress, save your exercise status, and continue learning across devices.'
  },

  'profile.syncButton': {
    'zh-TW': '同步學習進度',
    'zh-CN': '同步学习进度',
    'en': 'Sync progress'
  },
  'profile.logoutButton': {
    'zh-TW': '登出',
    'zh-CN': '登出',
    'en': 'Sign out'
  },
  'profile.stats.completed': {
    'zh-TW': '已完成題目',
    'zh-CN': '已完成题目',
    'en': 'Completed questions'
  },
  'profile.stats.studyTime': {
    'zh-TW': '累計學習時間',
    'zh-CN': '累计学习时间',
    'en': 'Total study time'
  },
  'profile.stats.studyTime.unit': {
    'zh-TW': '分鐘',
    'zh-CN': '分钟',
    'en': 'minutes'
  },
  'profile.stats.studyTime.hours': {
    'zh-TW': '約 {hours} 小時',
    'zh-CN': '约 {hours} 小时',
    'en': 'about {hours} hours'
  },
  'profile.stats.totalScore': {
    'zh-TW': '總積分',
    'zh-CN': '总积分',
    'en': 'Total score'
  },
  'profile.stats.badgeInfo': {
    'zh-TW': '完成更多題目以解鎖成就',
    'zh-CN': '完成更多题目以解锁成就',
    'en': 'Complete more exercises to unlock achievements'
  },
  'profile.sectionTitle': {
    'zh-TW': '個人資料',
    'zh-CN': '个人资料',
    'en': 'Profile'
  },
  'profile.sectionHint': {
    'zh-TW': '這些資訊只會在本訓練營內使用',
    'zh-CN': '这些资讯只会在本训练营内使用',
    'en': 'This information is only used within this training camp.'
  },
  'profile.displayName': {
    'zh-TW': '顯示名稱',
    'zh-CN': '显示名称',
    'en': 'Display name'
  },
  'profile.displayName.placeholder': {
    'zh-TW': '想讓同學看到的名稱',
    'zh-CN': '想让同学看到的名称',
    'en': 'Name shown to other learners'
  },
  'profile.location': {
    'zh-TW': '所在地',
    'zh-CN': '所在地',
    'en': 'Location'
  },
  'profile.location.placeholder': {
    'zh-TW': '例如：香港 / 九龍 / 新界',
    'zh-CN': '例如：香港 / 九龙 / 新界',
    'en': 'e.g. Hong Kong / Kowloon / NT'
  },
  'profile.phone': {
    'zh-TW': '聯絡電話（選填）',
    'zh-CN': '联系电话（选填）',
    'en': 'Phone (optional)'
  },
  'profile.phone.placeholder': {
    'zh-TW': '只作通知用途，不會公開',
    'zh-CN': '仅作通知用途，不会公开',
    'en': 'For notifications only, not public'
  },
  'profile.birth': {
    'zh-TW': '生日（選填）',
    'zh-CN': '生日（选填）',
    'en': 'Birthday (optional)'
  },
  'profile.bio': {
    'zh-TW': '個人簡介',
    'zh-CN': '个人简介',
    'en': 'Bio'
  },
  'profile.bio.placeholder': {
    'zh-TW': '簡單介紹自己，例如對 SQL / Python 的興趣或目標。',
    'zh-CN': '简单介绍自己，例如对 SQL / Python 的兴趣或目标。',
    'en': 'Briefly introduce yourself, e.g. your goals or interest in SQL/Python.'
  },
  'profile.tip': {
    'zh-TW': '小提示：你可以在任意頁面右下角點擊 🤖，請 AI 幫你規劃專屬 SQL 學習路線。',
    'zh-CN': '小提示：你可以在任意页面右下角点击 🤖，请 AI 帮你规划专属 SQL 学习路线。',
    'en': 'Tip: Click 🤖 at the bottom-right on any page to let AI plan your SQL learning path.'
  },
  'profile.save': {
    'zh-TW': '儲存個人資料',
    'zh-CN': '储存个人资料',
    'en': 'Save profile'
  },

  // 用戶中心 toast / 提示訊息
  'user.toast.login.missing': {
    'zh-TW': '請輸入用戶名 / 電郵和密碼',
    'zh-CN': '请输入用户名 / 邮箱和密码',
    'en': 'Please enter username/email and password.'
  },
  'user.toast.login.success': {
    'zh-TW': '登入成功，歡迎回來！',
    'zh-CN': '登录成功，欢迎回来！',
    'en': 'Signed in successfully, welcome back!'
  },
  'user.toast.login.fail': {
    'zh-TW': '登入失敗，請檢查帳號或密碼。',
    'zh-CN': '登录失败，请检查帐号或密码。',
    'en': 'Sign-in failed. Please check your credentials.'
  },
  'user.toast.register.missing': {
    'zh-TW': '請完整填寫用戶名、電郵與密碼。',
    'zh-CN': '请完整填写用户名、邮箱与密码。',
    'en': 'Please fill in username, email, and password.'
  },
  'user.toast.register.passwordMismatch': {
    'zh-TW': '兩次輸入的密碼不一致。',
    'zh-CN': '两次输入的密码不一致。',
    'en': 'The two passwords do not match.'
  },
  'user.toast.register.success': {
    'zh-TW': '註冊成功，已自動登入。',
    'zh-CN': '注册成功，已自动登录。',
    'en': 'Registered successfully and signed in.'
  },
  'user.toast.error.network': {
    'zh-TW': '請求失敗，請稍後再試。',
    'zh-CN': '请求失败，请稍后再试。',
    'en': 'Request failed, please try again later.'
  },
  'user.toast.profile.saved': {
    'zh-TW': '個人資料已更新。',
    'zh-CN': '个人资料已更新。',
    'en': 'Profile updated.'
  },
  'user.toast.logout.success': {
    'zh-TW': '已登出，期待你下次回來學習。',
    'zh-CN': '已登出，期待你下次回来学习。',
    'en': 'Signed out. See you next time!'
  },
  'user.toast.progress.syncSuccess': {
    'zh-TW': '學習進度已同步。',
    'zh-CN': '学习进度已同步。',
    'en': 'Learning progress synchronized.'
  },
  'user.toast.progress.syncFail': {
    'zh-TW': '同步學習進度失敗，請稍後再試。',
    'zh-CN': '同步学习进度失败，请稍后再试。',
    'en': 'Failed to sync progress. Please try again later.'
  }
};

function getCurrentLang() {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  if (stored && ['zh-TW', 'zh-CN', 'en'].includes(stored)) return stored;
  return DEFAULT_LANG;
}

function setCurrentLang(lang) {
  if (!['zh-TW', 'zh-CN', 'en'].includes(lang)) lang = DEFAULT_LANG;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
}

function t(key) {
  const lang = getCurrentLang();
  const dict = i18nDict[key];
  if (!dict) return key;
  return dict[lang] || dict[DEFAULT_LANG] || key;
}

function applyLanguage(lang) {
  if (!['zh-TW', 'zh-CN', 'en'].includes(lang)) lang = DEFAULT_LANG;

  // 更新所有有 data-i18n-key 的元素
  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-key');
    const dict = i18nDict[key];
    if (dict && dict[lang]) {
      el.textContent = dict[lang];
    }
  });

  // 更新下拉選單顯示
  const select = document.getElementById('lang-switcher');
  if (select) {
    select.value = lang;
  }

  document.documentElement.setAttribute('data-lang', lang);
}

function initLanguage() {
  const lang = getCurrentLang();
  applyLanguage(lang);
}

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();

  const select = document.getElementById('lang-switcher');
  if (select) {
    select.addEventListener('change', (e) => {
      const lang = e.target.value;
      setCurrentLang(lang);
      applyLanguage(lang);
    });
  }
});


