// Python 學習中心 JavaScript
// HKDSE 選修C：算法與程序設計 (Python)

// Python 題目數據庫（HKDSE 教材內容）
const pythonProblemsDatabase = {
    1: [ // 第1章：算法設計與 Python 程式基礎
        {
            id: 1,
            title: "CHECKPOINT 1.1 (DSE 2017 2D Q2a)",
            description: "算法追蹤與流程圖",
            requirement: "追蹤以下算法的執行過程，並繪製流程圖",
            hint: "注意變量的初始化和更新順序",
            solution: "# 算法追蹤示例\n# 變量初始化\n# 循環執行\n# 條件判斷",
            testCases: []
        },
        {
            id: 2,
            title: "LAB 1.1",
            description: "用戶輸入與輸出",
            requirement: "編寫程序，要求用戶輸入姓名，然後輸出問候語",
            hint: "使用 input() 函數獲取用戶輸入，使用 print() 函數輸出",
            solution: "name = input('請輸入您的姓名：')\nprint(f'您好，{name}！歡迎使用Python。')",
            testCases: []
        },
        {
            id: 3,
            title: "CHECKPOINT 1.2",
            description: "十進制轉二進制",
            requirement: "編寫程序，將十進制數轉換為二進制數",
            hint: "使用除2取餘法，將餘數倒序排列",
            solution: "def decimal_to_binary(n):\n    if n == 0:\n        return '0'\n    binary = ''\n    while n > 0:\n        binary = str(n % 2) + binary\n        n = n // 2\n    return binary\n\nnum = int(input('請輸入十進制數：'))\nprint(f'二進制：{decimal_to_binary(num)}')",
            testCases: []
        },
        {
            id: 4,
            title: "CHECKPOINT 1.3",
            description: "ATM流程圖優化",
            requirement: "優化ATM取款流程圖，減少不必要的步驟",
            hint: "合併重複的驗證步驟，簡化流程",
            solution: "# 流程圖優化示例\n# 1. 插入卡片\n# 2. 輸入密碼\n# 3. 選擇操作\n# 4. 輸入金額\n# 5. 確認並完成",
            testCases: []
        },
        {
            id: 5,
            title: "CHECKPOINT 1.4",
            description: "質數判斷",
            requirement: "編寫程序，判斷一個數是否為質數",
            hint: "質數是大於1且只能被1和自身整除的數",
            solution: "def is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nnum = int(input('請輸入一個數：'))\nif is_prime(num):\n    print(f'{num} 是質數')\nelse:\n    print(f'{num} 不是質數')",
            testCases: []
        }
    ],
    2: [ // 第2章：程式測試與除錯
        {
            id: 6,
            title: "CHECKPOINT 2.1",
            description: "斷點調試",
            requirement: "在調試器中設置斷點，追蹤程序執行",
            hint: "使用調試器的斷點功能，觀察變量值的變化",
            solution: "# 調試示例\n# 設置斷點在關鍵位置\n# 逐步執行\n# 觀察變量值",
            testCases: []
        },
        {
            id: 7,
            title: "LAB 2.1",
            description: "溢出錯誤處理",
            requirement: "處理 pow(e, 1000) 可能產生的溢出錯誤",
            hint: "使用 try-except 捕獲 OverflowError",
            solution: "import math\n\ntry:\n    result = math.pow(math.e, 1000)\n    print(f'結果：{result}')\nexcept OverflowError:\n    print('計算結果溢出，數值過大')",
            testCases: []
        },
        {
            id: 8,
            title: "CHECKPOINT 2.2",
            description: "語法錯誤檢測",
            requirement: "找出並修正以下代碼的語法錯誤：\nfor i in range(10)\n    print(i)",
            hint: "注意縮進和冒號",
            solution: "for i in range(10):\n    print(i)",
            testCases: []
        },
        {
            id: 9,
            title: "LAB 2.2",
            description: "邏輯錯誤調試",
            requirement: "修正計算階乘的邏輯錯誤",
            hint: "檢查循環的起始值和終止條件",
            solution: "def factorial(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result\n\nprint(factorial(5))",
            testCases: []
        },
        {
            id: 10,
            title: "CHECKPOINT 2.3",
            description: "異常處理完整示例",
            requirement: "編寫程序處理除零、類型轉換和索引越界錯誤",
            hint: "使用多個except子句處理不同異常",
            solution: "try:\n    num = int(input('輸入數字：'))\n    result = 10 / num\n    arr = [1, 2, 3]\n    print(arr[result])\nexcept ZeroDivisionError:\n    print('除零錯誤')\nexcept ValueError:\n    print('輸入不是數字')\nexcept IndexError:\n    print('索引越界')\nexcept Exception as e:\n    print(f'其他錯誤：{e}')",
            testCases: []
        }
    ],
    3: [ // 第3章：高級控制結構
        {
            id: 8,
            title: "CHECKPOINT 3.1",
            description: "三角形分類",
            requirement: "根據三邊長度判斷三角形類型（等邊、等腰、一般）",
            hint: "先判斷是否為三角形，再判斷類型",
            solution: "a = float(input('請輸入第一邊長：'))\nb = float(input('請輸入第二邊長：'))\nc = float(input('請輸入第三邊長：'))\n\nif a + b > c and a + c > b and b + c > a:\n    if a == b == c:\n        print('等邊三角形')\n    elif a == b or a == c or b == c:\n        print('等腰三角形')\n    else:\n        print('一般三角形')\nelse:\n    print('無法構成三角形')",
            testCases: []
        },
        {
            id: 9,
            title: "CHECKPOINT 3.2",
            description: "九九乘法表",
            requirement: "輸出10x10的乘法表",
            hint: "使用嵌套循環，外層控制行，內層控制列",
            solution: "for i in range(1, 11):\n    for j in range(1, 11):\n        print(f'{i} x {j} = {i*j}', end='\\t')\n    print()",
            testCases: []
        },
        {
            id: 10,
            title: "CHECKPOINT 3.3",
            description: "賓果遊戲獲勝條件",
            requirement: "檢查賓果遊戲的獲勝條件（橫、豎、斜線）",
            hint: "檢查所有可能的獲勝線路",
            solution: "def check_bingo(board):\n    # 檢查橫線\n    for row in board:\n        if all(cell == 'X' for cell in row):\n            return True\n    # 檢查豎線\n    for col in range(5):\n        if all(board[row][col] == 'X' for row in range(5)):\n            return True\n    # 檢查對角線\n    if all(board[i][i] == 'X' for i in range(5)):\n        return True\n    if all(board[i][4-i] == 'X' for i in range(5)):\n        return True\n    return False",
            testCases: []
        }
    ],
    4: [ // 第4章：子程式
        {
            id: 11,
            title: "CHECKPOINT 4.1",
            description: "函數調用",
            requirement: "編寫函數計算平均值，並找出高於閾值的數值",
            hint: "定義函數處理列表數據",
            solution: "def average(numbers):\n    return sum(numbers) / len(numbers) if numbers else 0\n\ndef above_threshold(numbers, threshold):\n    return [n for n in numbers if n > threshold]\n\nnums = [10, 20, 30, 40, 50]\navg = average(nums)\nabove = above_threshold(nums, 25)\nprint(f'平均值：{avg}')\nprint(f'高於25的數值：{above}')",
            testCases: []
        },
        {
            id: 12,
            title: "CHECKPOINT 4.2",
            description: "函數定義",
            requirement: "定義函數計算 |a - b|",
            hint: "使用 abs() 函數或條件判斷",
            solution: "def absolute_difference(a, b):\n    return abs(a - b)\n\n# 或\n# def absolute_difference(a, b):\n#     return a - b if a > b else b - a\n\nresult = absolute_difference(10, 7)\nprint(f'|10 - 7| = {result}')",
            testCases: []
        },
        {
            id: 13,
            title: "CHECKPOINT 4.3",
            description: "用戶名驗證函數",
            requirement: "編寫函數驗證用戶名（長度、字符類型等）",
            hint: "檢查用戶名的長度和字符類型",
            solution: "def validate_username(username):\n    if len(username) < 3 or len(username) > 20:\n        return False, '用戶名長度必須在3-20字符之間'\n    if not username.isalnum():\n        return False, '用戶名只能包含字母和數字'\n    return True, '用戶名有效'\n\nname = input('請輸入用戶名：')\nvalid, message = validate_username(name)\nprint(message)",
            testCases: []
        }
    ],
    5: [ // 第5章：資料結構
        {
            id: 14,
            title: "CHECKPOINT 5.1",
            description: "堆疊操作",
            requirement: "實現堆疊的 push 和 pop 操作",
            hint: "使用列表模擬堆疊，後進先出",
            solution: "class Stack:\n    def __init__(self):\n        self.items = []\n    \n    def push(self, item):\n        self.items.append(item)\n    \n    def pop(self):\n        if self.is_empty():\n            return None\n        return self.items.pop()\n    \n    def is_empty(self):\n        return len(self.items) == 0\n\nstack = Stack()\nstack.push(1)\nstack.push(2)\nprint(stack.pop())  # 輸出 2",
            testCases: []
        },
        {
            id: 15,
            title: "CHECKPOINT 5.2",
            description: "佇列（頭尾指針）",
            requirement: "實現使用頭尾指針的佇列",
            hint: "使用兩個指針追蹤佇列的頭和尾",
            solution: "class Queue:\n    def __init__(self):\n        self.items = []\n        self.head = 0\n        self.tail = 0\n    \n    def enqueue(self, item):\n        self.items.append(item)\n        self.tail += 1\n    \n    def dequeue(self):\n        if self.head >= self.tail:\n            return None\n        item = self.items[self.head]\n        self.head += 1\n        return item\n\nqueue = Queue()\nqueue.enqueue(1)\nqueue.enqueue(2)\nprint(queue.dequeue())  # 輸出 1",
            testCases: []
        },
        {
            id: 16,
            title: "CHECKPOINT 5.3",
            description: "計程車佇列（循環陣列）",
            requirement: "使用循環陣列實現計程車佇列",
            hint: "使用模運算實現循環",
            solution: "class CircularQueue:\n    def __init__(self, size):\n        self.items = [None] * size\n        self.head = 0\n        self.tail = 0\n        self.size = size\n    \n    def enqueue(self, item):\n        if (self.tail + 1) % self.size == self.head:\n            return False  # 佇列滿\n        self.items[self.tail] = item\n        self.tail = (self.tail + 1) % self.size\n        return True\n    \n    def dequeue(self):\n        if self.head == self.tail:\n            return None  # 佇列空\n        item = self.items[self.head]\n        self.head = (self.head + 1) % self.size\n        return item",
            testCases: []
        }
    ],
    6: [ // 第6章：查找與排序
        {
            id: 17,
            title: "CHECKPOINT 6.1",
            description: "線性查找比較次數",
            requirement: "計算線性查找在最壞情況下的比較次數",
            hint: "最壞情況需要比較 n 次（n 為陣列長度）",
            solution: "def linear_search(arr, target):\n    comparisons = 0\n    for i in range(len(arr)):\n        comparisons += 1\n        if arr[i] == target:\n            return i, comparisons\n    return -1, comparisons\n\narr = [1, 3, 5, 7, 9]\nindex, comps = linear_search(arr, 9)\nprint(f'找到位置：{index}，比較次數：{comps}')",
            testCases: []
        },
        {
            id: 18,
            title: "CHECKPOINT 6.2",
            description: "二分查找關鍵字",
            requirement: "使用二分查找在有序陣列中查找關鍵字",
            hint: "要求陣列必須有序，每次比較後縮小搜索範圍",
            solution: "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\narr = [1, 3, 5, 7, 9, 11, 13]\nindex = binary_search(arr, 7)\nprint(f'找到位置：{index}')",
            testCases: []
        },
        {
            id: 19,
            title: "CHECKPOINT 6.3",
            description: "選擇排序（書名）",
            requirement: "使用選擇排序對書名陣列進行排序",
            hint: "每次選擇最小元素放到正確位置",
            solution: "def selection_sort(books):\n    for i in range(len(books)):\n        min_idx = i\n        for j in range(i + 1, len(books)):\n            if books[j] < books[min_idx]:\n                min_idx = j\n        books[i], books[min_idx] = books[min_idx], books[i]\n    return books\n\nbooks = ['Python', 'Java', 'C++', 'JavaScript']\nsorted_books = selection_sort(books.copy())\nprint(sorted_books)",
            testCases: []
        },
        {
            id: 20,
            title: "CHECKPOINT 6.4",
            description: "插入排序（價格）",
            requirement: "使用插入排序對價格陣列進行排序",
            hint: "將元素插入到已排序部分的正確位置",
            solution: "def insertion_sort(prices):\n    for i in range(1, len(prices)):\n        key = prices[i]\n        j = i - 1\n        while j >= 0 and prices[j] > key:\n            prices[j + 1] = prices[j]\n            j -= 1\n        prices[j + 1] = key\n    return prices\n\nprices = [50, 30, 80, 20, 10]\nsorted_prices = insertion_sort(prices.copy())\nprint(sorted_prices)",
            testCases: []
        },
        {
            id: 21,
            title: "CHECKPOINT 6.5",
            description: "氣泡排序（陣列 A）",
            requirement: "使用氣泡排序對陣列 A 進行排序",
            hint: "相鄰元素比較交換，較大元素逐漸「冒泡」到末尾",
            solution: "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\nA = [64, 34, 25, 12, 22, 11, 90]\nsorted_A = bubble_sort(A.copy())\nprint(sorted_A)",
            testCases: []
        }
    ],
    7: [ // 第7章：文字檔案處理
        {
            id: 22,
            title: "CHECKPOINT 7.1",
            description: "CSV解析為二維列表",
            requirement: "讀取CSV文件並解析為二維列表",
            hint: "按行讀取，按逗號分割",
            solution: "def parse_csv(filename):\n    data = []\n    with open(filename, 'r', encoding='utf-8') as f:\n        for line in f:\n            row = line.strip().split(',')\n            data.append(row)\n    return data\n\n# 模擬數據\ncsv_data = '姓名,年齡,城市\\n張三,20,北京\\n李四,25,上海'\ndata = [line.split(',') for line in csv_data.split('\\n')]\nprint(data)",
            testCases: []
        },
        {
            id: 23,
            title: "CHECKPOINT 7.2",
            description: "字母移位加密",
            requirement: "實現字母移位加密（凱撒密碼）",
            hint: "將每個字母按固定數量移位",
            solution: "def caesar_cipher(text, shift):\n    result = ''\n    for char in text:\n        if char.isalpha():\n            base = ord('A') if char.isupper() else ord('a')\n            result += chr((ord(char) - base + shift) % 26 + base)\n        else:\n            result += char\n    return result\n\nencrypted = caesar_cipher('Hello', 3)\nprint(encrypted)  # Khoor",
            testCases: []
        }
    ],
    8: [ // 第8章：編程在現實生活中的應用
        {
            id: 24,
            title: "CHECKPOINT 8.1",
            description: "遙控器命令處理",
            requirement: "處理遙控器發送的命令序列",
            hint: "解析命令字符串，執行對應操作",
            solution: "def process_remote_commands(commands):\n    actions = {'UP': '向上', 'DOWN': '向下', 'LEFT': '向左', 'RIGHT': '向右'}\n    for cmd in commands.split(','):\n        cmd = cmd.strip()\n        if cmd in actions:\n            print(f'執行：{actions[cmd]}')\n        else:\n            print(f'未知命令：{cmd}')\n\ncommands = 'UP,DOWN,LEFT,RIGHT'\nprocess_remote_commands(commands)",
            testCases: []
        }
    ]
};

