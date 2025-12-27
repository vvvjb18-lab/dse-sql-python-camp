// SQL题库数据 - 从PDF文件提取的所有题目

const sqlQuestionsDatabase = {
    // 练习16: JOIN Tables
    exercise16: {
        title: "SQL练习 16 - JOIN Tables",
        difficulty: "intermediate",
        questions: [
            {
                id: 16.1,
                title: "三班学生查询",
                description: "数据库文件PHY、CHEM和BIO分别存储物理班、化学班及生物班的数据。这三文件有共同结构：ID(学生编号, 文字, 5), Name(姓名, 文字, 20), Sex(性别, 文字, 1), Class(班别, 文字, 10)",
                parts: [
                    {
                        question: "求出三班所有学生。",
                        hint: "使用UNION操作符合并三个班级的学生",
                        solution: "SELECT * FROM PHY\\nUNION\\nSELECT * FROM CHEM\\nUNION\\nSELECT * FROM BIO",
                        answer: "使用UNION操作符合并三个表的所有记录"
                    },
                    {
                        question: "求出生物班和化学班的共同学生。",
                        hint: "使用IN子查询或INTERSECT操作符",
                        solution: "SELECT * FROM BIO\\nWHERE ID IN (SELECT ID FROM CHEM)",
                        answer: "查询同时存在于生物班和化学班的学生"
                    },
                    {
                        question: "求出化学班和物理班的共同学生。",
                        hint: "使用相同的方法查询化学班和物理班的交集",
                        solution: "SELECT * FROM CHEM\\nWHERE ID IN (SELECT ID FROM PHY)",
                        answer: "查询同时存在于化学班和物理班的学生"
                    },
                    {
                        question: "在物理班的学生中，找出不属于化学班的学生。",
                        hint: "使用NOT IN子查询或MINUS操作符",
                        solution: "SELECT * FROM PHY\\nWHERE ID NOT IN (SELECT ID FROM CHEM)",
                        answer: "查询物理班中不在化学班的学生"
                    }
                ]
            },
            {
                id: 16.2,
                title: "音乐班学生查询",
                description: "数据库文件VIOLIN、PIANO和CELLO分别存储小提琴班、钢琴班及大提琴班的数据，结构与上题相同。",
                parts: [
                    {
                        question: "求出三会(小提琴班、钢琴班、大提琴班)的所有学员。",
                        hint: "使用UNION合并三个班级的学员",
                        solution: "SELECT * FROM VIOLIN\\nUNION\\nSELECT * FROM PIANO\\nUNION\\nSELECT * FROM CELLO",
                        answer: "使用UNION操作符合并三个音乐班级的所有学员"
                    },
                    {
                        question: "求出大提琴班和钢琴班的共同学员。",
                        hint: "使用IN子查询找出两个班级的交集",
                        solution: "SELECT * FROM CELLO\\nWHERE ID IN (SELECT ID FROM PIANO)",
                        answer: "查询同时存在于大提琴班和钢琴班的学员"
                    },
                    {
                        question: "求出大提琴班和小提琴班的共同学员。",
                        hint: "使用IN子查询找出两个班级的交集",
                        solution: "SELECT * FROM CELLO\\nWHERE ID IN (SELECT ID FROM VIOLIN)",
                        answer: "查询同时存在于大提琴班和小提琴班的学员"
                    },
                    {
                        question: "在大提琴班的学员中，找出没有参加钢琴班的学员。",
                        hint: "使用NOT IN子查询找出不在钢琴班的大提琴班学员",
                        solution: "SELECT * FROM CELLO\\nWHERE ID NOT IN (SELECT ID FROM PIANO)",
                        answer: "查询大提琴班中没有参加钢琴班的学员"
                    },
                    {
                        question: "求出三会的共同学员。",
                        hint: "使用嵌套IN子查询找出三个班级的交集",
                        solution: "SELECT * FROM VIOLIN\\nWHERE ID IN (SELECT ID FROM PIANO) AND ID IN (SELECT ID FROM CELLO)",
                        answer: "查询同时存在于三个音乐班级的学员"
                    }
                ]
            }
        ]
    },

    // 练习17: INTERSECT & MINUS
    exercise17: {
        title: "SQL练习 17 - INTERSECT & MINUS",
        difficulty: "intermediate",
        questions: [
            {
                id: 17.1,
                title: "班级学生集合操作",
                description: "数据库文件PHY、CHEM和BIO分别存储物理班、化学班及生物班的数据。",
                parts: [
                    {
                        question: "求出物理班和化学班的共同学生。(INTERSECT)",
                        hint: "使用INTERSECT操作符找出两个班级的交集",
                        solution: "SELECT ID FROM PHY\\nINTERSECT\\nSELECT ID FROM CHEM",
                        answer: "使用INTERSECT操作符找出物理班和化学班的共同学生"
                    },
                    {
                        question: "在生物班的学生中，找出不属于物理班的学生。(MINUS)",
                        hint: "使用MINUS操作符找出生物班中不在物理班的学生",
                        solution: "SELECT ID FROM BIO\\nMINUS\\nSELECT ID FROM PHY",
                        answer: "使用MINUS操作符找出生物班中不属于物理班的学生"
                    },
                    {
                        question: "在物理班的学生中，找出不属于化学班的5A班学生。",
                        hint: "结合NOT IN子查询和班级条件筛选",
                        solution: "SELECT ID FROM PHY\\nWHERE ID NOT IN (SELECT ID FROM CHEM)\\nAND CLASS ='5A'",
                        answer: "查询物理班中不属于化学班且是5A班的学生"
                    },
                    {
                        question: "在化学班和生物班的共同学生中，找出不属于物理班的学生。",
                        hint: "先找出化学班和生物班的共同学生，再排除物理班学生",
                        solution: "SELECT * FROM CHEM\\nWHERE ID IN (SELECT ID FROM BIO)\\nAND ID NOT IN (SELECT ID FROM PHY)",
                        answer: "查询化学班和生物班的共同学生中不属于物理班的学生"
                    },
                    {
                        question: "求出只属于生物班的学生。",
                        hint: "使用NOT IN排除其他班级的学生",
                        solution: "SELECT * FROM BIO\\nWHERE ID NOT IN (SELECT ID FROM PHY)\\nAND ID NOT IN (SELECT ID FROM CHEM)",
                        answer: "查询只属于生物班而不在其他班级的学生"
                    }
                ]
            },
            {
                id: 17.2,
                title: "语言班学生查询",
                description: "数据库文件FRENCH、KOREAN和JAPANESE分别存储法文班、韩文班及日文班的数据。",
                parts: [
                    {
                        question: "求出法文班和韩文班的共同男学员。",
                        hint: "结合性别条件和IN子查询",
                        solution: "SELECT * FROM FRENCH\\nWHERE SEX= '男' AND ID IN (SELECT ID FROM KOREAN)",
                        answer: "查询法文班和韩文班的共同男学员"
                    },
                    {
                        question: "求出三会(法文班、韩文班、日文班)的共同学员。",
                        hint: "使用IN子查询找出三个班级的交集",
                        solution: "SELECT * FROM FRENCH\\nWHERE ID IN (SELECT ID FROM KOREAN)\\nAND ID IN (SELECT ID FROM JAPANESE)",
                        answer: "查询同时存在于三个语言班的学员"
                    },
                    {
                        question: "在日文班的学员中，找出不属于韩文班的女学员。",
                        hint: "结合性别条件和NOT IN子查询",
                        solution: "SELECT * FROM JAPANESE\\nWHERE SEX= '女'\\nAND ID NOT IN (SELECT ID FROM KOREAN)",
                        answer: "查询日文班中不属于韩文班的女学员"
                    },
                    {
                        question: "在韩文班和日文班的共同学员中，找出不属于法文班的学员。",
                        hint: "先找出共同学员，再排除法文班学员",
                        solution: "SELECT * FROM KOREAN\\nWHERE ID IN (SELECT ID FROM JAPANESE)\\nAND ID NOT IN (SELECT ID FROM FRENCH)",
                        answer: "查询韩文班和日文班共同学员中不属于法文班的学员"
                    },
                    {
                        question: "求出只属于日文班的学员。",
                        hint: "使用NOT IN排除其他语言班的学员",
                        solution: "SELECT * FROM JAPANESE\\nWHERE ID NOT IN (SELECT ID FROM FRENCH)\\nAND ID NOT IN (SELECT ID FROM KOREAN)",
                        answer: "查询只属于日文班而不在其他语言班的学员"
                    }
                ]
            }
        ]
    },

    // 练习18: Natural JOIN
    exercise18: {
        title: "SQL练习 18 - Natural JOIN",
        difficulty: "intermediate",
        questions: [
            {
                id: 18.1,
                title: "学会会员自然连接查询",
                description: "数据库文件PHY、CHEM和BIO分别存储物理学会、化学学会及生物学会的資料。",
                parts: [
                    {
                        question: "求出物理学会和生物学会的共同会员。(Example)",
                        hint: "使用自然连接或WHERE子句连接两个表",
                        solution: "SELECT * FROM PHY P, BIO B\\nWHERE P.ID=B.ID",
                        answer: "通过ID字段连接物理学会和生物学会的共同会员"
                    },
                    {
                        question: "求出化学学会和生物学会的共同会员。",
                        hint: "使用相同的连接方法",
                        solution: "SELECT * FROM BIO B, CHEM C\\nWHERE B.ID = C.ID",
                        answer: "通过ID字段连接化学学会和生物学会的共同会员"
                    },
                    {
                        question: "求出物理学会和化学学会的共同女会员。",
                        hint: "结合性别条件和ID连接",
                        solution: "SELECT * FROM PHY P, CHEM C\\nWHERE SEX= \"F\" AND P.ID = C.ID",
                        answer: "查询物理学会和化学学会的共同女会员"
                    },
                    {
                        question: "求出三会(物理、化学、生物学会)的共同会员。",
                        hint: "连接三个表找出共同会员",
                        solution: "SELECT * FROM PHY P, CHEM C, BIO B\\nWHERE P.ID=B.ID AND P.ID=C.ID",
                        answer: "查询同时参加三个学会的会员"
                    },
                    {
                        question: "在化学学会的会员中，找出不属于物理学会的会员。",
                        hint: "使用不等于条件找出差异",
                        solution: "SELECT * FROM CHEM C, PHY P\\nWHERE C.ID<>P.ID",
                        answer: "查询化学学会中不属于物理学会的会员"
                    },
                    {
                        question: "求出只属于化学学会的会员。",
                        hint: "找出与其他学会都没有交集的会员",
                        solution: "SELECT * FROM CHEM C, PHY P, BIO B\\nWHERE C.ID<>P.ID AND C.ID<>B.ID",
                        answer: "查询只属于化学学会而不在其他学会的会员"
                    }
                ]
            },
            {
                id: 18.2,
                title: "多表连接查询",
                description: "数据库文件MUSIC、CHESS和BASKETB分别存储音乐学会、棋艺学会及篮球学会的資料。STUDENT文件存储学生个人资料。",
                parts: [
                    {
                        question: "求出音乐学会和棋艺学会的共同会员。",
                        hint: "使用自然连接找出两个学会的共同会员",
                        solution: "SELECT * FROM MUSIC M, CHESS C\\nWHERE M.ID=C.ID",
                        answer: "查询音乐学会和棋艺学会的共同会员"
                    },
                    {
                        question: "列出棋艺学会中4A班的会员名字。",
                        hint: "连接CHESS和STUDENT表，筛选班级条件",
                        solution: "SELECT S.NAME FROM CHESS C, STUDENT S\\nWHERE C.ID=S.ID AND S.CLASS= '4A'",
                        answer: "查询棋艺学会中4A班会员的名字"
                    },
                    {
                        question: "列出音乐学会中男会员名字。",
                        hint: "连接MUSIC和STUDENT表，筛选性别条件",
                        solution: "SELECT S.NAME FROM MUSIC M, STUDENT S\\nWHERE M.ID=S.ID AND S.SEX= 'M'",
                        answer: "查询音乐学会中男会员的名字"
                    },
                    {
                        question: "求出这三个学会都参加了的5A班学生的名字。",
                        hint: "连接四个表，筛选班级和学会参与条件",
                        solution: "SELECT S.NAME FROM STUDENT S, MUSIC M, CHESS C, BASKETB B\\nWHERE S.CLASS= '5A' AND S.ID=M.ID AND S.ID=C.ID AND S.ID=B.ID",
                        answer: "查询5A班学生中同时参加三个学会的名字"
                    },
                    {
                        question: "求出这三个学会都没有参加的女生的名字。",
                        hint: "找出不在任何学会中的女生",
                        solution: "SELECT NAME FROM STUDENT S, MUSIC M, CHESS C, BASKETB B\\nWHERE SEX= 'F'\\nAND S.ID<>M.ID AND S.ID<>C.ID AND S.ID<>B.ID",
                        answer: "查询没有参加任何三个学会的女生名字"
                    }
                ]
            }
        ]
    },

    // 练习19: 多表连接与分组
    exercise19: {
        title: "SQL练习 19 - 多表连接与分组",
        difficulty: "advanced",
        questions: [
            {
                id: 19.1,
                title: "学会会员综合查询",
                description: "数据库文件ART、ROBOT和SWIM分别存储美术学会、机器人学会及游泳学会的資料。STUDENT文件存储学生个人资料。",
                parts: [
                    {
                        question: "列出美术学会中5A班的会员名字和出席次数。",
                        hint: "连接ART和STUDENT表，筛选班级条件",
                        solution: "SELECT S.NAME, A.ACTIVITY FROM ART A, STUDENT S\\nWHERE A.ID=S.ID AND S.CLASS= '5A'",
                        answer: "查询美术学会中5A班会员的名字和出席次数"
                    },
                    {
                        question: "美术学会和机器人学会有哪些共同会员? 列出他们的学生编号和名字。",
                        hint: "连接三个表找出共同会员信息",
                        solution: "SELECT S.ID, S.NAME FROM ART A, ROBOT R, STUDENT S\\nWHERE A.ID=R.ID AND A.ID=S.ID",
                        answer: "查询美术学会和机器人学会共同会员的学生编号和名字"
                    },
                    {
                        question: "机器人学会和游泳学会有哪些共同男会员?",
                        hint: "连接三个表，筛选性别和学会参与条件",
                        solution: "SELECT ID, NAME FROM STUDENT S, ROBOT R, SWIM M\\nWHERE S.SEX='M' AND S.ID=R.ID AND R.ID=M.ID",
                        answer: "查询机器人学会和游泳学会的共同男会员"
                    },
                    {
                        question: "找出这三个学会都参加了的5C班学生，并列出他们的名字。",
                        hint: "连接四个表，筛选班级和学会参与条件",
                        solution: "SELECT S.NAME FROM STUDENT S, ART A, ROBOT R, SWIM M\\nWHERE S.CLASS= '5C' AND S.ID=A.ID AND A.ID=R.ID AND A.ID=M.ID",
                        answer: "查询5C班学生中同时参加三个学会的名字"
                    }
                ]
            },
            {
                id: 19.2,
                title: "医疗数据库查询",
                description: "一医务所利用数据库文件PATIENT存储个人病人资料和PAYMENT处理收费资料。",
                parts: [
                    {
                        question: "找出男病人的数目。",
                        hint: "使用COUNT和GROUP BY统计男病人数量",
                        solution: "SELECT SEX, COUNT (*) FROM PATIENT\\nWHERE SEX= 'M'\\nGROUP BY SEX",
                        answer: "统计男病人的数量"
                    },
                    {
                        question: "找出超过40岁的病人和列出他们的岁数。",
                        hint: "使用日期计算和WHERE条件筛选",
                        solution: "SELECT PATIENTID, NAME, ROUND ((DATE ()-DOB)/365, 0) AS AGE FROM PATIENT\\nWHERE ROUND ((DATE ()-DOB)/365, 0) > 40",
                        answer: "查询超过40岁的病人及其岁数"
                    },
                    {
                        question: "找出以保险卡付款的病人，列出他们的姓名，不要重复。",
                        hint: "使用DISTINCT和连接查询",
                        solution: "SELECT DISTINCT A.PATIENTID, A.NAME, B.PAY_METHOD FROM PATIENT A, PAYMENT B\\nWHERE A.PATIENTID=B. PATIENTID\\nAND B.PAY_METHOD = '保险卡'",
                        answer: "查询使用保险卡付款的病人姓名（不重复）"
                    },
                    {
                        question: "列出曾支付诊金的总额超过$10000的病人，并列出他们的名字和诊金总额。",
                        hint: "使用GROUP BY和HAVING筛选总额超过10000的病人",
                        solution: "SELECT A.PATIENTID, A.NAME, SUM (B.AMOUNT) FROM PATIENT A, PAYMENT B\\nWHERE A.PATIENTID=B.PATIENTID\\nGROUP BY B.PATIENTID\\nHAVING SUM (B.AMOUNT)>10000",
                        answer: "查询诊金总额超过10000的病人及其总诊金"
                    }
                ]
            }
        ]
    },

    // 练习20: IIF函数
    exercise20: {
        title: "SQL练习 20 - IIF函数",
        difficulty: "advanced",
        questions: [
            {
                id: 20.1,
                title: "球队分组查询",
                description: "数据库文件VOLLEY、BASKET和FOOTBL分别存储排球队、篮球队及足球队的数据。STUDENT文件存储学生个人资料。",
                parts: [
                    {
                        question: "求出排球队和足球队的共同队员。",
                        hint: "使用IN子查询找出两个球队的共同队员",
                        solution: "SELECT STUDENTID FROM VOLLEY\\nWHERE STUDENTID IN (SELECT STUDENTID FROM FOOTBL)",
                        answer: "查询排球队和足球队的共同队员"
                    },
                    {
                        question: "列出排球队中3A班的队员名字。",
                        hint: "连接VOLLEY和STUDENT表，筛选班级条件",
                        solution: "SELECT S.NAME FROM VOLLEY V, STUDENT S\\nWHERE V. STUDENTID=S. STUDENTID AND S.CLASS='3A'",
                        answer: "查询排球队中3A班队员的名字"
                    },
                    {
                        question: "求出这三个球队都参加了的男队员的名字。",
                        hint: "连接四个表，筛选性别和球队参与条件",
                        solution: "SELECT S.NAME FROM STUDENT S, VOLLEY V, BASKET B, FOOTBL F\\nWHERE S.SEX='M' AND S.STUDENTID=V.STUDENTID\\nAND V.STUDENTID=B.STUDENTID AND B.STUDENTID=F.STUDENTID",
                        answer: "查询同时参加三个球队的男队员名字"
                    },
                    {
                        question: "为三队球队分组，活动次数高过20的为组别'A'，否则是组别'B'。分别列出队员编号。",
                        hint: "使用IIF函数根据活动次数进行条件分组",
                        solution: "SELECT STUDENTID, IIF (ACTIVITY > 20, 'A', 'B') as TEAM FROM VOLLEY\\nSELECT STUDENTID, IIF (ACTIVITY > 20, 'A', 'B') as TEAM FROM FOOTBL\\nSELECT STUDENTID, IIF (ACTIVITY > 20, 'A', 'B') as TEAM FROM BASKET",
                        answer: "使用IIF函数根据活动次数分组"
                    }
                ]
            },
            {
                id: 20.2,
                title: "考试管理系统",
                description: "考试局利用数据库文件EXAMINEE、PAY和SUBJECTS处理考生资料、考试费和报考科目资料。",
                parts: [
                    {
                        question: "分别找出男女考生，男生为组别'A'，否则是组别'B'。分别列出考生编号。",
                        hint: "使用IIF函数根据性别进行条件分组",
                        solution: "SELECT E_ID, IIF (SEX= 'M', 'A', 'B') as grp FROM EXAMINEE",
                        answer: "使用IIF函数根据性别分组"
                    },
                    {
                        question: "列出每个考生的学校和所参加每个科目。",
                        hint: "连接EXAMINEE和SUBJECTS表",
                        solution: "SELECT E.E_ID, E.NAME, S.SUBJECT, E.SCHOOL\\nFROM EXAMINEE E, SUBJECTS S\\nWHERE E.E_ID=S.E_ID",
                        answer: "查询每个考生的学校和参加的科目"
                    },
                    {
                        question: "找出各考生考多少个科目。",
                        hint: "使用GROUP BY和COUNT统计每个考生的科目数量",
                        solution: "SELECT E.E_ID, E.NAME, COUNT (*) FROM EXAMINEE E, SUBJECTS S\\nWHERE S.E_ID= E.E_ID\\nGROUP BY S.E_ID",
                        answer: "统计每个考生参加的科目数量"
                    },
                    {
                        question: "找出每个考生总共要交的考试费。",
                        hint: "连接三个表，使用GROUP BY和SUM计算总费用",
                        solution: "SELECT E.E_ID, E.NAME, SUM (P.EXAM_FEE)\\nFROM EXAMINEE E, PAY P, SUBJECTS S\\nWHERE E.E_ID=S.E_ID AND S.SUBJECT= P. SUBJECT\\nGROUP BY S.E_ID",
                        answer: "计算每个考生的总考试费用"
                    }
                ]
            }
        ]
    },

    // 练习21: 医疗数据库和成绩管理
    exercise21: {
        title: "SQL练习 21 - 医疗数据库和成绩管理",
        difficulty: "advanced",
        questions: [
            {
                id: 21.1,
                title: "医疗数据库查询",
                description: "一医务所利用数据库文件PATIENT存储个人病人资料和DISPENSE处理配药资料。",
                parts: [
                    {
                        question: "列出15/10/2018这天所有病人的数量。",
                        hint: "使用COUNT和GROUP BY统计特定日期的病人数量",
                        solution: "SELECT SDATE, COUNT(*) AS NO_OF_PATIENT FROM DISPENSE\\nWHERE SDATE= '15/10/2018'\\nGROUP BY SDATE",
                        answer: "统计2018年10月15日的病人数量"
                    },
                    {
                        question: "找出曾经使用药物'Paracetamol'的病人，列出病人编号和姓名。",
                        hint: "使用DISTINCT和连接查询找出特定药物的使用者",
                        solution: "SELECT DISTINCT PATIENTID, NAME FROM PATIENT a, DISPENSE b\\nWHERE a.PATIENTID = b. PATIENTID AND DRUG = 'Paracetamol'",
                        answer: "查询使用过Paracetamol药物的病人"
                    },
                    {
                        question: "列出每个病人在15/10/2018这天要用的所有药。",
                        hint: "连接PATIENT和DISPENSE表，筛选日期条件",
                        solution: "SELECT a.PATIENTID, a.NAME, b.DRUG FROM PATIENT a, DISPENSE b\\nWHERE a.PATIENTID = b. PATIENTID AND b. SDATE= '15/10/2018'",
                        answer: "查询2018年10月15日每个病人使用的药物"
                    },
                    {
                        question: "把病人分两组，年龄大于65为'Senior'，否则是'General'。",
                        hint: "使用IIF函数根据年龄进行条件分组",
                        solution: "SELECT PATIENTID, NAME, IIF((Date()-DOB)/365> 65, 'Senior', 'General') ) AS AGEGROUP\\nFROM PATIENT",
                        answer: "使用IIF函数根据年龄分组"
                    }
                ]
            },
            {
                id: 21.2,
                title: "成绩管理系统",
                description: "数据库文件MATH、CHIN和ENG分别存储数学科、中文科及英文科的考试分数。STUDENT文件存储学生个人资料。",
                parts: [
                    {
                        question: "求出这三个科目都选修了的男生的名字。",
                        hint: "连接四个表，筛选性别和科目参与条件",
                        solution: "SELECT S.NAME FROM STUDENT S, MATH M, CHIN C, ENG E\\nWHERE S.SEX='M' AND S. S_NO=M. S_NO\\nAND S. S_NO=C. S_NO AND S. S_NO=E. S_NO",
                        answer: "查询同时选修三个科目的男生名字"
                    },
                    {
                        question: "求出这三个科目都没有选修的女生的名字。",
                        hint: "使用NOT IN排除选修了这些科目的学生",
                        solution: "SELECT S.NAME FROM STUDENT S\\nWHERE S.SEX='F' AND S. S_NO NOT IN (SELECT S_NO FROM MATH)\\nAND S. S_NO NOT IN (SELECT S_NO FROM CHIN)\\nAND S. S_NO NOT IN (SELECT S_NO FROM ENG)",
                        answer: "查询没有选修任何三个科目的女生名字"
                    },
                    {
                        question: "找出各考生中文科考多少个考卷。",
                        hint: "使用GROUP BY和COUNT统计每个考生的中文科考卷数量",
                        solution: "SELECT C. S_NO, S.NAME, COUNT (*) FROM CHIN C, STUDENT S\\nWHERE C. S_NO = S. S_NO\\nGROUP BY C. S_NO",
                        answer: "统计每个考生中文科的考卷数量"
                    },
                    {
                        question: "把考生分组，考试分数高过80的为组别'优异'，高过50的为组别'合格'，否则是组别'不合格'。",
                        hint: "使用嵌套IIF函数进行多条件分组",
                        solution: "SELECT S_NO, IIF(SCORE> 80, '优异', IIF(SCORE> 50, '合格', '不合格') ) AS CAT FROM MATH\\nSELECT S_NO, IIF(SCORE> 80, '优异', IIF(SCORE> 50, '合格', '不合格') ) AS CAT FROM CHIN\\nSELECT S_NO, IIF(SCORE> 80, '优异', IIF(SCORE> 50, '合格', '不合格') ) AS CAT FROM ENG",
                        answer: "使用嵌套IIF函数根据分数分组"
                    }
                ]
            }
        ]
    }
};

