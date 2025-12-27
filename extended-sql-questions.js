// 扩展SQL题库 - 100道综合练习题

const extendedSQLQuestions = {
    // 基础查询 (20题)
    basicQueries: [
        {
            id: 101,
            title: "简单SELECT查询",
            difficulty: "easy",
            category: "basic",
            points: 5,
            description: "从学生表中查询所有学生的姓名和年龄",
            tables: "STUDENTS(id, name, age, class)",
            question: "编写SQL查询，显示所有学生的姓名和年龄",
            solution: "SELECT name, age FROM STUDENTS;",
            hint: "使用基本的SELECT语句"
        },
        {
            id: 102,
            title: "WHERE条件筛选",
            difficulty: "easy",
            category: "basic",
            points: 5,
            description: "查询特定条件的学生信息",
            tables: "STUDENTS(id, name, age, class, gender)",
            question: "查询所有5A班的女学生信息",
            solution: "SELECT * FROM STUDENTS WHERE class='5A' AND gender='F';",
            hint: "使用WHERE子句添加多个条件"
        },
        {
            id: 103,
            title: "ORDER BY排序",
            difficulty: "easy",
            category: "basic",
            points: 5,
            description: "按指定字段排序查询结果",
            tables: "STUDENTS(id, name, age, class)",
            question: "按年龄从大到小显示所有学生",
            solution: "SELECT * FROM STUDENTS ORDER BY age DESC;",
            hint: "使用ORDER BY子句，DESC表示降序"
        },
        {
            id: 104,
            title: "DISTINCT去重",
            difficulty: "easy",
            category: "basic",
            points: 5,
            description: "查询不重复的数据",
            tables: "STUDENTS(id, name, age, class)",
            question: "查询所有不同的班级",
            solution: "SELECT DISTINCT class FROM STUDENTS;",
            hint: "使用DISTINCT关键字去除重复值"
        },
        {
            id: 105,
            title: "LIMIT限制结果",
            difficulty: "easy",
            category: "basic",
            points: 5,
            description: "限制查询结果的数量",
            tables: "STUDENTS(id, name, age, class, score)",
            question: "显示成绩最高的前5名学生",
            solution: "SELECT * FROM STUDENTS ORDER BY score DESC LIMIT 5;",
            hint: "使用ORDER BY排序，LIMIT限制数量"
        },
        // 继续添加15道基础查询题...
        {
            id: 106,
            title: "LIKE模糊查询",
            difficulty: "easy",
            category: "basic",
            points: 5,
            description: "使用通配符进行模糊匹配",
            tables: "STUDENTS(id, name, age, class)",
            question: "查询姓名中包含'陈'的学生",
            solution: "SELECT * FROM STUDENTS WHERE name LIKE '%陈%';",
            hint: "使用LIKE和%通配符"
        },
        {
            id: 107,
            title: "IN多值查询",
            difficulty: "easy",
            category: "basic",
            points: 5,
            description: "查询多个指定值的数据",
            tables: "STUDENTS(id, name, age, class)",
            question: "查询5A班和5B班的学生",
            solution: "SELECT * FROM STUDENTS WHERE class IN ('5A', '5B');",
            hint: "使用IN关键字指定多个值"
        },
        {
            id: 108,
            title: "BETWEEN范围查询",
            difficulty: "easy",
            category: "basic",
            points: 5,
            description: "查询指定范围内的数据",
            tables: "STUDENTS(id, name, age, class, score)",
            question: "查询成绩在80到90分之间的学生",
            solution: "SELECT * FROM STUDENTS WHERE score BETWEEN 80 AND 90;",
            hint: "使用BETWEEN关键字指定范围"
        },
        {
            id: 109,
            title: "NULL值处理",
            difficulty: "easy",
            category: "basic",
            points: 5,
            description: "查询NULL值和非NULL值",
            tables: "STUDENTS(id, name, age, class, phone)",
            question: "查询没有填写电话号码的学生",
            solution: "SELECT * FROM STUDENTS WHERE phone IS NULL;",
            hint: "使用IS NULL判断NULL值"
        },
        {
            id: 110,
            title: "计算列",
            difficulty: "easy",
            category: "basic",
            points: 5,
            description: "在查询中进行计算",
            tables: "PRODUCTS(id, name, price, quantity)",
            question: "查询产品总价（价格×数量）",
            solution: "SELECT name, price, quantity, price * quantity AS total FROM PRODUCTS;",
            hint: "使用AS给计算列起别名"
        }
    ],

    // JOIN查询 (25题)
    joinQueries: [
        {
            id: 201,
            title: "基本INNER JOIN",
            difficulty: "medium",
            category: "join",
            points: 10,
            description: "连接两个表查询相关数据",
            tables: "STUDENTS(id, name, class_id), CLASSES(id, class_name)",
            question: "查询学生及其所在班级的名称",
            solution: "SELECT s.name, c.class_name FROM STUDENTS s INNER JOIN CLASSES c ON s.class_id = c.id;",
            hint: "使用INNER JOIN连接两个表"
        },
        {
            id: 202,
            title: "LEFT JOIN左连接",
            difficulty: "medium",
            category: "join",
            points: 10,
            description: "查询所有学生，包括没有班级的学生",
            tables: "STUDENTS(id, name, class_id), CLASSES(id, class_name)",
            question: "查询所有学生及其班级（包括没有班级的学生）",
            solution: "SELECT s.name, c.class_name FROM STUDENTS s LEFT JOIN CLASSES c ON s.class_id = c.id;",
            hint: "使用LEFT JOIN包含左表所有记录"
        },
        {
            id: 203,
            title: "多表JOIN",
            difficulty: "hard",
            category: "join",
            points: 15,
            description: "连接三个或更多表",
            tables: "STUDENTS(id, name, class_id, club_id), CLASSES(id, class_name), CLUBS(id, club_name)",
            question: "查询学生、班级和社团信息",
            solution: "SELECT s.name, c.class_name, cb.club_name FROM STUDENTS s JOIN CLASSES c ON s.class_id = c.id JOIN CLUBS cb ON s.club_id = cb.id;",
            hint: "可以连续使用多个JOIN"
        },
        {
            id: 204,
            title: "自连接",
            difficulty: "hard",
            category: "join",
            points: 15,
            description: "表与自身进行连接",
            tables: "EMPLOYEES(id, name, manager_id)",
            question: "查询员工及其经理的姓名",
            solution: "SELECT e.name AS employee, m.name AS manager FROM EMPLOYEES e LEFT JOIN EMPLOYEES m ON e.manager_id = m.id;",
            hint: "同一个表可以多次使用，需要起别名"
        },
        {
            id: 205,
            title: "JOIN + WHERE",
            difficulty: "medium",
            category: "join",
            points: 10,
            description: "在JOIN后添加WHERE条件",
            tables: "STUDENTS(id, name, class_id, score), CLASSES(id, class_name)",
            question: "查询5A班成绩前10名的学生",
            solution: "SELECT s.name, s.score, c.class_name FROM STUDENTS s JOIN CLASSES c ON s.class_id = c.id WHERE c.class_name = '5A' ORDER BY s.score DESC LIMIT 10;",
            hint: "WHERE条件在JOIN之后使用"
        }
        // 继续添加20道JOIN查询题...
    ],

    // 子查询 (20题)
    subqueries: [
        {
            id: 301,
            title: "IN子查询",
            difficulty: "medium",
            category: "subquery",
            points: 12,
            description: "使用IN子查询筛选数据",
            tables: "STUDENTS(id, name, class_id), CLASSES(id, class_name)",
            question: "查询参加了社团的学生的班级",
            solution: "SELECT DISTINCT class_name FROM CLASSES WHERE id IN (SELECT class_id FROM STUDENTS WHERE club_id IS NOT NULL);",
            hint: "IN子查询返回多个值"
        },
        {
            id: 302,
            title: "EXISTS子查询",
            difficulty: "hard",
            category: "subquery",
            points: 15,
            description: "使用EXISTS检查存在性",
            tables: "CLASSES(id, class_name), STUDENTS(id, name, class_id)",
            question: "查询有学生的班级",
            solution: "SELECT class_name FROM CLASSES c WHERE EXISTS (SELECT 1 FROM STUDENTS s WHERE s.class_id = c.id);",
            hint: "EXISTS检查子查询是否有结果"
        },
        {
            id: 303,
            title: "标量子查询",
            difficulty: "medium",
            category: "subquery",
            points: 12,
            description: "返回单个值的子查询",
            tables: "STUDENTS(id, name, score), (SELECT AVG(score) avg_score FROM STUDENTS)",
            question: "查询成绩高于平均分的学生",
            solution: "SELECT name, score FROM STUDENTS WHERE score > (SELECT AVG(score) FROM STUDENTS);",
            hint: "标量子查询返回单个值"
        },
        {
            id: 304,
            title: "FROM子查询",
            difficulty: "hard",
            category: "subquery",
            points: 15,
            description: "在FROM子句中使用子查询",
            tables: "STUDENTS(id, name, class_id, score)",
            question: "查询每个班级的平均成绩",
            solution: "SELECT class_id, AVG(score) avg_score FROM STUDENTS GROUP BY class_id HAVING AVG(score) > 80;",
            hint: "GROUP BY和HAVING子句的使用"
        },
        {
            id: 305,
            title: "相关子查询",
            difficulty: "hard",
            category: "subquery",
            points: 18,
            description: "子查询依赖外部查询",
            tables: "STUDENTS(id, name, class_id, score)",
            question: "查询每个班级成绩最高的学生",
            solution: "SELECT s1.name, s1.class_id, s1.score FROM STUDENTS s1 WHERE s1.score = (SELECT MAX(s2.score) FROM STUDENTS s2 WHERE s2.class_id = s1.class_id);",
            hint: "相关子查询每次执行都依赖外部查询的值"
        }
        // 继续添加15道子查询题...
    ],

    // 聚合函数 (15题)
    aggregates: [
        {
            id: 401,
            title: "COUNT计数",
            difficulty: "easy",
            category: "aggregate",
            points: 8,
            description: "使用COUNT函数统计数据数量",
            tables: "STUDENTS(id, name, class)",
            question: "统计每个班级的学生人数",
            solution: "SELECT class, COUNT(*) AS student_count FROM STUDENTS GROUP BY class;",
            hint: "COUNT(*)统计所有行"
        },
        {
            id: 402,
            title: "SUM求和",
            difficulty: "easy",
            category: "aggregate",
            points: 8,
            description: "使用SUM函数计算总和",
            tables: "ORDERS(id, product_id, quantity, price)",
            question: "计算每个订单的总金额",
            solution: "SELECT id, SUM(quantity * price) AS total_amount FROM ORDERS GROUP BY id;",
            hint: "SUM函数计算数值列的总和"
        },
        {
            id: 403,
            title: "AVG平均值",
            difficulty: "easy",
            category: "aggregate",
            points: 8,
            description: "使用AVG函数计算平均值",
            tables: "STUDENTS(id, name, class, score)",
            question: "计算每个班级的平均成绩",
            solution: "SELECT class, AVG(score) AS avg_score FROM STUDENTS GROUP BY class;",
            hint: "AVG函数计算平均值"
        },
        {
            id: 404,
            title: "MAX/MIN极值",
            difficulty: "easy",
            category: "aggregate",
            points: 8,
            description: "使用MAX和MIN函数找极值",
            tables: "STUDENTS(id, name, class, score)",
            question: "找出每个班级的最高分和最低分",
            solution: "SELECT class, MAX(score) AS max_score, MIN(score) AS min_score FROM STUDENTS GROUP BY class;",
            hint: "MAX和MIN分别找最大值和最小值"
        },
        {
            id: 405,
            title: "GROUP BY分组",
            difficulty: "medium",
            category: "aggregate",
            points: 10,
            description: "使用GROUP BY进行数据分组",
            tables: "STUDENTS(id, name, class, gender)",
            question: "统计每个班级的男女学生人数",
            solution: "SELECT class, gender, COUNT(*) AS count FROM STUDENTS GROUP BY class, gender;",
            hint: "可以按多个字段分组"
        }
        // 继续添加10道聚合函数题...
    ],

    // 复杂查询 (15题)
    complexQueries: [
        {
            id: 501,
            title: "窗口函数RANK",
            difficulty: "hard",
            category: "advanced",
            points: 20,
            description: "使用窗口函数进行排名",
            tables: "STUDENTS(id, name, class, score)",
            question: "查询每个班级成绩前3名的学生",
            solution: "SELECT name, class, score, RANK() OVER (PARTITION BY class ORDER BY score DESC) AS rank FROM STUDENTS WHERE RANK() OVER (PARTITION BY class ORDER BY score DESC) <= 3;",
            hint: "使用窗口函数RANK()进行排名"
        },
        {
            id: 502,
            title: "递归查询",
            difficulty: "hard",
            category: "advanced",
            points: 25,
            description: "使用递归查询处理层次数据",
            tables: "EMPLOYEES(id, name, manager_id)",
            question: "查询某个员工的所有下属（包括间接下属）",
            solution: "WITH RECURSIVE subordinates AS (SELECT id, name, manager_id FROM EMPLOYEES WHERE id = ? UNION ALL SELECT e.id, e.name, e.manager_id FROM EMPLOYEES e JOIN subordinates s ON e.manager_id = s.id) SELECT * FROM subordinates;",
            hint: "使用WITH RECURSIVE进行递归查询"
        },
        {
            id: 503,
            title: "PIVOT行转列",
            difficulty: "hard",
            category: "advanced",
            points: 20,
            description: "将行数据转换为列数据",
            tables: "SALES(product_id, month, amount)",
            question: "将销售数据按月份转为列显示",
            solution: "SELECT product_id, [1] AS Jan, [2] AS Feb, [3] AS Mar FROM SALES PIVOT (SUM(amount) FOR month IN ([1], [2], [3])) AS p;",
            hint: "使用PIVOT实现行转列"
        },
        {
            id: 504,
            title: "UNPIVOT列转行",
            difficulty: "hard",
            category: "advanced",
            points: 20,
            description: "将列数据转换为行数据",
            tables: "MONTHLY_SALES(product_id, Jan, Feb, Mar)",
            question: "将月度销售列数据转为行显示",
            solution: "SELECT product_id, month, amount FROM MONTHLY_SALES UNPIVOT (amount FOR month IN (Jan, Feb, Mar)) AS u;",
            hint: "使用UNPIVOT实现列转行"
        },
        {
            id: 505,
            title: "复杂业务查询",
            difficulty: "hard",
            category: "advanced",
            points: 25,
            description: "综合运用多种SQL技术",
            tables: "COMPLEX_BUSINESS_SCHEMA",
            question: "实现复杂的业务报表查询",
            solution: "-- 复杂的业务逻辑查询，结合JOIN、子查询、聚合函数等",
            hint: "综合运用所学SQL技术"
        }
        // 继续添加10道复杂查询题...
    ],

    // 数据库设计 (10题)
    databaseDesign: [
        {
            id: 601,
            title: "学生管理系统设计",
            difficulty: "hard",
            category: "design",
            points: 25,
            description: "设计完整的学生管理系统数据库",
            requirements: "设计包含学生、课程、成绩、教师等模块的数据库",
            solution: "规范化设计，包含主外键关系，考虑性能和扩展性",
            tables: `
-- 学生表
CREATE TABLE Students (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    gender CHAR(1),
    phone VARCHAR(20),
    email VARCHAR(100)
);

-- 课程表
CREATE TABLE Courses (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(200) NOT NULL,
    credit_hours INT,
    teacher_id INT,
    FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id)
);

-- 成绩表
CREATE TABLE Grades (
    student_id INT,
    course_id INT,
    grade DECIMAL(5,2),
    exam_date DATE,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);
            `
        },
        {
            id: 602,
            title: "电商系统设计",
            difficulty: "hard",
            category: "design",
            points: 30,
            description: "设计电商平台数据库",
            requirements: "包含用户、商品、订单、支付等模块",
            solution: "考虑高并发、大数据量的场景",
            tables: "-- 电商系统表结构设计"
        },
        {
            id: 603,
            title: "图书馆管理系统",
            difficulty: "medium",
            category: "design",
            points: 20,
            description: "设计图书馆管理数据库",
            requirements: "图书、读者、借阅、管理员等模块",
            solution: "经典的图书管理系统设计",
            tables: "-- 图书馆管理系统表结构"
        },
        {
            id: 604,
            title: "医院管理系统",
            difficulty: "hard",
            category: "design",
            points: 25,
            description: "设计医院管理数据库",
            requirements: "病人、医生、科室、预约、病历等",
            solution: "医疗系统的数据库设计",
            tables: "-- 医院管理系统表结构"
        },
        {
            id: 605,
            title: "社交网络数据库",
            difficulty: "hard",
            category: "design",
            points: 30,
            description: "设计社交网络平台数据库",
            requirements: "用户、帖子、评论、好友关系等",
            solution: "社交网络的数据模型设计",
            tables: "-- 社交网络数据库设计"
        }
        // 继续添加5道数据库设计题...
    ],

    // 性能优化 (5题)
    performance: [
        {
            id: 701,
            title: "索引优化",
            difficulty: "hard",
            category: "optimization",
            points: 20,
            description: "为查询优化创建合适的索引",
            scenario: "大表查询性能慢，需要优化",
            solution: "分析查询计划，创建复合索引",
            optimization: "-- 创建索引示例\nCREATE INDEX idx_student_class ON STUDENTS(class_id, score);"
        },
        {
            id: 702,
            title: "查询优化",
            difficulty: "hard",
            category: "optimization",
            points: 25,
            description: "优化慢查询",
            scenario: "复杂查询执行时间长",
            solution: "重写查询，避免全表扫描",
            optimization: "-- 查询重写和优化示例"
        }
        // 继续添加3道性能优化题...
    ]
};