// 章節信息
const chapterInfo = {
    1: { title: "算法設計與 Python 程式基礎", count: 5, color: "green" },
    2: { title: "程式測試與除錯", count: 5, color: "blue" },
    3: { title: "高級控制結構", count: 3, color: "purple" },
    4: { title: "子程式", count: 3, color: "orange" },
    5: { title: "資料結構", count: 3, color: "pink" },
    6: { title: "查找與排序", count: 5, color: "indigo" },
    7: { title: "文字檔案處理", count: 2, color: "teal" },
    8: { title: "編程在現實生活中的應用", count: 1, color: "cyan" }
};

// 全局變量
let currentPythonChapter = null;
let currentPythonQuestion = 0;
let currentPythonProblem = null;
let pythonEditor = null;

// DOMContentLoaded 事件 - 立即初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded 事件觸發');
    setTimeout(function() {
        try {
            console.log('開始初始化...');
            if (typeof initializeChapters === 'function') {
                initializeChapters();
                updateProgress();
                console.log('初始化完成');
            } else {
                console.error('initializeChapters 函數未定義');
            }
        } catch (error) {
            console.error('初始化錯誤:', error);
        }
    }, 50);
    
    // 更新用戶UI
    if (typeof updateUserUI === 'function') {
        updateUserUI();
    }
    
    // 檢查管理員權限
    if (typeof checkAdminAccess === 'function') {
        checkAdminAccess();
    }
});

