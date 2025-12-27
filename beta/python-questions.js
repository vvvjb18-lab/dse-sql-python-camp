// Python题库 - 100道题目
const pythonQuestions = {
    questions: [
        {
            id: 1,
            title: "Python基础语法",
            description: "以下哪个是Python的正确注释符号？",
            type: "multiple-choice",
            options: [
                "// 单行注释",
                "# 单行注释",
                "/* 多行注释 */",
                "-- 单行注释"
            ],
            correct: 1,
            difficulty: "easy",
            category: "基础语法",
            explanation: "Python使用#符号进行单行注释，多行注释使用'''或\"\"\""。
        },
        {
            id: 2,
            title: "数据类型识别",
            description: "表达式 type(3.14) 的返回值是什么？",
            type: "multiple-choice",
            options: [
                "<class 'int'>",
                "<class 'float'>",
                "<class 'str'>",
                "<class 'double'>"
            ],
            correct: 1,
            difficulty: "easy",
            category: "数据类型",
            explanation: "3.14是一个浮点数，因此type(3.14)返回<class 'float'>。"
        },
        {
            id: 3,
            title: "变量命名规则",
            description: "以下哪个是合法的Python变量名？",
            type: "multiple-choice",
            options: [
                "2_variable",
                "my-variable",
                "_my_var",
                "class"
            ],
            correct: 2,
            difficulty: "easy",
            category: "变量命名",
            explanation: "Python变量名必须以字母或下划线开头，不能包含特殊字符，不能使用关键字。"
        },
        {
            id: 4,
            title: "列表操作",
            description: "执行以下代码后，list1的值是什么？\nlist1 = [1, 2, 3]\nlist1.append(4)",
            type: "multiple-choice",
            options: [
                "[1, 2, 3]",
                "[4, 1, 2, 3]",
                "[1, 2, 3, 4]",
                "[1, 2, 4, 3]"
            ],
            correct: 2,
            difficulty: "easy",
            category: "列表操作",
            explanation: "append()方法将元素添加到列表末尾。"
        },
        {
            id: 5,
            title: "字符串操作",
            description: "表达式 'Hello' + ' World' 的结果是什么？",
            type: "multiple-choice",
            options: [
                "'HelloWorld'",
                "'Hello World'",
                "'Hello+World'",
                "错误"
            ],
            correct: 1,
            difficulty: "easy",
            category: "字符串",
            explanation: "+运算符用于字符串拼接，会在两个字符串之间添加空格。"
        },
        {
            id: 6,
            title: "条件语句",
            description: "以下哪个是正确的if语句格式？",
            type: "multiple-choice",
            options: [
                "if x > 5 then print('x>5')",
                "if (x > 5): print('x>5')",
                "if x > 5:\n    print('x>5')",
                "if x > 5 print('x>5')"
            ],
            correct: 2,
            difficulty: "easy",
            category: "条件语句",
            explanation: "Python的if语句需要冒号结尾，并且代码块需要缩进。"
        },
        {
            id: 7,
            title: "循环结构",
            description: "以下哪个循环会执行5次？",
            type: "multiple-choice",
            options: [
                "for i in range(4):",
                "for i in range(5):",
                "for i in range(6):",
                "for i in range(0, 4):"
            ],
            correct: 1,
            difficulty: "easy",
            category: "循环",
            explanation: "range(5)生成0,1,2,3,4，共5个数字，因此循环执行5次。"
        },
        {
            id: 8,
            title: "函数定义",
            description: "以下哪个是正确的函数定义？",
            type: "multiple-choice",
            options: [
                "def myFunction():",
                "function myFunction():",
                "define myFunction():",
                "myFunction() = def:"
            ],
            correct: 0,
            difficulty: "easy",
            category: "函数",
            explanation: "Python使用def关键字定义函数，后跟函数名和括号。"
        },
        {
            id: 9,
            title: "字典操作",
            description: "如何访问字典person = {'name': 'Alice', 'age': 25}中的姓名？",
            type: "multiple-choice",
            options: [
                "person[0]",
                "person.name",
                "person['name']",
                "person(1)"
            ],
            correct: 2,
            difficulty: "easy",
            category: "字典",
            explanation: "字典使用键来访问值，语法为dict['key']。"
        },
        {
            id: 10,
            title: "布尔运算",
            description: "表达式 True and False 的结果是什么？",
            type: "multiple-choice",
            options: [
                "True",
                "False",
                "None",
                "Error"
            ],
            correct: 1,
            difficulty: "easy",
            category: "布尔运算",
            explanation: "and运算只有两个操作数都为True时才返回True。"
        },
        {
            id: 11,
            title: "列表索引",
            description: "对于列表lst = [10, 20, 30, 40, 50]，lst[-1]的值是什么？",
            type: "multiple-choice",
            options: [
                "10",
                "50",
                "40",
                "索引错误"
            ],
            correct: 1,
            difficulty: "medium",
            category: "列表索引",
            explanation: "负数索引从列表末尾开始计数，-1表示最后一个元素。"
        },
        {
            id: 12,
            title: "字符串方法",
            description: "表达式 'hello'.upper() 的结果是什么？",
            type: "multiple-choice",
            options: [
                "'HELLO'",
                "'hello'",
                "'Hello'",
                "错误"
            ],
            correct: 0,
            difficulty: "easy",
            category: "字符串方法",
            explanation: "upper()方法将字符串中的所有字母转换为大写。"
        },
        {
            id: 13,
            title: "range函数",
            description: "range(1, 10, 2)生成的序列是什么？",
            type: "multiple-choice",
            options: [
                "[1, 2, 3, 4, 5, 6, 7, 8, 9]",
                "[1, 3, 5, 7, 9]",
                "[2, 4, 6, 8]",
                "[1, 4, 7, 10]"
            ],
            correct: 1,
            difficulty: "medium",
            category: "range函数",
            explanation: "range(start, stop, step)从start开始，到stop结束（不包含），步长为step。"
        },
        {
            id: 14,
            title: "异常处理",
            description: "以下哪个是正确的异常处理结构？",
            type: "multiple-choice",
            options: [
                "try:\n    # 代码\nexcept:\n    # 处理",
                "try:\n    # 代码\ncatch:\n    # 处理",
                "try:\n    # 代码\nerror:\n    # 处理",
                "try:\n    # 代码\nfinally:\n    # 处理"
            ],
            correct: 0,
            difficulty: "medium",
            category: "异常处理",
            explanation: "Python使用try-except结构处理异常。"
        },
        {
            id: 15,
            title: "文件操作",
            description: "如何以读取模式打开文件'test.txt'？",
            type: "multiple-choice",
            options: [
                "open('test.txt', 'w')",
                "open('test.txt', 'r')",
                "open('test.txt', 'a')",
                "open('test.txt', 'x')"
            ],
            correct: 1,
            difficulty: "easy",
            category: "文件操作",
            explanation: "'r'模式表示读取，'w'表示写入，'a'表示追加。"
        },
        {
            id: 16,
            title: "列表推导式",
            description: "[x**2 for x in range(3)] 的结果是什么？",
            type: "multiple-choice",
            options: [
                "[0, 1, 2]",
                "[1, 4, 9]",
                "[0, 1, 4]",
                "[0, 1, 2, 3]"
            ],
            correct: 2,
            difficulty: "medium",
            category: "列表推导式",
            explanation: "range(3)生成0,1,2，x**2计算平方，结果是[0, 1, 4]。"
        },
        {
            id: 17,
            title: "字典方法",
            description: "dict.get(key, default)方法的作用是？",
            type: "multiple-choice",
            options: [
                "删除键值对",
                "获取键对应的值，如果不存在返回default",
                "添加键值对",
                "检查键是否存在"
            ],
            correct: 1,
            difficulty: "medium",
            category: "字典方法",
            explanation: "get方法安全地获取字典值，键不存在时返回默认值。"
        },
        {
            id: 18,
            title: "集合操作",
            description: "集合{1, 2, 3}和{3, 4, 5}的并集是什么？",
            type: "multiple-choice",
            options: [
                "{3}",
                "{1, 2, 3, 4, 5}",
                "{1, 2, 4, 5}",
                "{1, 2, 3, 3, 4, 5}"
            ],
            correct: 1,
            difficulty: "medium",
            category: "集合",
            explanation: "并集包含两个集合中的所有不重复元素。"
        },
        {
            id: 19,
            title: "lambda函数",
            description: "lambda x: x**2 是什么类型的函数？",
            type: "multiple-choice",
            options: [
                "匿名函数",
                "递归函数",
                "内置函数",
                "生成器函数"
            ],
            correct: 0,
            difficulty: "medium",
            category: "lambda函数",
            explanation: "lambda创建匿名函数，没有函数名。"
        },
        {
            id: 20,
            title: "模块导入",
            description: "如何导入math模块中的所有内容？",
            type: "multiple-choice",
            options: [
                "import math",
                "from math import *",
                "import * from math",
                "include math"
            ],
            correct: 1,
            difficulty: "medium",
            category: "模块导入",
            explanation: "from module import * 导入模块中的所有内容。"
        },
        {
            id: 21,
            title: "递归函数",
            description: "以下哪个是递归函数的正确定义？",
            type: "multiple-choice",
            options: [
                "def func(): return func()",
                "def func(n):\n    if n == 0: return 1\n    return n * func(n-1)",
                "def func():\n    return lambda x: x",
                "def func():\n    yield 1"
            ],
            correct: 1,
            difficulty: "hard",
            category: "递归",
            explanation: "递归函数必须包含基本情况（终止条件）和递归调用。"
        },
        {
            id: 22,
            title: "生成器",
            description: "yield关键字的作用是？",
            type: "multiple-choice",
            options: [
                "返回值并结束函数",
                "生成一个迭代器",
                "抛出异常",
                "定义变量"
            ],
            correct: 1,
            difficulty: "hard",
            category: "生成器",
            explanation: "yield使函数成为生成器，返回迭代器对象。"
        },
        {
            id: 23,
            title: "装饰器",
            description: "@staticmethod装饰器的作用是？",
            type: "multiple-choice",
            options: [
                "定义实例方法",
                "定义类方法",
                "定义静态方法",
                "定义私有方法"
            ],
            correct: 2,
            difficulty: "hard",
            category: "装饰器",
            explanation: "@staticmethod定义不依赖实例或类的静态方法。"
        },
        {
            id: 24,
            title: "类继承",
            description: "class Child(Parent) 表示什么？",
            type: "multiple-choice",
            options: [
                "Child是Parent的父类",
                "Child继承Parent",
                "Child包含Parent",
                "Child调用Parent"
            ],
            correct: 1,
            difficulty: "medium",
            category: "面向对象",
            explanation: "括号中的类是父类，当前类继承父类的属性和方法。"
        },
        {
            id: 25,
            title: "多态",
            description: "多态的主要优点是什么？",
            type: "multiple-choice",
            options: [
                "提高代码运行速度",
                "减少内存使用",
                "提高代码复用性和灵活性",
                "简化语法"
            ],
            correct: 2,
            difficulty: "hard",
            category: "面向对象",
            explanation: "多态允许不同类的对象对同一方法做出不同响应，提高灵活性。"
        },
        {
            id: 26,
            title: "封装",
            description: "Python中如何定义私有属性？",
            type: "multiple-choice",
            options: [
                "__name",
                "_name",
                "private name",
                "name__"
            ],
            correct: 0,
            difficulty: "medium",
            category: "面向对象",
            explanation: "双下划线开头的属性会被Python名称改编，实现私有效果。"
        },
        {
            id: 27,
            title: "正则表达式",
            description: "re.match(r'\\d+', 'abc123') 的结果是什么？",
            type: "multiple-choice",
            options: [
                "匹配成功，返回'123'",
                "匹配失败，返回None",
                "匹配成功，返回'abc'",
                "抛出异常"
            ],
            correct: 1,
            difficulty: "hard",
            category: "正则表达式",
            explanation: "re.match从字符串开头匹配，'abc123'开头不是数字，所以匹配失败。"
        },
        {
            id: 28,
            title: "JSON处理",
            description: "如何将Python字典转换为JSON字符串？",
            type: "multiple-choice",
            options: [
                "str(dict)",
                "json.dumps(dict)",
                "json.loads(dict)",
                "dict.to_json()"
            ],
            correct: 1,
            difficulty: "medium",
            category: "JSON",
            explanation: "json.dumps()将Python对象序列化为JSON字符串。"
        },
        {
            id: 29,
            title: "时间处理",
            description: "如何获取当前时间的时间戳？",
            type: "multiple-choice",
            options: [
                "time.now()",
                "datetime.now()",
                "time.time()",
                "datetime.timestamp()"
            ],
            correct: 2,
            difficulty: "medium",
            category: "时间处理",
            explanation: "time.time()返回当前时间的时间戳（秒数）。"
        },
        {
            id: 30,
            title: "多线程",
            description: "threading模块中如何创建新线程？",
            type: "multiple-choice",
            options: [
                "thread.start()",
                "Thread.run()",
                "Thread.start()",
                "threading.create()"
            ],
            correct: 2,
            difficulty: "hard",
            category: "多线程",
            explanation: "创建Thread对象后，调用start()方法启动新线程。"
        },
        {
            id: 31,
            title: "算法复杂度",
            description: "以下哪个时间复杂度表示最高效？",
            type: "multiple-choice",
            options: [
                "O(1)",
                "O(log n)",
                "O(n)",
                "O(n²)"
            ],
            correct: 0,
            difficulty: "medium",
            category: "算法",
            explanation: "O(1)表示常数时间复杂度，不随输入规模变化，最高效。"
        },
        {
            id: 32,
            title: "排序算法",
            description: "快速排序的平均时间复杂度是？",
            type: "multiple-choice",
            options: [
                "O(n)",
                "O(n log n)",
                "O(n²)",
                "O(log n)"
            ],
            correct: 1,
            difficulty: "hard",
            category: "排序算法",
            explanation: "快速排序平均时间复杂度为O(n log n)，最坏情况为O(n²)。"
        },
        {
            id: 33,
            title: "搜索算法",
            description: "二分搜索的前提条件是什么？",
            type: "multiple-choice",
            options: [
                "数组必须有序",
                "数组必须无序",
                "数组长度必须为偶数",
                "数组元素必须唯一"
            ],
            correct: 0,
            difficulty: "medium",
            category: "搜索算法",
            explanation: "二分搜索要求数组必须是有序的，否则无法正确工作。"
        },
        {
            id: 34,
            title: "数据结构",
            description: "栈（Stack）的特点是？",
            type: "multiple-choice",
            options: [
                "先进先出",
                "后进先出",
                "随机访问",
                "双向操作"
            ],
            correct: 1,
            difficulty: "medium",
            category: "数据结构",
            explanation: "栈是后进先出（LIFO）的数据结构，最后压入的元素最先弹出。"
        },
        {
            id: 35,
            title: "队列",
            description: "队列（Queue）的特点是？",
            type: "multiple-choice",
            options: [
                "先进先出",
                "后进先出",
                "随机访问",
                "双向操作"
            ],
            correct: 0,
            difficulty: "medium",
            category: "数据结构",
            explanation: "队列是先进先出（FIFO）的数据结构，最先入队的元素最先出队。"
        },
        {
            id: 36,
            title: "链表",
            description: "单向链表的主要缺点是？",
            type: "multiple-choice",
            options: [
                "不能随机访问元素",
                "占用内存多",
                "插入删除困难",
                "不支持动态扩展"
            ],
            correct: 0,
            difficulty: "medium",
            category: "数据结构",
            explanation: "链表必须从头节点开始遍历，不能通过索引直接访问元素。"
        },
        {
            id: 37,
            title: "二叉树",
            description: "二叉搜索树中，左子树的所有节点值与根节点值的关系是？",
            type: "multiple-choice",
            options: [
                "大于根节点值",
                "小于根节点值",
                "等于根节点值",
                "无特定关系"
            ],
            correct: 1,
            difficulty: "medium",
            category: "树结构",
            explanation: "二叉搜索树左子树所有节点值小于根节点，右子树所有节点值大于根节点。"
        },
        {
            id: 38,
            title: "哈希表",
            description: "哈希冲突的解决方法不包括？",
            type: "multiple-choice",
            options: [
                "链地址法",
                "开放地址法",
                "再哈希法",
                "二分查找法"
            ],
            correct: 3,
            difficulty: "hard",
            category: "哈希表",
            explanation: "二分查找是搜索算法，不是解决哈希冲突的方法。"
        },
        {
            id: 39,
            title: "图算法",
            description: "Dijkstra算法用于解决什么问题？",
            type: "multiple-choice",
            options: [
                "最小生成树",
                "单源最短路径",
                "拓扑排序",
                "强连通分量"
            ],
            correct: 1,
            difficulty: "hard",
            category: "图算法",
            explanation: "Dijkstra算法用于求解带权图中单源点到其他所有点的最短路径。"
        },
        {
            id: 40,
            title: "动态规划",
            description: "动态规划算法的核心是？",
            type: "multiple-choice",
            options: [
                "分而治之",
                "贪心选择",
                "记忆化搜索",
                "回溯"
            ],
            correct: 2,
            difficulty: "hard",
            category: "动态规划",
            explanation: "动态规划通过记忆化搜索避免重复计算，存储子问题的解。"
        },
        {
            id: 41,
            title: "贪心算法",
            description: "贪心算法的特点是？",
            type: "multiple-choice",
            options: [
                "全局最优",
                "局部最优",
                "随机选择",
                "回溯求解"
            ],
            correct: 1,
            difficulty: "medium",
            category: "贪心算法",
            explanation: "贪心算法在每一步选择局部最优解，不一定得到全局最优。"
        },
        {
            id: 42,
            title: "回溯算法",
            description: "回溯算法通常用于解决什么问题？",
            type: "multiple-choice",
            options: [
                "排序问题",
                "搜索和组合问题",
                "数值计算",
                "字符串匹配"
            ],
            correct: 1,
            difficulty: "medium",
            category: "回溯算法",
            explanation: "回溯算法通过试错和回溯解决搜索、组合、排列等问题。"
        },
        {
            id: 43,
            title: "位运算",
            description: "表达式 5 & 3 的结果是？（5=101, 3=011）",
            type: "multiple-choice",
            options: [
                "7",
                "1",
                "8",
                "2"
            ],
            correct: 1,
            difficulty: "hard",
            category: "位运算",
            explanation: "&是按位与运算，101 & 011 = 001，即1。"
        },
        {
            id: 44,
            title: "内存管理",
            description: "Python中的垃圾回收主要基于什么机制？",
            type: "multiple-choice",
            options: [
                "引用计数",
                "标记清除",
                "复制收集",
                "分代收集"
            ],
            correct: 0,
            difficulty: "hard",
            category: "内存管理",
            explanation: "Python主要使用引用计数机制进行垃圾回收，辅以其他机制。"
        },
        {
            id: 45,
            title: "迭代器",
            description: "如何使自定义对象支持for循环遍历？",
            type: "multiple-choice",
            options: [
                "实现__iter__方法",
                "实现__next__方法",
                "实现__len__方法",
                "实现__getitem__方法"
            ],
            correct: 0,
            difficulty: "medium",
            category: "迭代器",
            explanation: "对象要实现__iter__方法返回迭代器，才能支持for循环。"
        },
        {
            id: 46,
            title: "上下文管理",
            description: "with语句的主要作用是什么？",
            type: "multiple-choice",
            options: [
                "提高性能",
                "简化代码",
                "自动资源管理",
                "异常处理"
            ],
            correct: 2,
            difficulty: "medium",
            category: "上下文管理",
            explanation: "with语句自动管理资源，确保资源正确释放（如文件关闭）。"
        },
        {
            id: 47,
            title: "元类",
            description: "Python中类的类称为什么？",
            type: "multiple-choice",
            options: [
                "父类",
                "基类",
                "元类",
                "超类"
            ],
            correct: 2,
            difficulty: "hard",
            category: "元类",
            explanation: "元类（metaclass）是类的类，控制类的创建行为。"
        },
        {
            id: 48,
            title: "协程",
            description: "async/await关键字用于实现什么？",
            type: "multiple-choice",
            options: [
                "多线程",
                "多进程",
                "异步编程",
                "并行计算"
            ],
            correct: 2,
            difficulty: "hard",
            category: "异步编程",
            explanation: "async/await是Python的异步编程语法，用于编写协程。"
        },
        {
            id: 49,
            title: "类型提示",
            description: "如何为函数参数添加类型提示？",
            type: "multiple-choice",
            options: [
                "def func(x: int):",
                "def func(int x):",
                "def func(x)::int",
                "def func(x) -> int:"
            ],
            correct: 0,
            difficulty: "medium",
            category: "类型提示",
            explanation: "Python 3.5+支持类型提示，语法为参数名: 类型。"
        },
        {
            id: 50,
            title: "模式匹配",
            description: "Python 3.10+引入的match语句主要用于什么？",
            type: "multiple-choice",
            options: [
                "字符串匹配",
                "模式匹配",
                "正则表达式",
                "数据库查询"
            ],
            correct: 1,
            difficulty: "medium",
            category: "模式匹配",
            explanation: "match语句提供结构化模式匹配功能，类似其他语言的switch。"
        },
        {
            id: 51,
            title: "代码调试",
            description: "Python中如何设置断点进行调试？",
            type: "multiple-choice",
            options: [
                "break()",
                "debug()",
                "breakpoint()",
                "stop()"
            ],
            correct: 2,
            difficulty: "easy",
            category: "调试",
            explanation: "Python 3.7+内置breakpoint()函数用于设置调试断点。"
        },
        {
            id: 52,
            title: "包管理",
            description: "pip命令用于什么？",
            type: "multiple-choice",
            options: [
                "运行Python程序",
                "管理Python包",
                "调试代码",
                "编译代码"
            ],
            correct: 1,
            difficulty: "easy",
            category: "包管理",
            explanation: "pip是Python的包管理工具，用于安装、卸载、管理第三方包。"
        },
        {
            id: 53,
            title: "虚拟环境",
            description: "venv模块的主要作用是什么？",
            type: "multiple-choice",
            options: [
                "提高运行速度",
                "隔离项目依赖",
                "压缩代码",
                "加密代码"
            ],
            correct: 1,
            difficulty: "medium",
            category: "虚拟环境",
            explanation: "venv创建隔离的Python环境，避免项目间依赖冲突。"
        },
        {
            id: 54,
            title: "测试框架",
            description: "Python中最常用的单元测试框架是？",
            type: "multiple-choice",
            options: [
                "pytest",
                "unittest",
                "nose",
                "testify"
            ],
            correct: 0,
            difficulty: "medium",
            category: "测试",
            explanation: "pytest是最流行的Python测试框架，功能强大且易用。"
        },
        {
            id: 55,
            title: "代码风格",
            description: "PEP 8是关于什么的规范？",
            type: "multiple-choice",
            options: [
                "代码性能",
                "代码安全",
                "代码风格",
                "代码结构"
            ],
            correct: 2,
            difficulty: "easy",
            category: "代码规范",
            explanation: "PEP 8是Python官方代码风格指南，规定命名、缩进等规范。"
        },
        {
            id: 56,
            title: "文档字符串",
            description: "如何编写多行文档字符串？",
            type: "multiple-choice",
            options: [
                "// 注释 //",
                "'''文档'''",
                "/* 文档 */",
                "-- 文档 --"
            ],
            correct: 1,
            difficulty: "easy",
            category: "文档",
            explanation: "Python使用三引号（'''或\"\"\"）编写多行文档字符串。"
        },
        {
            id: 57,
            title: "性能优化",
            description: "如何提高Python代码的运行效率？",
            type: "multiple-choice",
            options: [
                "使用全局变量",
                "使用列表推导式",
                "使用递归",
                "使用循环"
            ],
            correct: 1,
            difficulty: "medium",
            category: "性能优化",
            explanation: "列表推导式比传统循环更快，是Python推荐的写法。"
        },
        {
            id: 58,
            title: "内存优化",
            description: "__slots__的主要作用是什么？",
            type: "multiple-choice",
            options: [
                "提高运行速度",
                "减少内存占用",
                "增加功能",
                "简化语法"
            ],
            correct: 1,
            difficulty: "hard",
            category: "内存优化",
            explanation: "__slots__限制实例属性，避免使用__dict__，减少内存占用。"
        },
        {
            id: 59,
            title: "并发编程",
            description: "GIL（全局解释器锁）限制了什么？",
            type: "multiple-choice",
            options: [
                "内存使用",
                "CPU核心数",
                "多线程并行",
                "网络连接"
            ],
            correct: 2,
            difficulty: "hard",
            category: "并发编程",
            explanation: "GIL限制同一时刻只有一个线程执行Python字节码，影响多线程并行。"
        },
        {
            id: 60,
            title: "网络编程",
            description: "socket模块中，TCP服务器的默认协议族是？",
            type: "multiple-choice",
            options: [
                "AF_INET",
                "AF_UNIX",
                "AF_BLUETOOTH",
                "AF_PACKET"
            ],
            correct: 0,
            difficulty: "medium",
            category: "网络编程",
            explanation: "AF_INET是IPv4协议族，是TCP/IP网络编程的常用选择。"
        },
        {
            id: 61,
            title: "数据库",
            description: "Python中连接SQLite数据库的模块是？",
            type: "multiple-choice",
            options: [
                "mysql.connector",
                "psycopg2",
                "sqlite3",
                "pymongo"
            ],
            correct: 2,
            difficulty: "easy",
            category: "数据库",
            explanation: "sqlite3是Python标准库，用于连接SQLite数据库。"
        },
        {
            id: 62,
            title: "Web框架",
            description: "Flask框架中路由装饰器是什么？",
            type: "multiple-choice",
            options: [
                "@app.route()",
                "@app.path()",
                "@app.url()",
                "@app.view()"
            ],
            correct: 0,
            difficulty: "medium",
            category: "Web开发",
            explanation: "@app.route()是Flask的路由装饰器，用于定义URL路由。"
        },
        {
            id: 63,
            title: "数据处理",
            description: "pandas中DataFrame的主要数据结构是？",
            type: "multiple-choice",
            options: [
                "一维数组",
                "二维表格",
                "三维矩阵",
                "树结构"
            ],
            correct: 1,
            difficulty: "medium",
            category: "数据分析",
            explanation: "DataFrame是pandas的核心数据结构，类似二维表格。"
        },
        {
            id: 64,
            title: "机器学习",
            description: "scikit-learn中训练模型的常用方法是？",
            type: "multiple-choice",
            options: [
                "train()",
                "fit()",
                "learn()",
                "build()"
            ],
            correct: 1,
            difficulty: "medium",
            category: "机器学习",
            explanation: "fit()方法是scikit-learn中训练模型的标准方法。"
        },
        {
            id: 65,
            title: "图像处理",
            description: "PIL库中打开图片的函数是？",
            type: "multiple-choice",
            options: [
                "Image.load()",
                "Image.open()",
                "Image.read()",
                "Image.create()"
            ],
            correct: 1,
            difficulty: "easy",
            category: "图像处理",
            explanation: "Image.open()是PIL库中打开图片文件的标准函数。"
        },
        {
            id: 66,
            title: "科学计算",
            description: "NumPy中创建全零数组的函数是？",
            type: "multiple-choice",
            options: [
                "array.zeros()",
                "numpy.zero()",
                "zeros()",
                "numpy.zeros()"
            ],
            correct: 3,
            difficulty: "easy",
            category: "科学计算",
            explanation: "numpy.zeros()创建指定形状的全零数组。"
        },
        {
            id: 67,
            title: "版本控制",
            description: "查看Git提交历史的命令是？",
            type: "multiple-choice",
            options: [
                "git status",
                "git log",
                "git history",
                "git show"
            ],
            correct: 1,
            difficulty: "easy",
            category: "版本控制",
            explanation: "git log显示提交历史记录。"
        },
        {
            id: 68,
            title: "部署",
            description: "Docker中构建镜像的命令是？",
            type: "multiple-choice",
            options: [
                "docker create",
                "docker build",
                "docker make",
                "docker compile"
            ],
            correct: 1,
            difficulty: "medium",
            category: "容器化",
            explanation: "docker build根据Dockerfile构建镜像。"
        },
        {
            id: 69,
            title: "云计算",
            description: "AWS中提供虚拟服务器的服務是？",
            type: "multiple-choice",
            options: [
                "S3",
                "EC2",
                "Lambda",
                "RDS"
            ],
            correct: 1,
            difficulty: "medium",
            category: "云计算",
            explanation: "EC2（Elastic Compute Cloud）提供可扩展的虚拟服务器。"
        },
        {
            id: 70,
            title: "API设计",
            description: "RESTful API中GET请求的语义是？",
            type: "multiple-choice",
            options: [
                "创建资源",
                "获取资源",
                "更新资源",
                "删除资源"
            ],
            correct: 1,
            difficulty: "medium",
            category: "API设计",
            explanation: "GET请求用于从服务器获取指定资源。"
        },
        {
            id: 71,
            title: "安全",
            description: "如何防止SQL注入攻击？",
            type: "multiple-choice",
            options: [
                "字符串拼接",
                "参数化查询",
                "URL编码",
                "HTML转义"
            ],
            correct: 1,
            difficulty: "medium",
            category: "安全",
            explanation: "参数化查询将SQL语句与参数分离，有效防止SQL注入。"
        },
        {
            id: 72,
            title: "加密",
            description: "hashlib模块主要用于什么？",
            type: "multiple-choice",
            options: [
                "数据压缩",
                "数据加密",
                "数据哈希",
                "数据编码"
            ],
            correct: 2,
            difficulty: "medium",
            category: "加密",
            explanation: "hashlib提供多种哈希算法，如MD5、SHA等。"
        },
        {
            id: 73,
            title: "性能分析",
            description: "cProfile模块的主要功能是？",
            type: "multiple-choice",
            options: [
                "内存分析",
                "性能分析",
                "代码检查",
                "单元测试"
            ],
            correct: 1,
            difficulty: "medium",
            category: "性能分析",
            explanation: "cProfile是Python内置的性能分析工具，统计函数调用时间。"
        },
        {
            id: 74,
            title: "日志",
            description: "logging模块中，哪个日志级别最高？",
            type: "multiple-choice",
            options: [
                "DEBUG",
                "INFO",
                "WARNING",
                "CRITICAL"
            ],
            correct: 3,
            difficulty: "easy",
            category: "日志",
            explanation: "日志级别从低到高：DEBUG < INFO < WARNING < ERROR < CRITICAL。"
        },
        {
            id: 75,
            title: "国际化",
            description: "gettext模块用于什么？",
            type: "multiple-choice",
            options: [
                "获取文本",
                "国际化和本地化",
                "文件读取",
                "网络请求"
            ],
            correct: 1,
            difficulty: "medium",
            category: "国际化",
            explanation: "gettext提供国际化支持，实现多语言文本翻译。"
        },
        {
            id: 76,
            title: "缓存",
            description: "functools.lru_cache装饰器的作用是？",
            type: "multiple-choice",
            options: [
                "限制内存使用",
                "缓存函数结果",
                "优化算法",
                "检查参数"
            ],
            correct: 1,
            difficulty: "medium",
            category: "缓存",
            explanation: "lru_cache实现最近最少使用缓存，存储函数计算结果。"
        },
        {
            id: 77,
            title: "元编程",
            description: "type()函数可以做什么？",
            type: "multiple-choice",
            options: [
                "只能获取对象类型",
                "可以创建新类",
                "只能检查类型",
                "只能转换类型"
            ],
            correct: 1,
            difficulty: "hard",
            category: "元编程",
            explanation: "type(name, bases, dict)可以动态创建新类。"
        },
        {
            id: 78,
            title: "描述符",
            description: "实现描述符协议需要哪些方法？",
            type: "multiple-choice",
            options: [
                "__get__",
                "__set__",
                "__delete__",
                "以上都是"
            ],
            correct: 3,
            difficulty: "hard",
            category: "描述符",
            explanation: "描述符协议包括__get__、__set__、__delete__方法。"
        },
        {
            id: 79,
            title: "抽象基类",
            description: "abc模块的主要用途是？",
            type: "multiple-choice",
            options: [
                "数组操作",
                "定义抽象基类",
                "字节处理",
                "算法实现"
            ],
            correct: 1,
            difficulty: "hard",
            category: "抽象基类",
            explanation: "abc模块提供定义抽象基类的工具，如ABC类和abstractmethod装饰器。"
        },
        {
            id: 80,
            title: "数据类",
            description: "dataclass装饰器的主要优点是？",
            type: "multiple-choice",
            options: [
                "提高性能",
                "自动生成方法",
                "增强安全性",
                "简化语法"
            ],
            correct: 1,
            difficulty: "medium",
            category: "数据类",
            explanation: "@dataclass自动为类生成__init__、__repr__等常用方法。"
        },
        {
            id: 81,
            title: "枚举",
            description: "Enum类的主要作用是？",
            type: "multiple-choice",
            options: [
                "数学运算",
                "定义枚举类型",
                "错误处理",
                "类型转换"
            ],
            correct: 1,
            difficulty: "easy",
            category: "枚举",
            explanation: "Enum用于定义符号常量集合，创建枚举类型。"
        },
        {
            id: 82,
            title: "路径操作",
            description: "pathlib模块相比os.path的优点是？",
            type: "multiple-choice",
            options: [
                "速度更快",
                "面向对象",
                "兼容性更好",
                "功能更多"
            ],
            correct: 1,
            difficulty: "medium",
            category: "路径操作",
            explanation: "pathlib提供面向对象的路径操作，比os.path更易用。"
        },
        {
            id: 83,
            title: "压缩",
            description: "gzip模块的主要功能是？",
            type: "multiple-choice",
            options: [
                "图片压缩",
                "文件压缩",
                "内存压缩",
                "网络压缩"
            ],
            correct: 1,
            difficulty: "easy",
            category: "压缩",
            explanation: "gzip模块提供gzip格式的文件压缩和解压缩功能。"
        },
        {
            id: 84,
            title: "序列化",
            description: "pickle模块的主要风险是？",
            type: "multiple-choice",
            options: [
                "速度慢",
                "兼容性差",
                "安全性问题",
                "文件大"
            ],
            correct: 2,
            difficulty: "medium",
            category: "序列化",
            explanation: "pickle反序列化可能执行恶意代码，存在安全风险。"
        },
        {
            id: 85,
            title: "配置管理",
            description: "configparser模块用于处理什么格式的文件？",
            type: "multiple-choice",
            options: [
                "JSON",
                "YAML",
                "INI",
                "XML"
            ],
            correct: 2,
            difficulty: "easy",
            category: "配置管理",
            explanation: "configparser专门处理INI格式的配置文件。"
        },
        {
            id: 86,
            title: "命令行参数",
            description: "argparse模块的主要功能是？",
            type: "multiple-choice",
            options: [
                "解析配置文件",
                "解析命令行参数",
                "解析JSON数据",
                "解析HTML"
            ],
            correct: 1,
            difficulty: "medium",
            category: "命令行",
            explanation: "argparse用于编写用户友好的命令行接口。"
        },
        {
            id: 87,
            title: "多进程",
            description: "multiprocessing模块中如何创建进程？",
            type: "multiple-choice",
            options: [
                "Process()",
                "Thread()",
                "Worker()",
                "Job()"
            ],
            correct: 0,
            difficulty: "medium",
            category: "多进程",
            explanation: "Process类用于创建新进程，是multiprocessing的核心。"
        },
        {
            id: 88,
            title: "网络请求",
            description: "requests库中发送POST请求的方法是？",
            type: "multiple-choice",
            options: [
                "requests.post()",
                "requests.send()",
                "requests.request()",
                "http.post()"
            ],
            correct: 0,
            difficulty: "easy",
            category: "网络请求",
            explanation: "requests.post()用于发送HTTP POST请求。"
        },
        {
            id: 89,
            title: "WebSocket",
            description: "websockets库主要用于什么？",
            type: "multiple-choice",
            options: [
                "HTTP请求",
                "WebSocket通信",
                "TCP连接",
                "UDP通信"
            ],
            correct: 1,
            difficulty: "medium",
            category: "网络通信",
            explanation: "websockets库提供WebSocket协议的客户端和服务器实现。"
        },
        {
            id: 90,
            title: "异步IO",
            description: "asyncio模块的主要用途是？",
            type: "multiple-choice",
            options: [
                "多线程编程",
                "多进程编程",
                "异步编程",
                "同步编程"
            ],
            correct: 2,
            difficulty: "medium",
            category: "异步编程",
            explanation: "asyncio提供异步IO支持，实现单线程并发。"
        },
        {
            id: 91,
            title: "并发控制",
            description: "asyncio中创建任务的函数是？",
            type: "multiple-choice",
            options: [
                "create_job()",
                "create_task()",
                "create_process()",
                "create_thread()"
            ],
            correct: 1,
            difficulty: "medium",
            category: "异步编程",
            explanation: "asyncio.create_task()用于创建并调度协程任务。"
        },
        {
            id: 92,
            title: "事件循环",
            description: "asyncio.get_event_loop()的作用是？",
            type: "multiple-choice",
            options: [
                "创建新事件循环",
                "获取当前事件循环",
                "关闭事件循环",
                "运行事件循环"
            ],
            correct: 1,
            difficulty: "medium",
            category: "异步编程",
            explanation: "get_event_loop()获取当前线程的事件循环实例。"
        },
        {
            id: 93,
            title: "协程",
            description: "协程相比线程的主要优势是？",
            type: "multiple-choice",
            options: [
                "运行速度更快",
                "内存占用更小",
                "切换开销更小",
                "编程更简单"
            ],
            correct: 2,
            difficulty: "hard",
            category: "异步编程",
            explanation: "协程在用户空间切换，开销远小于线程上下文切换。"
        },
        {
            id: 94,
            title: "异步迭代",
            description: "异步迭代器需要实现哪些方法？",
            type: "multiple-choice",
            options: [
                "__iter__",
                "__aiter__ 和 __anext__",
                "__next__",
                "__aiter__"
            ],
            correct: 1,
            difficulty: "hard",
            category: "异步编程",
            explanation: "异步迭代器需要实现__aiter__和__anext__方法。"
        },
        {
            id: 95,
            title: "异步上下文",
            description: "异步上下文管理器需要实现哪些方法？",
            type: "multiple-choice",
            options: [
                "__enter__ 和 __exit__",
                "__aenter__ 和 __aexit__",
                "__async_enter__ 和 __async_exit__",
                "__open__ 和 __close__"
            ],
            correct: 1,
            difficulty: "hard",
            category: "异步编程",
            explanation: "异步上下文管理器协议包括__aenter__和__aexit__方法。"
        },
        {
            id: 96,
            title: "信号处理",
            description: "signal模块主要用于什么？",
            type: "multiple-choice",
            options: [
                "网络通信",
                "进程间通信",
                "信号处理",
                "事件通知"
            ],
            correct: 2,
            difficulty: "hard",
            category: "信号处理",
            explanation: "signal模块处理POSIX信号，如SIGINT、SIGTERM等。"
        },
        {
            id: 97,
            title: "进程间通信",
            description: "multiprocessing中Queue的作用是？",
            type: "multiple-choice",
            options: [
                "存储数据",
                "进程间通信",
                "任务调度",
                "内存管理"
            ],
            correct: 1,
            difficulty: "medium",
            category: "进程通信",
            explanation: "Queue是进程安全的队列，用于进程间数据传递。"
        },
        {
            id: 98,
            title: "共享内存",
            description: "multiprocessing.Value的作用是？",
            type: "multiple-choice",
            options: [
                "创建变量",
                "共享内存",
                "存储数据",
                "类型转换"
            ],
            correct: 1,
            difficulty: "hard",
            category: "共享内存",
            explanation: "Value在共享内存中创建ctypes对象，实现进程间共享。"
        },
        {
            id: 99,
            title: "进程池",
            description: "Pool.map()方法的作用是？",
            type: "multiple-choice",
            options: [
                "映射函数到列表",
                "并行处理可迭代对象",
                "创建进程池",
                "分配任务"
            ],
            correct: 1,
            difficulty: "medium",
            category: "进程池",
            explanation: "Pool.map()将函数并行应用到可迭代对象的每个元素。"
        },
        {
            id: 100,
            title: "Manager",
            description: "multiprocessing.Manager的作用是？",
            type: "multiple-choice",
            options: [
                "管理进程",
                "管理内存",
                "创建共享对象",
                "调度任务"
            ],
            correct: 2,
            difficulty: "hard",
            category: "进程管理",
            explanation: "Manager创建可在进程间共享的Python对象，如列表、字典。"
        }
    ],
    
    getQuestionsByDifficulty: function(difficulty) {
        return this.questions.filter(q => q.difficulty === difficulty);
    },
    
    getQuestionsByCategory: function(category) {
        return this.questions.filter(q => q.category === category);
    },
    
    getRandomQuestions: function(count, difficulty = null) {
        let questions = this.questions;
        if (difficulty) {
            questions = this.getQuestionsByDifficulty(difficulty);
        }
        
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },
    
    searchQuestions: function(keyword) {
        return this.questions.filter(q => 
            q.title.toLowerCase().includes(keyword.toLowerCase()) ||
            q.description.toLowerCase().includes(keyword.toLowerCase()) ||
            q.category.toLowerCase().includes(keyword.toLowerCase())
        );
    }
};

// 导出题库
if (typeof module !== 'undefined' && module.exports) {
    module.exports = pythonQuestions;
}