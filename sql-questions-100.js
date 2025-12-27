// SQL题库 - 100道题目
const sqlQuestions100 = {
    questions: [
        {
            id: 1,
            title: "基本SELECT语句",
            description: "从Customers表中选取所有列的正确SQL语句是？",
            type: "multiple-choice",
            options: [
                "SELECT ALL FROM Customers",
                "SELECT * FROM Customers",
                "SELECT EVERYTHING FROM Customers",
                "SELECT Customers.*"
            ],
            correct: 1,
            difficulty: "easy",
            category: "基础查询",
            explanation: "* 是通配符，表示选择所有列。这是最基本的SQL查询语法。"
        },
        {
            id: 2,
            title: "条件查询",
            description: "从Products表中选取价格大于100的产品的正确语句是？",
            type: "multiple-choice",
            options: [
                "SELECT * FROM Products WHERE Price > 100",
                "SELECT * FROM Products IF Price > 100",
                "SELECT * FROM Products HAVING Price > 100",
                "SELECT * FROM Products WHERE Price >= 100"
            ],
            correct: 0,
            difficulty: "easy",
            category: "条件查询",
            explanation: "WHERE子句用于筛选满足条件的记录，>表示大于。"
        },
        {
            id: 3,
            title: "排序结果",
            description: "按价格升序排列Products表的SQL语句是？",
            type: "multiple-choice",
            options: [
                "SELECT * FROM Products SORT BY Price ASC",
                "SELECT * FROM Products ORDER BY Price ASC",
                "SELECT * FROM Products ORDER BY Price DESC",
                "SELECT * FROM Products ARRANGE BY Price"
            ],
            correct: 1,
            difficulty: "easy",
            category: "排序",
            explanation: "ORDER BY用于排序，ASC表示升序（默认），DESC表示降序。"
        },
        {
            id: 4,
            title: "模糊查询",
            description: "查找所有姓'张'的客户的正确SQL语句是？",
            type: "multiple-choice",
            options: [
                "SELECT * FROM Customers WHERE CustomerName = '张%'",
                "SELECT * FROM Customers WHERE CustomerName LIKE '张%'",
                "SELECT * FROM Customers WHERE CustomerName LIKE '%张'",
                "SELECT * FROM Customers WHERE CustomerName IN '张%'"
            ],
            correct: 1,
            difficulty: "easy",
            category: "模糊查询",
            explanation: "LIKE用于模式匹配，%表示任意数量的字符，'张%'表示以张开头。"
        },
        {
            id: 5,
            title: "多条件查询",
            description: "查询价格在50到100之间的产品，正确的SQL语句是？",
            type: "multiple-choice",
            options: [
                "SELECT * FROM Products WHERE Price BETWEEN 50 AND 100",
                "SELECT * FROM Products WHERE Price >= 50 AND <= 100",
                "SELECT * FROM Products WHERE Price IN (50, 100)",
                "SELECT * FROM Products WHERE Price FROM 50 TO 100"
            ],
            correct: 0,
            difficulty: "easy",
            category: "范围查询",
            explanation: "BETWEEN ... AND ... 用于选取介于两个值之间的数据。"
        },
        {
            id: 6,
            title: "聚合函数",
            description: "计算Products表中平均价格的SQL语句是？",
            type: "multiple-choice",
            options: [
                "SELECT AVG Price FROM Products",
                "SELECT AVERAGE(Price) FROM Products",
                "SELECT AVG(Price) FROM Products",
                "SELECT MEAN(Price) FROM Products"
            ],
            correct: 2,
            difficulty: "easy",
            category: "聚合函数",
            explanation: "AVG()是计算平均值的聚合函数，需要用括号包裹列名。"
        },
        {
            id: 7,
            title: "分组统计",
            description: "按类别分组统计产品数量的SQL语句是？",
            type: "multiple-choice",
            options: [
                "SELECT Category, COUNT(*) FROM Products GROUP BY Category",
                "SELECT Category, COUNT(*) FROM Products ORDER BY Category",
                "SELECT Category, COUNT(*) FROM Products HAVING Category",
                "SELECT Category, SUM(*) FROM Products GROUP BY Category"
            ],
            correct: 0,
            difficulty: "medium",
            category: "分组统计",
            explanation: "GROUP BY用于分组，COUNT(*)统计每组记录数。"
        },
        {
            id: 8,
            title: "连接查询",
            description: "内连接Orders表和Customers表的正确语句是？",
            type: "multiple-choice",
            options: [
                "SELECT * FROM Orders, Customers WHERE Orders.CustomerID = Customers.CustomerID",
                "SELECT * FROM Orders INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID",
                "SELECT * FROM Orders JOIN Customers WHERE Orders.CustomerID = Customers.CustomerID",
                "以上都正确"
            ],
            correct: 3,
            difficulty: "medium",
            category: "连接查询",
            explanation: "以上三种写法都可以实现内连接，INNER JOIN语法更清晰。"
        },
        {
            id: 9,
            title: "子查询",
            description: "查找订单金额大于平均订单金额的订单，正确的SQL是？",
            type: "multiple-choice",
            options: [
                "SELECT * FROM Orders WHERE Amount > AVG(Amount)",
                "SELECT * FROM Orders WHERE Amount > (SELECT AVG(Amount) FROM Orders)",
                "SELECT * FROM Orders WHERE Amount > SELECT AVG(Amount) FROM Orders",
                "SELECT * FROM Orders HAVING Amount > AVG(Amount)"
            ],
            correct: 1,
            difficulty: "medium",
            category: "子查询",
            explanation: "子查询需要用括号包裹，先计算平均值再比较。"
        },
        {
            id: 10,
            title: "限制结果",
            description: "只显示前5条记录的SQL语句是？",
            type: "multiple-choice",
            options: [
                "SELECT TOP 5 * FROM Products",
                "SELECT FIRST 5 * FROM Products",
                "SELECT * FROM Products LIMIT 5",
                "SELECT * FROM Products ROWS 5"
            ],
            correct: 2,
            difficulty: "easy",
            category: "限制结果",
            explanation: "LIMIT用于限制返回的记录数，TOP是SQL Server语法。"
        },
        {
            id: 11,
            title: "去重查询",
            description: "查询所有不重复的城市，正确的SQL语句是？",
            type: "multiple-choice",
            options: [
                "SELECT UNIQUE City FROM Customers",
                "SELECT DISTINCT City FROM Customers",
                "SELECT DIFFERENT City FROM Customers",
                "SELECT ONLY City FROM Customers"
            ],
            correct: 1,
            difficulty: "easy",
            category: "去重",
            explanation: "DISTINCT关键字用于返回唯一不同的值。"
        },
        {
            id: 12,
            title: "空值处理",
            description: "查询电话号码不为空的客户，正确的SQL是？",
            type: "multiple-choice",
            options: [
                "SELECT * FROM Customers WHERE Phone != NULL",
                "SELECT * FROM Customers WHERE Phone <> NULL",
                "SELECT * FROM Customers WHERE Phone IS NOT NULL",
                "SELECT * FROM Customers WHERE Phone NOT NULL"
            ],
            correct: 2,
            difficulty: "easy",
            category: "空值处理",
            explanation: "NULL值需要用IS NULL或IS NOT NULL来判断，不能用=或!=。"
        },
        {
            id: 13,
            title: "更新数据",
            description: "将所有产品价格提高10%的正确SQL语句是？",
            type: "multiple-choice",
            options: [
                "UPDATE Products SET Price = Price * 1.1",
                "UPDATE Products SET Price = Price + 10%",
                "UPDATE Products SET Price = Price * 110%",
                "UPDATE Products SET Price = Price + Price * 0.1"
            ],
            correct: 3,
            difficulty: "easy",
            category: "更新数据",
            explanation: "提高10%等于原价加上原价的10%，即Price + Price * 0.1。"
        },
        {
            id: 14,
            title: "删除数据",
            description: "删除所有价格低于50的产品的正确SQL是？",
            type: "multiple-choice",
            options: [
                "DELETE FROM Products WHERE Price < 50",
                "DELETE * FROM Products WHERE Price < 50",
                "REMOVE FROM Products WHERE Price < 50",
                "DROP Products WHERE Price < 50"
            ],
            correct: 0,
            difficulty: "easy",
            category: "删除数据",
            explanation: "DELETE FROM用于删除记录，不需要*，WHERE指定条件。"
        },
        {
            id: 15,
            title: "插入数据",
            description: "向Customers表插入新记录的正确SQL是？",
            type: "multiple-choice",
            options: [
                "INSERT INTO Customers VALUES ('张三', '北京', '13800138000')",
                "INSERT Customers SET Name='张三', City='北京', Phone='13800138000'",
                "ADD TO Customers VALUES ('张三', '北京', '13800138000')",
                "INSERT INTO Customers ('张三', '北京', '13800138000')"
            ],
            correct: 0,
            difficulty: "easy",
            category: "插入数据",
            explanation: "INSERT INTO ... VALUES是标准语法，需要指定表名和值。"
        },
        {
            id: 16,
            title: "左连接",
            description: "左连接（LEFT JOIN）的特点是？",
            type: "multiple-choice",
            options: [
                "只返回左表有匹配的记录",
                "返回左表所有记录，右表无匹配显示NULL",
                "只返回右表有匹配的记录",
                "返回两表的交集"
            ],
            correct: 1,
            difficulty: "medium",
            category: "连接查询",
            explanation: "LEFT JOIN保证左表所有记录都显示，右表无匹配时显示NULL。"
        },
        {
            id: 17,
            title: "右连接",
            description: "右连接（RIGHT JOIN）与左连接的区别是？",
            type: "multiple-choice",
            options: [
                "没有区别",
                "右连接返回右表所有记录，左表无匹配显示NULL",
                "右连接只返回匹配的记录",
                "右连接返回两表的并集"
            ],
            correct: 1,
            difficulty: "medium",
            category: "连接查询",
            explanation: "RIGHT JOIN与LEFT JOIN相反，保证右表所有记录都显示。"
        },
        {
            id: 18,
            title: "全连接",
            description: "全连接（FULL JOIN）的特点是？",
            type: "multiple-choice",
            options: [
                "只返回两表都匹配的记录",
                "返回左表所有记录",
                "返回右表所有记录",
                "返回两表所有记录，无匹配显示NULL"
            ],
            correct: 3,
            difficulty: "medium",
            category: "连接查询",
            explanation: "FULL JOIN返回两表所有记录，匹配不上的显示NULL。"
        },
        {
            id: 19,
            title: "交叉连接",
            description: "交叉连接（CROSS JOIN）的结果是？",
            type: "multiple-choice",
            options: [
                "返回两表的交集",
                "返回左表的记录",
                "返回右表的记录",
                "返回两表的笛卡尔积"
            ],
            correct: 3,
            difficulty: "medium",
            category: "连接查询",
            explanation: "CROSS JOIN返回两表的笛卡尔积，即所有可能的组合。"
        },
        {
            id: 20,
            title: "自连接",
            description: "自连接（Self Join）的作用是？",
            type: "multiple-choice",
            options: [
                "连接两个不同的表",
                "表与自身连接",
                "连接三个表",
                "删除重复记录"
            ],
            correct: 1,
            difficulty: "medium",
            category: "连接查询",
            explanation: "自连接是表与自身的连接，常用于层次结构查询。"
        },
        {
            id: 21,
            title: "HAVING子句",
            description: "HAVING子句的作用是？",
            type: "multiple-choice",
            options: [
                "筛选分组前的记录",
                "筛选分组后的结果",
                "排序结果",
                "限制返回记录数"
            ],
            correct: 1,
            difficulty: "medium",
            category: "分组筛选",
            explanation: "HAVING用于筛选GROUP BY分组后的结果，WHERE用于分组前。"
        },
        {
            id: 22,
            title: "聚合函数COUNT",
            description: "COUNT(*)和COUNT(column)的区别是？",
            type: "multiple-choice",
            options: [
                "没有区别",
                "COUNT(*)包含NULL值，COUNT(column)不包含NULL值",
                "COUNT(column)包含NULL值，COUNT(*)不包含NULL值",
                "COUNT(*)只能用于数字列"
            ],
            correct: 1,
            difficulty: "medium",
            category: "聚合函数",
            explanation: "COUNT(*)统计所有行，COUNT(column)忽略该列的NULL值。"
        },
        {
            id: 23,
            title: "聚合函数SUM",
            description: "SUM函数对NULL值的处理是？",
            type: "multiple-choice",
            options: [
                "将NULL视为0",
                "忽略NULL值",
                "返回NULL",
                "抛出错误"
            ],
            correct: 1,
            difficulty: "medium",
            category: "聚合函数",
            explanation: "SUM函数会忽略NULL值，只对非NULL值求和。"
        },
        {
            id: 24,
            title: "字符串函数",
            description: "将字符串转换为大写的SQL函数是？",
            type: "multiple-choice",
            options: [
                "UPPER()",
                "CAPITALIZE()",
                "TOUPPER()",
                "UCASE()"
            ],
            correct: 0,
            difficulty: "easy",
            category: "字符串函数",
            explanation: "UPPER()函数将字符串转换为大写，LOWER()转换为小写。"
        },
        {
            id: 25,
            title: "字符串拼接",
            description: "拼接FirstName和LastName的正确方式是？",
            type: "multiple-choice",
            options: [
                "SELECT FirstName + LastName FROM Employees",
                "SELECT CONCAT(FirstName, LastName) FROM Employees",
                "SELECT FirstName || LastName FROM Employees",
                "以上都可能正确"
            ],
            correct: 3,
            difficulty: "medium",
            category: "字符串函数",
            explanation: "不同数据库语法不同：MySQL用CONCAT，SQL Server用+，Oracle用||。"
        },
        {
            id: 26,
            title: "日期函数",
            description: "获取当前日期的SQL函数是？",
            type: "multiple-choice",
            options: [
                "NOW()",
                "CURRENT_DATE()",
                "GETDATE()",
                "以上都可能正确"
            ],
            correct: 3,
            difficulty: "medium",
            category: "日期函数",
            explanation: "不同数据库日期函数不同：MySQL用NOW()，SQL Server用GETDATE()。"
        },
        {
            id: 27,
            title: "数学函数",
            description: "四舍五入到小数点后2位的SQL函数是？",
            type: "multiple-choice",
            options: [
                "ROUND(number, 2)",
                "FORMAT(number, 2)",
                "TRUNCATE(number, 2)",
                "FIXED(number, 2)"
            ],
            correct: 0,
            difficulty: "easy",
            category: "数学函数",
            explanation: "ROUND(number, decimals)将数字四舍五入到指定小数位数。"
        },
        {
            id: 28,
            title: "别名使用",
            description: "为列指定别名的正确语法是？",
            type: "multiple-choice",
            options: [
                "SELECT column AS alias",
                "SELECT column alias",
                "SELECT alias = column",
                "以上都正确"
            ],
            correct: 3,
            difficulty: "easy",
            category: "别名",
            explanation: "AS关键字可选，可以直接写别名，也可以alias = column（SQL Server）。"
        },
        {
            id: 29,
            title: "表别名",
            description: "为表指定别名的主要目的是？",
            type: "multiple-choice",
            options: [
                "提高查询性能",
                "简化表名，使查询更简洁",
                "改变表名",
                "限制访问权限"
            ],
            correct: 1,
            difficulty: "easy",
            category: "别名",
            explanation: "表别名主要用于简化查询语句，特别是在多表连接时。"
        },
        {
            id: 30,
            title: "EXISTS子查询",
            description: "EXISTS子查询的作用是？",
            type: "multiple-choice",
            options: [
                "检查记录是否存在",
                "计算记录数量",
                "获取最大值",
                "排序记录"
            ],
            correct: 0,
            difficulty: "medium",
            category: "子查询",
            explanation: "EXISTS用于测试子查询是否返回任何行，存在返回TRUE。"
        },
        {
            id: 31,
            title: "IN子查询",
            description: "IN操作符的作用是？",
            type: "multiple-choice",
            options: [
                "检查值是否在某个范围内",
                "检查值是否等于列表中的某个值",
                "检查值是否为空",
                "检查值是否为数字"
            ],
            correct: 1,
            difficulty: "easy",
            category: "子查询",
            explanation: "IN用于检查某个值是否匹配列表或子查询中的任何值。"
        },
        {
            id: 32,
            title: "ANY/SOME子查询",
            description: "ANY和SOME关键字的作用是？",
            type: "multiple-choice",
            options: [
                "检查所有值",
                "检查某个值",
                "检查是否为空",
                "检查数据类型"
            ],
            correct: 1,
            difficulty: "medium",
            category: "子查询",
            explanation: "ANY/SOME用于比较某个值与子查询返回的某个值。"
        },
        {
            id: 33,
            title: "ALL子查询",
            description: "ALL关键字的作用是？",
            type: "multiple-choice",
            options: [
                "检查某个值",
                "检查所有值",
                "检查是否为空",
                "检查数据类型"
            ],
            correct: 1,
            difficulty: "medium",
            category: "子查询",
            explanation: "ALL用于比较某个值与子查询返回的所有值。"
        },
        {
            id: 34,
            title: "UNION操作",
            description: "UNION操作符的作用是？",
            type: "multiple-choice",
            options: [
                "连接两个表",
                "合并两个查询结果并去重",
                "求两个查询的交集",
                "求两个查询的差集"
            ],
            correct: 1,
            difficulty: "medium",
            category: "集合操作",
            explanation: "UNION合并两个SELECT结果集，并自动去除重复行。"
        },
        {
            id: 35,
            title: "UNION ALL",
            description: "UNION ALL与UNION的区别是？",
            type: "multiple-choice",
            options: [
                "没有区别",
                "UNION ALL不去除重复行",
                "UNION ALL性能更差",
                "UNION ALL只能用于两个查询"
            ],
            correct: 1,
            difficulty: "medium",
            category: "集合操作",
            explanation: "UNION ALL合并结果集但不去除重复行，性能比UNION好。"
        },
        {
            id: 36,
            title: "INTERSECT",
            description: "INTERSECT操作符的作用是？",
            type: "multiple-choice",
            options: [
                "求并集",
                "求交集",
                "求差集",
                "连接表"
            ],
            correct: 1,
            difficulty: "medium",
            category: "集合操作",
            explanation: "INTERSECT返回两个查询结果集的交集（共同行）。"
        },
        {
            id: 37,
            title: "EXCEPT",
            description: "EXCEPT操作符的作用是？",
            type: "multiple-choice",
            options: [
                "求并集",
                "求交集",
                "求差集",
                "连接表"
            ],
            correct: 2,
            difficulty: "medium",
            category: "集合操作",
            explanation: "EXCEPT返回第一个查询有而第二个查询没有的行（差集）。"
        },
        {
            id: 38,
            title: "CASE表达式",
            description: "CASE表达式的作用是？",
            type: "multiple-choice",
            options: [
                "创建表",
                "条件判断",
                "循环处理",
                "定义变量"
            ],
            correct: 1,
            difficulty: "medium",
            category: "条件表达式",
            explanation: "CASE实现类似if-else的条件逻辑，在查询中进行条件判断。"
        },
        {
            id: 39,
            title: "视图",
            description: "数据库视图的主要优点是？",
            type: "multiple-choice",
            options: [
                "提高查询性能",
                "简化复杂查询，提供数据安全性",
                "存储更多数据",
                "减少存储空间"
            ],
            correct: 1,
            difficulty: "medium",
            category: "视图",
            explanation: "视图简化查询，限制数据访问，提供逻辑数据独立性。"
        },
        {
            id: 40,
            title: "创建视图",
            description: "创建视图的正确语法是？",
            type: "multiple-choice",
            options: [
                "CREATE VIEW view_name AS SELECT ...",
                "MAKE VIEW view_name AS SELECT ...",
                "BUILD VIEW view_name AS SELECT ...",
                "NEW VIEW view_name AS SELECT ..."
            ],
            correct: 0,
            difficulty: "easy",
            category: "视图",
            explanation: "CREATE VIEW是创建视图的标准SQL语法。"
        },
        {
            id: 41,
            title: "索引",
            description: "数据库索引的主要作用是？",
            type: "multiple-choice",
            options: [
                "增加存储空间",
                "降低查询速度",
                "提高查询速度",
                "减少数据冗余"
            ],
            correct: 2,
            difficulty: "medium",
            category: "索引",
            explanation: "索引通过创建数据结构加快数据检索速度，但会增加写入开销。"
        },
        {
            id: 42,
            title: "创建索引",
            description: "在Products表的Price列上创建索引的正确语法是？",
            type: "multiple-choice",
            options: [
                "CREATE INDEX idx_price ON Products(Price)",
                "BUILD INDEX idx_price ON Products(Price)",
                "MAKE INDEX idx_price ON Products(Price)",
                "ADD INDEX idx_price TO Products(Price)"
            ],
            correct: 0,
            difficulty: "easy",
            category: "索引",
            explanation: "CREATE INDEX是创建索引的标准SQL语法。"
        },
        {
            id: 43,
            title: "唯一索引",
            description: "唯一索引的特点是？",
            type: "multiple-choice",
            options: [
                "可以有重复值",
                "不能有重复值",
                "只能用于主键",
                "只能有一个"
            ],
            correct: 1,
            difficulty: "medium",
            category: "索引",
            explanation: "唯一索引确保索引列的值唯一，可用于保证数据完整性。"
        },
        {
            id: 44,
            title: "事务",
            description: "数据库事务的ACID特性不包括？",
            type: "multiple-choice",
            options: [
                "原子性（Atomicity）",
                "一致性（Consistency）",
                "隔离性（Isolation）",
                "并发性（Concurrency）"
            ],
            correct: 3,
            difficulty: "hard",
            category: "事务",
            explanation: "ACID指原子性、一致性、隔离性、持久性，不包括并发性。"
        },
        {
            id: 45,
            title: "事务控制",
            description: "开始事务的正确SQL语句是？",
            type: "multiple-choice",
            options: [
                "BEGIN TRANSACTION",
                "START TRANSACTION",
                "BEGIN WORK",
                "以上都正确"
            ],
            correct: 3,
            difficulty: "medium",
            category: "事务",
            explanation: "不同数据库可能支持不同语法，但都表示开始事务。"
        },
        {
            id: 46,
            title: "提交事务",
            description: "提交事务的正确SQL语句是？",
            type: "multiple-choice",
            options: [
                "COMMIT TRANSACTION",
                "SAVE TRANSACTION",
                "END TRANSACTION",
                "FINISH TRANSACTION"
            ],
            correct: 0,
            difficulty: "easy",
            category: "事务",
            explanation: "COMMIT用于提交事务，使所有更改永久生效。"
        },
        {
            id: 47,
            title: "回滚事务",
            description: "回滚事务的正确SQL语句是？",
            type: "multiple-choice",
            options: [
                "ROLLBACK TRANSACTION",
                "UNDO TRANSACTION",
                "CANCEL TRANSACTION",
                "BACK TRANSACTION"
            ],
            correct: 0,
            difficulty: "easy",
            category: "事务",
            explanation: "ROLLBACK用于撤销事务中的所有操作。"
        },
        {
            id: 48,
            title: "保存点",
            description: "保存点（SAVEPOINT）的作用是？",
            type: "multiple-choice",
            options: [
                "保存整个事务",
                "创建事务的标记点，可以部分回滚",
                "提交事务",
                "开始新事务"
            ],
            correct: 1,
            difficulty: "medium",
            category: "事务",
            explanation: "SAVEPOINT创建标记点，可以回滚到该点而不是事务开头。"
        },
        {
            id: 49,
            title: "存储过程",
            description: "存储过程的主要优点是？",
            type: "multiple-choice",
            options: [
                "增加网络流量",
                "提高性能，减少网络流量",
                "降低安全性",
                "增加代码复杂度"
            ],
            correct: 1,
            difficulty: "medium",
            category: "存储过程",
            explanation: "存储过程预编译，减少网络传输，提高性能和安全性。"
        },
        {
            id: 50,
            title: "创建存储过程",
            description: "创建存储过程的基本语法是？",
            type: "multiple-choice",
            options: [
                "CREATE PROCEDURE procedure_name AS ...",
                "MAKE PROCEDURE procedure_name AS ...",
                "BUILD PROCEDURE procedure_name AS ...",
                "NEW PROCEDURE procedure_name AS ..."
            ],
            correct: 0,
            difficulty: "medium",
            category: "存储过程",
            explanation: "CREATE PROCEDURE是创建存储过程的标准SQL语法。"
        },
        {
            id: 51,
            title: "触发器",
            description: "触发器的主要作用是？",
            type: "multiple-choice",
            options: [
                "主动执行操作",
                "响应数据库事件自动执行",
                "提高查询性能",
                "管理用户权限"
            ],
            correct: 1,
            difficulty: "medium",
            category: "触发器",
            explanation: "触发器在特定事件（INSERT/UPDATE/DELETE）发生时自动执行。"
        },
        {
            id: 52,
            title: "游标",
            description: "数据库游标的主要作用是？",
            type: "multiple-choice",
            options: [
                "提高查询速度",
                "逐行处理查询结果",
                "创建索引",
                "管理事务"
            ],
            correct: 1,
            difficulty: "medium",
            category: "游标",
            explanation: "游标允许逐行访问和处理查询结果集。"
        },
        {
            id: 53,
            title: "约束",
            description: "PRIMARY KEY约束的特点是？",
            type: "multiple-choice",
            options: [
                "允许NULL值",
                "允许重复值",
                "唯一且不为NULL",
                "可以有多列但值相同"
            ],
            correct: 2,
            difficulty: "easy",
            category: "约束",
            explanation: "主键必须唯一且不能为NULL，用于唯一标识每条记录。"
        },
        {
            id: 54,
            title: "外键约束",
            description: "FOREIGN KEY约束的作用是？",
            type: "multiple-choice",
            options: [
                "保证数据唯一性",
                "建立表间关系，保证引用完整性",
                "限制数据类型",
                "提高查询性能"
            ],
            correct: 1,
            difficulty: "medium",
            category: "约束",
            explanation: "外键用于建立表间关系，确保引用的数据存在。"
        },
        {
            id: 55,
            title: "CHECK约束",
            description: "CHECK约束的作用是？",
            type: "multiple-choice",
            options: [
                "检查数据类型",
                "限制列的值必须满足条件",
                "检查外键关系",
                "检查主键唯一性"
            ],
            correct: 1,
            difficulty: "medium",
            category: "约束",
            explanation: "CHECK约束定义条件，确保列值满足指定规则。"
        },
        {
            id: 56,
            title: "DEFAULT约束",
            description: "DEFAULT约束的作用是？",
            type: "multiple-choice",
            options: [
                "设置列的默认值",
                "检查数据唯一性",
                "限制数据类型",
                "建立外键关系"
            ],
            correct: 0,
            difficulty: "easy",
            category: "约束",
            explanation: "DEFAULT为列设置默认值，当插入未指定该列时使用。"
        },
        {
            id: 57,
            title: "用户权限",
            description: "GRANT语句的作用是？",
            type: "multiple-choice",
            options: [
                "创建用户",
                "授予权限",
                "撤销权限",
                "删除用户"
            ],
            correct: 1,
            difficulty: "easy",
            category: "权限管理",
            explanation: "GRANT用于授予用户或角色特定的数据库权限。"
        },
        {
            id: 58,
            title: "撤销权限",
            description: "撤销用户权限的正确SQL语句是？",
            type: "multiple-choice",
            options: [
                "REVOKE privilege FROM user",
                "REMOVE privilege FROM user",
                "DELETE privilege FROM user",
                "DROP privilege FROM user"
            ],
            correct: 0,
            difficulty: "easy",
            category: "权限管理",
            explanation: "REVOKE用于撤销已授予的权限。"
        },
        {
            id: 59,
            title: "数据类型",
            description: "存储固定长度字符串应该使用哪种数据类型？",
            type: "multiple-choice",
            options: [
                "VARCHAR",
                "CHAR",
                "TEXT",
                "STRING"
            ],
            correct: 1,
            difficulty: "easy",
            category: "数据类型",
            explanation: "CHAR存储固定长度字符串，VARCHAR存储可变长度字符串。"
        },
        {
            id: 60,
            title: "数值类型",
            description: "存储精确小数应该使用哪种数据类型？",
            type: "multiple-choice",
            options: [
                "FLOAT",
                "DOUBLE",
                "DECIMAL",
                "REAL"
            ],
            correct: 2,
            difficulty: "medium",
            category: "数据类型",
            explanation: "DECIMAL/NUMERIC用于存储精确小数，FLOAT/DOUBLE是近似值。"
        },
        {
            id: 61,
            title: "日期时间类型",
            description: "存储日期和时间应该使用哪种数据类型？",
            type: "multiple-choice",
            options: [
                "DATE",
                "TIME",
                "DATETIME",
                "TIMESTAMP"
            ],
            correct: 2,
            difficulty: "medium",
            category: "数据类型",
            explanation: "DATETIME存储日期和时间，DATE只存储日期，TIME只存储时间。"
        },
        {
            id: 62,
            title: "布尔类型",
            description: "SQL中表示布尔值的数据类型是？",
            type: "multiple-choice",
            options: [
                "BOOL",
                "BOOLEAN",
                "BIT",
                "以上都可能正确"
            ],
            correct: 3,
            difficulty: "medium",
            category: "数据类型",
            explanation: "不同数据库布尔类型不同：MySQL用BOOLEAN，SQL Server用BIT。"
        },
        {
            id: 63,
            title: "创建表",
            description: "创建新表的基本语法是？",
            type: "multiple-choice",
            options: [
                "CREATE TABLE table_name (...)",
                "MAKE TABLE table_name (...)",
                "BUILD TABLE table_name (...)",
                "NEW TABLE table_name (...)"
            ],
            correct: 0,
            difficulty: "easy",
            category: "表操作",
            explanation: "CREATE TABLE是创建新表的标准SQL语法。"
        },
        {
            id: 64,
            title: "修改表结构",
            description: "向现有表添加新列的正确语法是？",
            type: "multiple-choice",
            options: [
                "ALTER TABLE table_name ADD column_name datatype",
                "MODIFY TABLE table_name ADD column_name datatype",
                "CHANGE TABLE table_name ADD column_name datatype",
                "UPDATE TABLE table_name ADD column_name datatype"
            ],
            correct: 0,
            difficulty: "medium",
            category: "表操作",
            explanation: "ALTER TABLE用于修改现有表结构，ADD添加新列。"
        },
        {
            id: 65,
            title: "删除表",
            description: "删除整个表（包括结构和数据）的正确语法是？",
            type: "multiple-choice",
            options: [
                "DELETE TABLE table_name",
                "REMOVE TABLE table_name",
                "DROP TABLE table_name",
                "DESTROY TABLE table_name"
            ],
            correct: 2,
            difficulty: "easy",
            category: "表操作",
            explanation: "DROP TABLE删除整个表结构，DELETE只删除数据。"
        },
        {
            id: 66,
            title: "清空表",
            description: "删除表中所有数据但保留表结构的正确语法是？",
            type: "multiple-choice",
            options: [
                "DELETE FROM table_name",
                "TRUNCATE TABLE table_name",
                "DROP TABLE table_name",
                "以上都正确"
            ],
            correct: 3,
            difficulty: "medium",
            category: "表操作",
            explanation: "DELETE和TRUNCATE都删除数据，TRUNCATE更快但不能回滚。"
        },
        {
            id: 67,
            title: "重命名表",
            description: "将表old_name重命名为new_name的正确语法是？",
            type: "multiple-choice",
            options: [
                "RENAME old_name TO new_name",
                "ALTER TABLE old_name RENAME TO new_name",
                "CHANGE TABLE old_name TO new_name",
                "UPDATE TABLE old_name SET name = new_name"
            ],
            correct: 1,
            difficulty: "medium",
            category: "表操作",
            explanation: "ALTER TABLE ... RENAME TO是重命名表的标准语法。"
        },
        {
            id: 68,
            title: "复制表结构",
            description: "只复制表结构不复制数据的SQL语句是？",
            type: "multiple-choice",
            options: [
                "CREATE TABLE new_table AS SELECT * FROM old_table",
                "CREATE TABLE new_table LIKE old_table",
                "COPY TABLE new_table FROM old_table",
                "CLONE TABLE new_table FROM old_table"
            ],
            correct: 1,
            difficulty: "medium",
            category: "表操作",
            explanation: "CREATE TABLE ... LIKE只复制表结构，不复制数据。"
        },
        {
            id: 69,
            title: "复制表数据",
            description: "将表A的数据复制到表B的正确语法是？",
            type: "multiple-choice",
            options: [
                "INSERT INTO B SELECT * FROM A",
                "COPY B FROM A",
                "INSERT B SELECT * FROM A",
                "ADD TO B SELECT * FROM A"
            ],
            correct: 0,
            difficulty: "medium",
            category: "表操作",
            explanation: "INSERT INTO ... SELECT用于将一个表的数据插入另一个表。"
        },
        {
            id: 70,
            title: "临时表",
            description: "创建临时表的SQL语法是？",
            type: "multiple-choice",
            options: [
                "CREATE TEMP TABLE ...",
                "CREATE TEMPORARY TABLE ...",
                "CREATE SESSION TABLE ...",
                "以上都可能正确"
            ],
            correct: 3,
            difficulty: "hard",
            category: "表操作",
            explanation: "不同数据库临时表语法不同，但都支持TEMPORARY关键字。"
        },
        {
            id: 71,
            title: "窗口函数",
            description: "ROW_NUMBER()窗口函数的作用是？",
            type: "multiple-choice",
            options: [
                "计算行数",
                "为每行分配唯一序号",
                "计算平均值",
                "排序数据"
            ],
            correct: 1,
            difficulty: "hard",
            category: "窗口函数",
            explanation: "ROW_NUMBER()为结果集中的每一行分配唯一的行号。"
        },
        {
            id: 72,
            title: "RANK函数",
            description: "RANK()与ROW_NUMBER()的区别是？",
            type: "multiple-choice",
            options: [
                "没有区别",
                "RANK处理并列排名，会跳过序号",
                "ROW_NUMBER处理并列排名",
                "RANK性能更好"
            ],
            correct: 1,
            difficulty: "hard",
            category: "窗口函数",
            explanation: "RANK在遇到相同值时分配相同排名，并跳过后续序号。"
        },
        {
            id: 73,
            title: "DENSE_RANK",
            description: "DENSE_RANK()函数的特点是？",
            type: "multiple-choice",
            options: [
                "跳过并列排名后的序号",
                "不跳过并列排名后的序号",
                "只计算行数",
                "只排序不排名"
            ],
            correct: 1,
            difficulty: "hard",
            category: "窗口函数",
            explanation: "DENSE_RANK与RANK类似，但不会跳过并列排名后的序号。"
        },
        {
            id: 74,
            title: "LAG函数",
            description: "LAG()窗口函数的作用是？",
            type: "multiple-choice",
            options: [
                "获取当前行",
                "获取前一行数据",
                "获取后一行数据",
                "计算累计值"
            ],
            correct: 1,
            difficulty: "hard",
            category: "窗口函数",
            explanation: "LAG()访问当前行之前指定偏移量的行的数据。"
        },
        {
            id: 75,
            title: "LEAD函数",
            description: "LEAD()窗口函数的作用是？",
            type: "multiple-choice",
            options: [
                "获取当前行",
                "获取前一行数据",
                "获取后一行数据",
                "计算累计值"
            ],
            correct: 2,
            difficulty: "hard",
            category: "窗口函数",
            explanation: "LEAD()访问当前行之后指定偏移量的行的数据。"
        },
        {
            id: 76,
            title: "SUM窗口函数",
            description: "SUM() OVER()的作用是？",
            type: "multiple-choice",
            options: [
                "计算总和",
                "计算累计和",
                "计算平均值",
                "计算行数"
            ],
            correct: 1,
            difficulty: "hard",
            category: "窗口函数",
            explanation: "SUM() OVER()计算窗口内的累计和，常用于财务报表。"
        },
        {
            id: 77,
            title: "PARTITION BY",
            description: "窗口函数中PARTITION BY的作用是？",
            type: "multiple-choice",
            options: [
                "排序数据",
                "分组数据",
                "限制行数",
                "连接表"
            ],
            correct: 1,
            difficulty: "hard",
            category: "窗口函数",
            explanation: "PARTITION BY将结果集分区，窗口函数在每个分区内独立计算。"
        },
        {
            id: 78,
            title: "递归查询",
            description: "递归CTE的主要用途是？",
            type: "multiple-choice",
            options: [
                "排序数据",
                "处理层次结构数据",
                "分组统计",
                "连接表"
            ],
            correct: 1,
            difficulty: "hard",
            category: "递归查询",
            explanation: "递归CTE用于查询层次结构数据，如组织架构、分类树等。"
        },
        {
            id: 79,
            title: "PIVOT操作",
            description: "PIVOT操作的作用是？",
            type: "multiple-choice",
            options: [
                "旋转列数据",
                "行转列",
                "列转行",
                "以上都正确"
            ],
            correct: 3,
            difficulty: "hard",
            category: "数据转换",
            explanation: "PIVOT将行数据转换为列，实现数据透视功能。"
        },
        {
            id: 80,
            title: "UNPIVOT",
            description: "UNPIVOT操作的作用是？",
            type: "multiple-choice",
            options: [
                "行转列",
                "列转行",
                "旋转数据",
                "排序数据"
            ],
            correct: 1,
            difficulty: "hard",
            category: "数据转换",
            explanation: "UNPIVOT是PIVOT的逆操作，将列数据转换为行。"
        },
        {
            id: 81,
            title: "JSON数据",
            description: "现代数据库中JSON数据类型的主要优点是？",
            type: "multiple-choice",
            options: [
                "存储空间更小",
                "查询速度更快",
                "灵活存储半结构化数据",
                "数据类型更丰富"
            ],
            correct: 2,
            difficulty: "medium",
            category: "JSON",
            explanation: "JSON类型适合存储半结构化数据，无需预定义严格模式。"
        },
        {
            id: 82,
            title: "XML数据",
            description: "XML数据类型的主要特点是？",
            type: "multiple-choice",
            options: [
                "只能存储文本",
                "支持复杂查询和数据验证",
                "查询性能最好",
                "存储空间最小"
            ],
            correct: 1,
            difficulty: "medium",
            category: "XML",
            explanation: "XML支持XPath查询、XQuery，可以通过DTD/XSD验证数据结构。"
        },
        {
            id: 83,
            title: "全文搜索",
            description: "全文搜索的主要优点是？",
            type: "multiple-choice",
            options: [
                "精确匹配",
                "支持模糊查询和自然语言搜索",
                "速度比LIKE慢",
                "只能搜索数字"
            ],
            correct: 1,
            difficulty: "medium",
            category: "全文搜索",
            explanation: "全文搜索支持复杂的文本搜索，比LIKE '%text%'更高效。"
        },
        {
            id: 84,
            title: "正则表达式",
            description: "SQL中使用正则表达式的主要函数是？",
            type: "multiple-choice",
            options: [
                "LIKE",
                "REGEXP",
                "MATCH",
                "以上都可能正确"
            ],
            correct: 3,
            difficulty: "medium",
            category: "正则表达式",
            explanation: "不同数据库正则函数不同：MySQL用REGEXP，PostgreSQL用~运算符。"
        },
        {
            id: 85,
            title: "地理空间数据",
            description: "存储地理坐标应该使用哪种数据类型？",
            type: "multiple-choice",
            options: [
                "POINT",
                "GEOGRAPHY",
                "GEOMETRY",
                "以上都可能正确"
            ],
            correct: 3,
            difficulty: "hard",
            category: "地理空间",
            explanation: "不同数据库地理类型不同：PostGIS用GEOMETRY，SQL Server用GEOGRAPHY。"
        },
        {
            id: 86,
            title: "性能优化",
            description: "查询性能优化的首要步骤是？",
            type: "multiple-choice",
            options: [
                "添加索引",
                "分析查询执行计划",
                "重写查询",
                "增加硬件资源"
            ],
            correct: 1,
            difficulty: "medium",
            category: "性能优化",
            explanation: "分析执行计划可以了解查询如何执行，找出性能瓶颈。"
        },
        {
            id: 87,
            title: "执行计划",
            description: "查看查询执行计划的SQL语句是？",
            type: "multiple-choice",
            options: [
                "SHOW PLAN",
                "EXPLAIN",
                "DESCRIBE",
                "以上都可能正确"
            ],
            correct: 3,
            difficulty: "medium",
            category: "性能优化",
            explanation: "不同数据库执行计划命令不同：MySQL用EXPLAIN，SQL Server用SET SHOWPLAN。"
        },
        {
            id: 88,
            title: "统计信息",
            description: "数据库统计信息的主要作用是？",
            type: "multiple-choice",
            options: [
                "存储数据",
                "帮助优化器选择最佳执行计划",
                "提高查询速度",
                "减少存储空间"
            ],
            correct: 1,
            difficulty: "hard",
            category: "性能优化",
            explanation: "统计信息描述数据分布，帮助查询优化器选择最优执行计划。"
        },
        {
            id: 89,
            title: "查询缓存",
            description: "查询缓存的主要缺点是？",
            type: "multiple-choice",
            options: [
                "占用内存",
                "缓存失效频繁",
                "不适合动态数据",
                "以上都正确"
            ],
            correct: 3,
            difficulty: "medium",
            category: "性能优化",
            explanation: "查询缓存在数据频繁更新时失效快，占用内存，适合静态数据。"
        },
        {
            id: 90,
            title: "分区表",
            description: "表分区的主要优点是？",
            type: "multiple-choice",
            options: [
                "提高查询性能，便于管理大数据",
                "减少存储空间",
                "简化查询语法",
                "提高数据安全性"
            ],
            correct: 0,
            difficulty: "hard",
            category: "性能优化",
            explanation: "分区将大表分成小块，提高查询性能，便于维护和备份。"
        },
        {
            id: 91,
            title: "连接算法",
            description: "嵌套循环连接（Nested Loop Join）的特点是？",
            type: "multiple-choice",
            options: [
                "适合大表连接",
                "适合小表连接",
                "性能最好",
                "内存消耗最大"
            ],
            correct: 1,
            difficulty: "hard",
            category: "性能优化",
            explanation: "嵌套循环连接适合小表，对大表性能较差。"
        },
        {
            id: 92,
            title: "哈希连接",
            description: "哈希连接（Hash Join）的特点是？",
            type: "multiple-choice",
            options: [
                "需要索引",
                "内存消耗大",
                "适合不等值连接",
                "速度最慢"
            ],
            correct: 1,
            difficulty: "hard",
            category: "性能优化",
            explanation: "哈希连接使用哈希表，需要足够内存，适合等值连接。"
        },
        {
            id: 93,
            title: "合并连接",
            description: "合并连接（Merge Join）的前提是？",
            type: "multiple-choice",
            options: [
                "表必须有索引",
                "连接列必须已排序",
                "表必须大小相同",
                "必须使用等值连接"
            ],
            correct: 1,
            difficulty: "hard",
            category: "性能优化",
            explanation: "合并连接要求输入已按连接键排序，性能很好。"
        },
        {
            id: 94,
            title: "并行查询",
            description: "并行查询的主要优点是？",
            type: "multiple-choice",
            options: [
                "减少CPU使用",
                "提高大查询性能",
                "减少内存使用",
                "简化查询语法"
            ],
            correct: 1,
            difficulty: "hard",
            category: "性能优化",
            explanation: "并行查询使用多CPU同时处理，加速大查询执行。"
        },
        {
            id: 95,
            title: "物化视图",
            description: "物化视图的主要优点是？",
            type: "multiple-choice",
            options: [
                "节省存储空间",
                "提高复杂查询性能",
                "实时更新",
                "简化维护"
            ],
            correct: 1,
            difficulty: "hard",
            category: "性能优化",
            explanation: "物化视图存储查询结果，避免重复计算，提高查询速度。"
        },
        {
            id: 96,
            title: "数据库范式",
            description: "第一范式（1NF）的要求是？",
            type: "multiple-choice",
            options: [
                "没有重复列",
                "每列都是不可再分的原子值",
                "有主键",
                "没有冗余数据"
            ],
            correct: 1,
            difficulty: "medium",
            category: "数据库设计",
            explanation: "1NF要求每个列都是原子值，不可再分，消除重复组。"
        },
        {
            id: 97,
            title: "第二范式",
            description: "第二范式（2NF）的要求是？",
            type: "multiple-choice",
            options: [
                "满足1NF",
                "满足1NF且非主属性完全依赖主键",
                "满足1NF且有主键",
                "没有传递依赖"
            ],
            correct: 1,
            difficulty: "hard",
            category: "数据库设计",
            explanation: "2NF要求满足1NF，且每个非主属性完全函数依赖主键。"
        },
        {
            id: 98,
            title: "第三范式",
            description: "第三范式（3NF）的要求是？",
            type: "multiple-choice",
            options: [
                "满足2NF",
                "满足2NF且没有传递依赖",
                "满足2NF且有外键",
                "满足2NF且没有冗余"
            ],
            correct: 1,
            difficulty: "hard",
            category: "数据库设计",
            explanation: "3NF要求满足2NF，且不存在非主属性对主键的传递依赖。"
        },
        {
            id: 99,
            title: "反范式化",
            description: "反范式化的主要目的是？",
            type: "multiple-choice",
            options: [
                "减少冗余",
                "提高查询性能",
                "节省存储空间",
                "提高数据一致性"
            ],
            correct: 1,
            difficulty: "medium",
            category: "数据库设计",
            explanation: "反范式化通过增加冗余来减少连接，提高查询性能。"
        },
        {
            id: 100,
            title: "数据完整性",
            description: "引用完整性的主要目的是？",
            type: "multiple-choice",
            options: [
                "保证数据唯一",
                "保证外键引用的数据存在",
                "保证数据类型正确",
                "保证数据不为空"
            ],
            correct: 1,
            difficulty: "medium",
            category: "数据完整性",
            explanation: "引用完整性确保外键值引用的主键值在父表中存在。"
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
    module.exports = sqlQuestions100;
}