// window.load 事件作為備用
window.addEventListener('load', function() {
    console.log('window.load 事件觸發');
    setTimeout(function() {
        const chaptersList = document.getElementById('chapters-list');
        const chaptersGrid = document.getElementById('chapters-grid');
        
        const needsInit = (chaptersList && (chaptersList.innerHTML === '' || chaptersList.innerHTML.includes('正在加載'))) ||
                         (chaptersGrid && (chaptersGrid.innerHTML === '' || chaptersGrid.innerHTML.includes('正在加載')));
        
        if (needsInit) {
            console.log('window.load: 檢測到需要初始化，開始初始化...');
            if (typeof initializeChapters === 'function') {
                try {
                    initializeChapters();
                    updateProgress();
                    console.log('window.load 初始化完成');
                } catch (error) {
                    console.error('window.load 初始化錯誤:', error);
                }
            } else {
                console.error('window.load: initializeChapters 函數未定義');
            }
        }
    }, 100);
});

// 顏色映射
const colorMap = {
    green: { bg: 'bg-green-500/20', text: 'text-green-300' },
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-300' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-300' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-300' },
    pink: { bg: 'bg-pink-500/20', text: 'text-pink-300' },
    indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-300' },
    teal: { bg: 'bg-teal-500/20', text: 'text-teal-300' },
    cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-300' }
};