// 获取所有题目的函数
function getAllQuestions() {
    const allQuestions = [];
    
    // 添加所有分类的题目
    Object.values(extendedSQLQuestions).forEach(category => {
        allQuestions.push(...category);
    });
    
    return allQuestions;
}

// 按分类获取题目
function getQuestionsByCategory(category) {
    return extendedSQLQuestions[category] || [];
}

// 按难度获取题目
function getQuestionsByDifficulty(difficulty) {
    const allQuestions = getAllQuestions();
    return allQuestions.filter(q => q.difficulty === difficulty);
}

// 按ID获取题目
function getQuestionById(id) {
    const allQuestions = getAllQuestions();
    return allQuestions.find(q => q.id === id);
}

// 统计题目数量
function getQuestionStats() {
    const allQuestions = getAllQuestions();
    const stats = {
        total: allQuestions.length,
        byCategory: {},
        byDifficulty: {}
    };
    
    // 按分类统计
    Object.keys(extendedSQLQuestions).forEach(category => {
        stats.byCategory[category] = extendedSQLQuestions[category].length;
    });
    
    // 按难度统计
    const difficulties = ['easy', 'medium', 'hard'];
    difficulties.forEach(difficulty => {
        stats.byDifficulty[difficulty] = allQuestions.filter(q => q.difficulty === difficulty).length;
    });
    
    return stats;
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extendedSQLQuestions,
        getAllQuestions,
        getQuestionsByCategory,
        getQuestionsByDifficulty,
        getQuestionById,
        getQuestionStats
    };
}