// 按难度分类的题目索引
const questionsByDifficulty = {
    beginner: [],
    intermediate: [
        { exercise: 16, question: 16.1, title: "三班学生查询", points: 20 },
        { exercise: 16, question: 16.2, title: "音乐班学生查询", points: 25 },
        { exercise: 17, question: 17.1, title: "班级学生集合操作", points: 25 },
        { exercise: 17, question: 17.2, title: "语言班学生查询", points: 25 },
        { exercise: 18, question: 18.1, title: "学会会员自然连接查询", points: 30 },
        { exercise: 18, question: 18.2, title: "多表连接查询", points: 30 }
    ],
    advanced: [
        { exercise: 19, question: 19.1, title: "学会会员综合查询", points: 35 },
        { exercise: 19, question: 19.2, title: "医疗数据库查询", points: 40 },
        { exercise: 20, question: 20.1, title: "球队分组查询", points: 35 },
        { exercise: 20, question: 20.2, title: "考试管理系统", points: 40 },
        { exercise: 21, question: 21.1, title: "医疗数据库查询", points: 40 },
        { exercise: 21, question: 21.2, title: "成绩管理系统", points: 45 }
    ]
};

// 获取题目的函数
function getQuestionsByDifficulty(difficulty) {
    return questionsByDifficulty[difficulty] || [];
}

function getExerciseData(exerciseNum, questionNum) {
    const exercise = sqlQuestionsDatabase[`exercise${exerciseNum}`];
    if (!exercise) return null;
    
    return exercise.questions.find(q => q.id === parseFloat(`${exerciseNum}.${questionNum}`));
}

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sqlQuestionsDatabase, questionsByDifficulty, getQuestionsByDifficulty, getExerciseData };
}