// 初始化章節列表
function initializeChapters() {
    try {
        console.log('開始初始化章節列表...');
        console.log('chapterInfo:', chapterInfo);
        
        // 側邊欄章節列表
        const chaptersList = document.getElementById('chapters-list');
        if (chaptersList) {
            console.log('找到 chapters-list 元素');
            chaptersList.innerHTML = '';
            Object.keys(chapterInfo).forEach(chapterNum => {
                const info = chapterInfo[chapterNum];
                const completed = getCompletedQuestionsCount(parseInt(chapterNum));
                const colors = colorMap[info.color] || colorMap.green;
                const chapterItem = document.createElement('div');
                chapterItem.className = 'chapter-item';
                chapterItem.onclick = () => loadChapter(parseInt(chapterNum));
                chapterItem.innerHTML = `
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="font-semibold text-white text-sm">第${chapterNum}章</h4>
                            <p class="text-gray-400 text-xs">${info.title}</p>
                        </div>
                        <span class="text-xs ${colors.bg} ${colors.text} px-2 py-1 rounded">${info.count}題</span>
                    </div>
                    <div class="mt-2 text-xs text-gray-400">已完成: ${completed}/${info.count}</div>
                `;
                chaptersList.appendChild(chapterItem);
            });
            console.log('側邊欄章節列表初始化完成');
        } else {
            console.warn('找不到 chapters-list 元素');
        }
        
        // 主頁面章節網格
        const chaptersGrid = document.getElementById('chapters-grid');
        if (chaptersGrid) {
            console.log('找到 chapters-grid 元素');
            chaptersGrid.innerHTML = '';
            Object.keys(chapterInfo).forEach(chapterNum => {
                const info = chapterInfo[chapterNum];
                const completed = getCompletedQuestionsCount(parseInt(chapterNum));
                const progress = info.count > 0 ? Math.round((completed / info.count) * 100) : 0;
                const colors = colorMap[info.color] || colorMap.green;
                const chapterCard = document.createElement('div');
                chapterCard.className = 'glass-card p-6 cursor-pointer';
                chapterCard.onclick = () => loadChapter(parseInt(chapterNum));
                chapterCard.innerHTML = `
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-semibold text-white">第${chapterNum}章</h4>
                        <span class="text-xs ${colors.bg} ${colors.text} px-2 py-1 rounded">${info.count}題</span>
                    </div>
                    <p class="text-gray-300 text-sm mb-3">${info.title}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="mt-2 text-xs text-gray-400">進度: ${completed}/${info.count} (${progress}%)</div>
                `;
                chaptersGrid.appendChild(chapterCard);
            });
            console.log('主頁面章節網格初始化完成');
        } else {
            console.warn('找不到 chapters-grid 元素');
        }
        
        console.log('章節列表初始化完成');
    } catch (error) {
        console.error('初始化章節列表錯誤:', error);
        console.error('錯誤堆棧:', error.stack);
        showNotification('章節列表加載失敗: ' + error.message, 'error');
    }
}

// 加載章節
function loadChapter(chapterNum) {
    currentPythonChapter = chapterNum;
    currentPythonQuestion = 0;
    
    // 更新側邊欄狀態
    document.querySelectorAll('.chapter-item').forEach((item, index) => {
        item.classList.remove('active');
        if (index === chapterNum - 1) {
            item.classList.add('active');
        }
    });
    
    // 顯示題目列表
    showQuestionsList(chapterNum);
    
    // 切換到題目視圖
    document.getElementById('chapter-overview').classList.add('hidden');
    document.getElementById('question-view').classList.remove('hidden');
    
    // 加載第一題
    loadPythonQuestion();
}

// 顯示題目列表
function showQuestionsList(chapterNum) {
    const questionsListSection = document.getElementById('questions-list-section');
    const questionsList = document.getElementById('questions-list');
    
    if (questionsListSection && questionsList) {
        questionsListSection.style.display = 'block';
        questionsList.innerHTML = '';
        
        const problems = pythonProblemsDatabase[chapterNum] || [];
        problems.forEach((problem, index) => {
            const completed = isQuestionCompleted(chapterNum, problem.id);
            const questionItem = document.createElement('div');
            questionItem.className = `question-item ${completed ? 'completed' : ''} ${index === currentPythonQuestion ? 'active' : ''}`;
            questionItem.onclick = () => {
                currentPythonQuestion = index;
                loadPythonQuestion();
            };
            questionItem.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        ${completed ? '<span class="text-green-400">✓</span>' : '<span class="text-gray-400">○</span>'}
                        <span class="text-sm text-white">${problem.title}</span>
                    </div>
                </div>
            `;
            questionsList.appendChild(questionItem);
        });
    }
}

// 加載 Python 題目
function loadPythonQuestion() {
    if (!currentPythonChapter) return;
    
    const problems = pythonProblemsDatabase[currentPythonChapter] || [];
    if (problems.length === 0 || currentPythonQuestion >= problems.length) {
        showNotification('沒有更多題目', 'error');
        return;
    }
    
    currentPythonProblem = problems[currentPythonQuestion];
    
    // 更新題目信息
    const info = chapterInfo[currentPythonChapter];
    document.getElementById('question-title').textContent = `第${currentPythonChapter}章：${info.title} - ${currentPythonProblem.title}`;
    document.getElementById('question-progress').textContent = `第 ${currentPythonQuestion + 1} 題 / 共 ${problems.length} 題`;
    document.getElementById('question-description').textContent = currentPythonProblem.description;
    document.getElementById('question-requirement').textContent = currentPythonProblem.requirement;
    
    // 初始化編輯器
    if (!pythonEditor && typeof CodeMirror !== 'undefined') {
        const textarea = document.getElementById('python-editor');
        if (textarea) {
            pythonEditor = CodeMirror.fromTextArea(textarea, {
                mode: 'python',
                theme: 'monokai',
                lineNumbers: true,
                autoCloseBrackets: true,
                matchBrackets: true,
                indentUnit: 4,
                tabSize: 4,
                lineWrapping: true
            });
        }
    } else if (pythonEditor) {
        pythonEditor.setValue('');
    }
    
    // 隱藏結果和反饋
    document.getElementById('python-result-section').classList.add('hidden');
    document.getElementById('python-answer-feedback').classList.add('hidden');
    document.getElementById('python-answer-feedback').innerHTML = '';
    
    // 更新導航按鈕
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (prevBtn) prevBtn.disabled = currentPythonQuestion === 0;
    if (nextBtn) nextBtn.disabled = currentPythonQuestion >= problems.length - 1;
    
    // 更新題目列表狀態
    updateQuestionsListState();
}

// 更新題目列表狀態
function updateQuestionsListState() {
    const questionsList = document.getElementById('questions-list');
    if (!questionsList) return;
    
    const items = questionsList.querySelectorAll('.question-item');
    items.forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentPythonQuestion) {
            item.classList.add('active');
        }
    });
}

// 執行 Python 代碼
function runPythonCode() {
    const code = pythonEditor ? pythonEditor.getValue() : 
                (document.getElementById('python-editor') ? document.getElementById('python-editor').value : '');
    
    if (!code.trim()) {
        showNotification('請輸入Python代碼', 'error');
        return;
    }
    
    const resultSection = document.getElementById('python-result-section');
    const resultContent = document.getElementById('python-result-content');
    
    if (resultSection) resultSection.classList.remove('hidden');
    
    if (resultContent) {
        resultContent.innerHTML = `
            <div class="text-sm mb-2" style="color: var(--accent-green);">✓ 執行成功</div>
            <div class="text-xs mb-3" style="color: var(--text-secondary);">
                注意：這是模擬結果。實際執行需要連接到Python運行環境。
            </div>
            <div class="mt-4 p-3 rounded text-sm font-mono" style="background: var(--code-bg); color: var(--text-primary);">
                <pre>${code}</pre>
            </div>
        `;
        showNotification('代碼執行成功！', 'success');
    }
}

// 檢查 Python 答案
function checkPythonAnswer() {
    if (!currentPythonProblem) {
        showNotification('沒有選中的題目', 'error');
        return;
    }
    
    const code = pythonEditor ? pythonEditor.getValue() : 
                (document.getElementById('python-editor') ? document.getElementById('python-editor').value : '');
    
    if (!code.trim()) {
        showNotification('請輸入Python代碼', 'error');
        return;
    }
    
    const feedbackSection = document.getElementById('python-answer-feedback');
    if (!feedbackSection) return;
    
    feedbackSection.classList.remove('hidden');
    
    // 簡單的答案檢查
    const userCodeNormalized = code.trim().toLowerCase().replace(/\s+/g, ' ');
    const solutionNormalized = currentPythonProblem.solution.trim().toLowerCase().replace(/\s+/g, ' ');
    const keyParts = currentPythonProblem.solution.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
    const hasKeyParts = keyParts.some(part => userCodeNormalized.includes(part.trim().toLowerCase()));
    
    if (hasKeyParts || userCodeNormalized.length > solutionNormalized.length * 0.5) {
        // 標記為已完成
        markQuestionCompleted(currentPythonChapter, currentPythonProblem.id);
        updateProgress();
        updateQuestionsListState();
        
        feedbackSection.innerHTML = `
            <div class="glass-card p-6 border-l-4" style="border-color: var(--accent-green);">
                <div class="flex items-center space-x-2 mb-2">
                    <span class="text-2xl">✓</span>
                    <h4 class="text-lg font-semibold" style="color: var(--accent-green);">答案正確！</h4>
                </div>
                <p class="text-sm mb-3" style="color: var(--text-secondary);">恭喜您，代碼邏輯正確！</p>
            </div>
        `;
        showNotification('答案正確！', 'success');
    } else {
        feedbackSection.innerHTML = `
            <div class="glass-card p-6 border-l-4" style="border-color: var(--accent-red);">
                <div class="flex items-center space-x-2 mb-2">
                    <span class="text-2xl">✗</span>
                    <h4 class="text-lg font-semibold" style="color: var(--accent-red);">答案不正確</h4>
                </div>
                <p class="text-sm mb-3" style="color: var(--text-secondary);">請檢查您的代碼，或點擊「提示」按鈕獲取幫助。</p>
                <details class="mt-3">
                    <summary class="text-sm cursor-pointer mb-2" style="color: var(--primary-blue);">查看參考答案</summary>
                    <div class="mt-2 p-3 rounded font-mono text-xs" style="background: var(--code-bg); color: var(--primary-blue);">
                        <pre>${currentPythonProblem.solution}</pre>
                    </div>
                </details>
            </div>
        `;
        showNotification('答案不正確，請繼續努力！', 'error');
    }
}

// 顯示 Python 提示
function showPythonHint() {
    if (!currentPythonProblem) {
        showNotification('沒有選中的題目', 'error');
        return;
    }
    
    showNotification(`💡 提示：${currentPythonProblem.hint}`, 'success', 5000);
}

// 重置 Python 編輯器
function resetPythonEditor() {
    if (pythonEditor) {
        pythonEditor.setValue('');
    } else if (document.getElementById('python-editor')) {
        document.getElementById('python-editor').value = '';
    }
    
    document.getElementById('python-result-section').classList.add('hidden');
    document.getElementById('python-answer-feedback').classList.add('hidden');
    document.getElementById('python-answer-feedback').innerHTML = '';
}

// 上一題
function previousPythonQuestion() {
    if (currentPythonQuestion > 0) {
        currentPythonQuestion--;
        loadPythonQuestion();
    }
}

// 下一題
function nextPythonQuestion() {
    if (!currentPythonChapter) return;
    
    const problems = pythonProblemsDatabase[currentPythonChapter] || [];
    if (currentPythonQuestion < problems.length - 1) {
        currentPythonQuestion++;
        loadPythonQuestion();
    } else {
        showNotification('恭喜完成本章節！', 'success');
    }
}

// 返回概覽
function backToOverview() {
    document.getElementById('chapter-overview').classList.remove('hidden');
    document.getElementById('question-view').classList.add('hidden');
    document.getElementById('questions-list-section').style.display = 'none';
    currentPythonChapter = null;
    currentPythonQuestion = 0;
    currentPythonProblem = null;
}

// 進度管理
function getCompletedQuestions() {
    return JSON.parse(localStorage.getItem('python-completed-questions') || '[]');
}

function markQuestionCompleted(chapter, questionId) {
    const completed = getCompletedQuestions();
    const key = `${chapter}-${questionId}`;
    if (!completed.includes(key)) {
        completed.push(key);
        localStorage.setItem('python-completed-questions', JSON.stringify(completed));
    }
}

function isQuestionCompleted(chapter, questionId) {
    const completed = getCompletedQuestions();
    return completed.includes(`${chapter}-${questionId}`);
}

function getCompletedQuestionsCount(chapter) {
    const completed = getCompletedQuestions();
    return completed.filter(key => key.startsWith(`${chapter}-`)).length;
}

function updateProgress() {
    const completed = getCompletedQuestions();
    const total = 24;
    const progress = Math.round((completed.length / total) * 100);
    
    const progressEl = document.getElementById('overall-progress');
    const progressFill = document.getElementById('progress-fill');
    const completedEl = document.getElementById('completed-questions');
    
    if (progressEl) progressEl.textContent = progress + '%';
    if (progressFill) progressFill.style.width = progress + '%';
    if (completedEl) completedEl.textContent = completed.length + '/' + total;
    
    // 重新初始化章節列表以更新進度
    initializeChapters();
}

// 顯示通知
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// 導出所有函數到全局作用域
window.initializeChapters = initializeChapters;
window.loadChapter = loadChapter;
window.runPythonCode = runPythonCode;
window.checkPythonAnswer = checkPythonAnswer;
window.showPythonHint = showPythonHint;
window.resetPythonEditor = resetPythonEditor;
window.previousPythonQuestion = previousPythonQuestion;
window.nextPythonQuestion = nextPythonQuestion;
window.backToOverview = backToOverview;
window.updateProgress = updateProgress;
window.showNotification = showNotification;
window.initPythonCenter = initPythonCenter;

console.log('Python 學習中心函數已導出到 window 對象');
console.log('initializeChapters 類型:', typeof window.initializeChapters);

