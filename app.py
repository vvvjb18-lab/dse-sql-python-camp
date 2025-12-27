"""
DSE SQL 訓練營 - 完整后端服务
支持多种AI模型：智谱AI GLM-4-Flash、DeepSeek-V3.2、Qwen2.5-Coder-32B
提供静态文件服务和API接口
"""

from flask import Flask, request, jsonify, send_from_directory, send_file, session, redirect
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
import os
import requests
import json
import secrets
from datetime import datetime, timedelta
from dotenv import load_dotenv
from database import Database

# 尝试导入zhipuai，如果失败则AI功能不可用
try:
    from zhipuai import ZhipuAI
    ZHIPUAI_AVAILABLE = True
except ImportError:
    ZHIPUAI_AVAILABLE = False
    print("警告：zhipuai模块未安装，智谱AI功能将不可用")
    print("安装命令：pip install zhipuai")

# 加载环境变量
load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')
# 添加 ProxyFix 中间件以正确处理反向代理（NPM）的协议和主机头
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
app.secret_key = os.environ.get('SECRET_KEY', secrets.token_hex(32))
CORS(app, supports_credentials=True)  # 允许跨域请求和凭证

# 初始化數據庫
db = Database('database.db')

# 初始化智谱AI客户端
client = None
zhipu_api_key = None

# SiliconFlow API配置
try:
    from config import SILICONFLOW_API_KEY as config_sf_key
    SILICONFLOW_API_KEY = os.getenv('SILICONFLOW_API_KEY', config_sf_key if config_sf_key else '')
except:
    SILICONFLOW_API_KEY = os.getenv('SILICONFLOW_API_KEY', '')

SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/chat/completions'

if ZHIPUAI_AVAILABLE:
    # 优先使用环境变量，如果没有则尝试从config导入
    try:
        zhipu_api_key = os.getenv('ZHIPU_API_KEY')
        if not zhipu_api_key or zhipu_api_key == 'YOUR_API_KEY':
            try:
                from config import ZHIPU_API_KEY as config_key
                zhipu_api_key = config_key
            except:
                zhipu_api_key = os.getenv('ZHIPU_API_KEY', 'YOUR_API_KEY')
    except:
        zhipu_api_key = os.getenv('ZHIPU_API_KEY', 'YOUR_API_KEY')

    if zhipu_api_key == 'YOUR_API_KEY':
        print("⚠️ 警告：未设置智谱AI API密钥，GLM-4-Flash模型将不可用")
        print("方法1：在.env文件中设置 ZHIPU_API_KEY=your_key")
        print("方法2：在config.py文件中设置 ZHIPU_API_KEY = 'your_key'")
    else:
        try:
            client = ZhipuAI(api_key=zhipu_api_key)
            print("✅ 智谱AI客户端初始化成功")
        except Exception as e:
            print(f"⚠️ 智谱AI客户端初始化失败: {e}")
            client = None
else:
    print("⚠️ zhipuai模块未安装，GLM-4-Flash模型将不可用")

# 检查SiliconFlow API密钥
if not SILICONFLOW_API_KEY or SILICONFLOW_API_KEY == '':
    print("⚠️ 警告：未设置SiliconFlow API密钥，DeepSeek和Qwen模型将不可用")
    print("方法：在.env文件中设置 SILICONFLOW_API_KEY=your_key")
    print("获取API密钥：https://siliconflow.cn/")
else:
    print("✅ SiliconFlow API密钥已配置")

# 调用AI模型的通用函数
def call_ai_model(model_id, messages, temperature=0.6):
    """
    根据模型ID调用相应的AI服务
    :param model_id: 模型ID
    :param messages: 消息列表
    :param temperature: 温度参数
    :return: AI回复内容
    """
    # 智谱AI模型
    if model_id == 'glm-4-flash-250414':
        if not ZHIPUAI_AVAILABLE or not client:
            raise Exception('智譜AI服務不可用：zhipuai模組未安裝或API密鑰未配置')
        
        response = client.chat.completions.create(
            model="glm-4-flash-250414",
            messages=messages,
            temperature=temperature
        )
        return response.choices[0].message.content
    
    # SiliconFlow模型（DeepSeek和Qwen）
    elif model_id in ['deepseek-ai/DeepSeek-V3.2', 'Qwen/Qwen2.5-Coder-32B-Instruct']:
        if not SILICONFLOW_API_KEY:
            raise Exception('SiliconFlow API密鑰未配置')
        
        headers = {
            'Authorization': f'Bearer {SILICONFLOW_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': model_id,
            'messages': messages,
            'temperature': temperature
        }
        
        try:
            response = requests.post(SILICONFLOW_API_URL, headers=headers, json=payload, timeout=60)
            
            if response.status_code == 200:
                data = response.json()
                if 'choices' in data and len(data['choices']) > 0:
                    return data['choices'][0]['message']['content']
                else:
                    raise Exception('SiliconFlow API返回格式錯誤')
            else:
                error_msg = f"SiliconFlow API錯誤: {response.status_code}"
                try:
                    error_data = response.json()
                    if 'error' in error_data:
                        error_msg += f" - {error_data['error'].get('message', '')}"
                except:
                    error_msg += f" - {response.text}"
                raise Exception(error_msg)
        except requests.exceptions.Timeout:
            raise Exception('SiliconFlow API請求超時，請稍後再試')
        except requests.exceptions.RequestException as e:
            raise Exception(f'SiliconFlow API請求失敗: {str(e)}')
    
    else:
        raise Exception(f'不支持的模型: {model_id}')

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    处理AI聊天请求
    请求格式:
    {
        "message": "用户消息",
        "context": "上下文信息（可选）",
        "temperature": 0.6,
        "model": "模型ID（可选，默认glm-4-flash-250414）"
    }
    """
    try:
        data = request.json
        user_message = data.get('message', '')
        context = data.get('context', '')
        temperature = data.get('temperature', 0.6)
        model_id = data.get('model', 'glm-4-flash-250414')
        
        # 调试日志：打印接收到的模型ID和完整请求数据
        print(f"[DEBUG] /api/chat - 接收到的完整請求數據: {data}")
        print(f"[DEBUG] /api/chat - 接收到的模型ID: {model_id}")
        print(f"[DEBUG] /api/chat - 將使用模型: {model_id}")
        
        if not user_message:
            return jsonify({'error': '消息不能為空'}), 400
        
        # 根據模型ID獲取模型信息
        model_info = {
            'glm-4-flash-250414': {
                'name': 'GLM-4-Flash',
                'provider': '智譜AI',
                'description': '由智譜AI公司開發的GLM-4-Flash模型'
            },
            'deepseek-ai/DeepSeek-V3.2': {
                'name': 'DeepSeek-V3.2',
                'provider': 'DeepSeek',
                'description': '由DeepSeek公司開發的DeepSeek-V3.2模型'
            },
            'Qwen/Qwen2.5-Coder-32B-Instruct': {
                'name': 'Qwen2.5-Coder-32B',
                'provider': 'Qwen',
                'description': '由阿里巴巴開發的Qwen2.5-Coder-32B模型，專為代碼任務優化'
            }
        }.get(model_id, {
            'name': 'AI助手',
            'provider': '未知',
            'description': 'AI助手'
        })
        
        # 构建系统提示词
        system_prompt = f"""你是一個專業的SQL學習助手，專門幫助學生學習SQL資料庫查詢語言。

你當前使用的AI模型是：{model_info['name']}（{model_info['provider']}）
{model_info['description']}

你的任務是：
1. 回答學生關於SQL的問題
2. 提供SQL語法解釋和範例
3. 幫助學生理解SQL查詢語句
4. 給出學習建議和提示
5. 檢查SQL語句的正確性並給出改進建議

當學生詢問你基於什麼大模型時，請告訴他們你當前使用的是{model_info['name']}（{model_info['provider']}）。

請用繁體中文回答，語言要清晰易懂，適合中學生理解。"""
        
        if context:
            system_prompt += f"\n\n當前學習上下文：{context}"
        
        # 调用AI模型
        messages = [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_message
            }
        ]
        
        # 調用AI模型，並記錄實際使用的模型
        print(f"[DEBUG] /api/chat - 開始調用AI模型: {model_id}")
        ai_response = call_ai_model(model_id, messages, temperature)
        print(f"[DEBUG] /api/chat - AI模型調用成功，響應長度: {len(ai_response) if ai_response else 0}")
        
        return jsonify({
            'success': True,
            'message': ai_response,
            'model_used': model_id  # 返回實際使用的模型ID，方便前端確認
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/check-sql', methods=['POST'])
def check_sql():
    """
    检查SQL语句并提供反馈
    请求格式:
    {
        "sql": "SQL语句",
        "expected": "期望的SQL语句（可选）",
        "table_structure": "表结构（可选）",
        "model": "模型ID（可选）"
    }
    """
    try:
        data = request.json
        sql = data.get('sql', '')
        expected = data.get('expected', '')
        table_structure = data.get('table_structure', '')
        model_id = data.get('model', 'glm-4-flash-250414')
        
        if not sql:
            return jsonify({'error': 'SQL語句不能為空'}), 400
        
        # 构建检查提示词
        check_prompt = f"""請檢查以下SQL語句的正確性，並提供詳細的反饋：

SQL語句：
{sql}
"""
        
        if table_structure:
            check_prompt += f"\n表結構：{table_structure}"
        
        if expected:
            check_prompt += f"\n期望的SQL語句：{expected}\n請比較用戶輸入的SQL和期望的SQL，指出差異和改進建議。"
        else:
            check_prompt += "\n請檢查SQL語句的語法正確性、邏輯合理性，並提供改進建議。"
        
        # 调用AI模型
        messages = [
            {
                "role": "system",
                "content": "你是一個SQL專家，專門檢查和分析SQL語句。請用繁體中文回答，語言要清晰易懂。"
            },
            {
                "role": "user",
                "content": check_prompt
            }
        ]
        
        feedback = call_ai_model(model_id, messages, temperature=0.3)
        
        return jsonify({
            'success': True,
            'feedback': feedback
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/get-hint', methods=['POST'])
def get_hint():
    """
    根据题目生成学习提示
    请求格式:
    {
        "problem_description": "题目描述",
        "table_structure": "表结构",
        "difficulty": "难度等级",
        "model": "模型ID（可选）"
    }
    """
    try:
        data = request.json
        problem_description = data.get('problem_description', '')
        table_structure = data.get('table_structure', '')
        difficulty = data.get('difficulty', 'easy')
        model_id = data.get('model', 'glm-4-flash-250414')
        
        if not problem_description:
            return jsonify({'error': '題目描述不能為空'}), 400
        
        hint_prompt = f"""請為以下SQL題目生成一個學習提示，幫助學生理解如何解題：

題目描述：{problem_description}
"""
        
        if table_structure:
            hint_prompt += f"\n表結構：{table_structure}"
        
        hint_prompt += f"\n難度等級：{difficulty}\n\n請提供一個清晰、易懂的提示，不要直接給出答案，而是引導學生思考。"
        
        # 调用AI模型
        messages = [
            {
                "role": "system",
                "content": "你是一個SQL教學專家，擅長用簡單易懂的方式引導學生學習SQL。請用繁體中文回答。"
            },
            {
                "role": "user",
                "content": hint_prompt
            }
        ]
        
        hint = call_ai_model(model_id, messages, temperature=0.7)
        
        return jsonify({
            'success': True,
            'hint': hint
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analyze-learning', methods=['POST'])
def analyze_learning():
    """
    分析用户学习表现并生成个性化学习计划
    请求格式:
    {
        "user_progress": {
            "completedExercises": [...],
            "scores": {...},
            "studyTime": 0,
            ...
        },
        "user_profile": {
            "username": "...",
            "joinDate": "..."
        },
        "model": "模型ID（可选）"
    }
    """
    try:
        data = request.json
        user_progress = data.get('user_progress', {})
        user_profile = data.get('user_profile', {})
        model_id = data.get('model', 'glm-4-flash-250414')
        
        # 分析学习数据
        scores = user_progress.get('scores', {})
        completed_exercises = user_progress.get('completedExercises', [])
        study_time = user_progress.get('studyTime', 0)
        
        # 计算统计数据
        total_questions = 0
        total_correct = 0
        exercise_type_stats = {}
        
        for exercise_type, score_list in scores.items():
            if isinstance(score_list, list):
                exercise_type_stats[exercise_type] = {
                    'total': len(score_list),
                    'correct': sum(1 for s in score_list if s.get('correct', False))
                }
                total_questions += len(score_list)
                total_correct += sum(1 for s in score_list if s.get('correct', False))
        
        accuracy = (total_correct / total_questions * 100) if total_questions > 0 else 0
        
        # 构建分析提示词，包含詳細的數據信息
        username = user_profile.get('username', '學習者')
        join_date = user_progress.get('joinDate', '未知')
        level = user_progress.get('level', 1)
        total_score = user_progress.get('totalScore', 0)
        
        analysis_prompt = f"""請詳細分析以下SQL學習者的學習表現，並制定個性化的學習計劃：

## 學習者基本信息
- 用戶名：{username}
- 加入日期：{join_date}
- 當前等級：{level}
- 總積分：{total_score}

## 學習數據統計
- 完成練習數：{len(completed_exercises)}
- 總答題數：{total_questions}
- 正確答題數：{total_correct}
- 正確率：{accuracy:.1f}%
- 學習時長：{study_time}分鐘（約{study_time/60:.1f}小時）

## 各類型練習表現
"""
        
        if exercise_type_stats:
            for ex_type, stats in exercise_type_stats.items():
                type_name = {
                    'fill-blank': '填空題',
                    'card-arrangement': '卡片排列',
                    'drag-drop': '拖放練習',
                    'sql-practice': '整句輸入'
                }.get(ex_type, ex_type)
                
                type_accuracy = (stats['correct'] / stats['total'] * 100) if stats['total'] > 0 else 0
                analysis_prompt += f"- {type_name}：完成 {stats['total']} 題，正確 {stats['correct']} 題，正確率 {type_accuracy:.1f}%\n"
        else:
            analysis_prompt += "- 暫無練習記錄\n"
        
        # 添加詳細的答題記錄（如果有）
        if completed_exercises:
            analysis_prompt += f"\n## 已完成的練習\n"
            analysis_prompt += f"已完成以下練習：{', '.join(completed_exercises[:10])}"  # 只顯示前10個
            if len(completed_exercises) > 10:
                analysis_prompt += f" 等共 {len(completed_exercises)} 個練習\n"
        
        analysis_prompt += f"""
## 分析要求
請從以下幾個方面進行詳細分析：
1. **優勢領域**：指出學習者表現較好的方面
2. **薄弱環節**：指出需要加強的知識點
3. **學習習慣**：根據答題數據推測學習習慣
4. **個性化建議**：制定針對性的學習計劃，包括：
   - 推薦重點練習的知識點
   - 建議的學習順序
   - 預計需要的時間
   - 具體的學習方法建議

請用繁體中文回答，語言要專業但易懂，適合中學生理解。格式要清晰，使用列表和分段。
"""
        
        # 调用AI模型
        messages = [
            {
                "role": "system",
                "content": "你是一個專業的SQL學習分析專家，擅長分析學習數據並制定個性化學習計劃。請用繁體中文回答，語言要專業但易懂。"
            },
            {
                "role": "user",
                "content": analysis_prompt
            }
        ]
        
        analysis = call_ai_model(model_id, messages, temperature=0.7)
        
        return jsonify({
            'success': True,
            'analysis': analysis,
            'statistics': {
                'total_questions': total_questions,
                'total_correct': total_correct,
                'accuracy': accuracy,
                'exercise_type_stats': exercise_type_stats
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/check-sql-detailed', methods=['POST'])
def check_sql_detailed():
    """
    详细检查SQL语句（检错教官模式）
    请求格式:
    {
        "sql": "SQL语句",
        "expected": "期望的SQL语句",
        "table_structure": "表结构",
        "problem_description": "题目描述",
        "model": "模型ID（可选）"
    }
    """
    try:
        data = request.json
        sql = data.get('sql', '')
        expected = data.get('expected', '')
        table_structure = data.get('table_structure', '')
        problem_description = data.get('problem_description', '')
        model_id = data.get('model', 'glm-4-flash-250414')
        
        if not sql:
            return jsonify({'error': 'SQL語句不能為空'}), 400
        
        # 构建检错提示词
        check_prompt = f"""你是一位嚴格的SQL檢錯教官。請仔細檢查學生提交的SQL語句，找出所有錯誤並給出詳細的改進建議。

## 題目要求
{problem_description}

## 表結構
{table_structure}

## 學生提交的SQL
{sql}
"""
        
        if expected:
            check_prompt += f"""
## 參考答案
{expected}

請比較學生答案和參考答案，指出：
1. 語法錯誤（如果有）
2. 邏輯錯誤（如果有）
3. 可以改進的地方
4. 正確的寫法應該是什麼
"""
        else:
            check_prompt += """
請檢查：
1. SQL語法是否正確
2. 邏輯是否合理
3. 是否符合題目要求
4. 可以如何改進
"""
        
        check_prompt += """
請用繁體中文回答，語氣要嚴格但鼓勵，像一位負責任的教官。格式要清晰，使用列表。
"""
        
        # 调用AI模型
        messages = [
            {
                "role": "system",
                "content": "你是一位嚴格的SQL檢錯教官，對學生要求嚴格但會給予鼓勵。請用繁體中文回答，語氣要專業但易懂。"
            },
            {
                "role": "user",
                "content": check_prompt
            }
        ]
        
        feedback = call_ai_model(model_id, messages, temperature=0.3)
        
        return jsonify({
            'success': True,
            'feedback': feedback
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/update-config', methods=['POST'])
def update_config():
    """
    更新配置文件（管理員功能）
    请求格式:
    {
        "api_key": "新的API密钥"
    }
    """
    if not ZHIPUAI_AVAILABLE:
        return jsonify({
            'success': False,
            'error': 'zhipuai模块未安装，无法更新配置'
        }), 503
    
    try:
        data = request.json
        new_api_key = data.get('api_key', '')
        
        if not new_api_key:
            return jsonify({
                'success': False,
                'error': 'API密钥不能为空'
            }), 400
        
        # 更新config.py文件
        try:
            config_path = 'config.py'
            with open(config_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 替换API密钥
            import re
            pattern = r'ZHIPU_API_KEY\s*=\s*["\']([^"\']*)["\']'
            new_content = re.sub(pattern, f'ZHIPU_API_KEY = "{new_api_key}"', content)
            
            with open(config_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            # 更新当前运行的客户端
            global client, api_key
            api_key = new_api_key
            try:
                client = ZhipuAI(api_key=api_key)
                return jsonify({
                    'success': True,
                    'message': 'API密钥已更新并生效'
                })
            except Exception as e:
                return jsonify({
                    'success': False,
                    'error': f'配置文件已更新，但客户端初始化失败: {str(e)}'
                }), 500
        except Exception as e:
            return jsonify({
                'success': False,
                'error': f'更新配置文件失败: {str(e)}'
            }), 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/get-config', methods=['GET'])
def get_config():
    """
    获取当前配置（管理員功能）
    """
    try:
        # 读取config.py文件
        try:
            config_path = 'config.py'
            with open(config_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            import re
            pattern = r'ZHIPU_API_KEY\s*=\s*["\']([^"\']*)["\']'
            match = re.search(pattern, content)
            
            if match:
                current_key = match.group(1)
                # 只返回部分密钥用于显示
                if current_key and current_key != 'YOUR_API_KEY':
                    masked_key = current_key[:8] + '...' + current_key[-4:] if len(current_key) > 12 else '***'
                    return jsonify({
                        'success': True,
                        'api_key': current_key,
                        'masked_key': masked_key
                    })
                else:
                    return jsonify({
                        'success': True,
                        'api_key': None,
                        'masked_key': '未设置'
                    })
            else:
                return jsonify({
                    'success': False,
                    'error': '无法读取配置文件'
                }), 500
        except Exception as e:
            return jsonify({
                'success': False,
                'error': f'读取配置文件失败: {str(e)}'
            }), 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/test-api-key', methods=['POST'])
def test_api_key():
    """
    测试API密钥（管理員功能）
    请求格式:
    {
        "api_key": "要测试的API密钥"
    }
    """
    if not ZHIPUAI_AVAILABLE:
        return jsonify({
            'success': False,
            'error': 'zhipuai模块未安装，无法测试API密钥'
        }), 503
    
    try:
        data = request.json
        test_key = data.get('api_key', '')
        
        if not test_key:
            return jsonify({
                'success': False,
                'error': 'API密钥不能为空'
            }), 400
        
        # 使用测试密钥创建临时客户端
        try:
            test_client = ZhipuAI(api_key=test_key)
        except Exception as e:
            return jsonify({
                'success': False,
                'error': f'创建客户端失败: {str(e)}'
            }), 400
        
        # 尝试发送一个简单的测试请求
        try:
            response = test_client.chat.completions.create(
                model="glm-4-flash-250414",
                messages=[
                    {
                        "role": "user",
                        "content": "测试"
                    }
                ],
                temperature=0.1
            )
            
            return jsonify({
                'success': True,
                'message': 'API密钥测试成功'
            })
        except Exception as e:
            return jsonify({
                'success': False,
                'error': f'API密钥测试失败: {str(e)}'
            }), 400
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/test-model', methods=['POST'])
def test_model():
    """
    测试模型连接
    请求格式:
    {
        "model": "模型ID"
    }
    """
    try:
        data = request.json
        model_id = data.get('model', 'glm-4-flash-250414')
        
        if not model_id:
            return jsonify({
                'success': False,
                'error': '模型ID不能為空'
            }), 400
        
        # 构建测试消息
        test_messages = [
            {
                "role": "system",
                "content": "你是一個測試助手。請用繁體中文回答。"
            },
            {
                "role": "user",
                "content": "測試連接，請回復'連接成功'"
            }
        ]
        
        # 调用AI模型进行测试
        try:
            response_text = call_ai_model(model_id, test_messages, temperature=0.1)
            
            # 检查响应是否包含成功标识
            if response_text and len(response_text) > 0:
                return jsonify({
                    'success': True,
                    'message': f'模型 {model_id} 連接成功',
                    'response': response_text[:100]  # 只返回前100个字符
                })
            else:
                return jsonify({
                    'success': False,
                    'error': '模型返回空響應'
                }), 500
                
        except Exception as e:
            error_msg = str(e)
            # 提供更友好的错误信息
            if 'API密鑰未配置' in error_msg or 'API密钥未配置' in error_msg:
                return jsonify({
                    'success': False,
                    'error': f'API密鑰未配置，請在config.py或.env文件中設置相應的API密鑰'
                }), 503
            elif '不可用' in error_msg or '不可用' in error_msg:
                return jsonify({
                    'success': False,
                    'error': f'模型服務不可用：{error_msg}'
                }), 503
            else:
                return jsonify({
                    'success': False,
                    'error': f'連接失敗：{error_msg}'
                }), 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'測試失敗：{str(e)}'
        }), 500

# ============================================
# 用戶管理 API
# ============================================

@app.route('/api/user/register', methods=['POST'])
def register_user():
    """用戶註冊"""
    try:
        data = request.json
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # 驗證輸入
        if not username:
            return jsonify({'success': False, 'error': '用戶名不能為空'}), 400
        if not email:
            return jsonify({'success': False, 'error': '電子郵件不能為空'}), 400
        if not password:
            return jsonify({'success': False, 'error': '密碼不能為空'}), 400
        if len(password) < 6:
            return jsonify({'success': False, 'error': '密碼長度至少6個字符'}), 400
        
        # 簡單的郵箱格式驗證
        if '@' not in email or '.' not in email.split('@')[1]:
            return jsonify({'success': False, 'error': '無效的電子郵件格式'}), 400
        
        result = db.register_user(username, email, password)
        
        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': f'註冊失敗：{str(e)}'}), 500

@app.route('/api/user/login', methods=['POST'])
def login_user():
    """用戶登錄"""
    try:
        data = request.json
        username_or_email = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username_or_email or not password:
            return jsonify({'success': False, 'error': '用戶名和密碼不能為空'}), 400
        
        result = db.login_user(username_or_email, password)
        
        if result['success']:
            # 生成會話令牌
            session_token = secrets.token_urlsafe(32)
            expires_at = datetime.now() + timedelta(days=30)  # 30天過期
            
            # 獲取客戶端IP和User-Agent
            ip_address = request.remote_addr
            user_agent = request.headers.get('User-Agent', '')
            
            # 創建會話
            db.create_session(result['user_id'], session_token, expires_at, ip_address, user_agent)
            
            # 設置會話
            session['user_id'] = result['user_id']
            session['username'] = result['username']
            session['session_token'] = session_token
            
            return jsonify({
                'success': True,
                'user_id': result['user_id'],
                'username': result['username'],
                'email': result['email'],
                'session_token': session_token
            })
        else:
            return jsonify(result), 401
            
    except Exception as e:
        return jsonify({'success': False, 'error': f'登錄失敗：{str(e)}'}), 500

@app.route('/api/user/logout', methods=['POST'])
def logout_user():
    """用戶登出"""
    try:
        session_token = request.json.get('session_token') or session.get('session_token')
        if session_token:
            db.delete_session(session_token)
        
        session.clear()
        return jsonify({'success': True, 'message': '已成功登出'})
    except Exception as e:
        return jsonify({'success': False, 'error': f'登出失敗：{str(e)}'}), 500

@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    """獲取用戶資料"""
    try:
        # 從會話或請求中獲取用戶ID
        user_id = request.args.get('user_id') or session.get('user_id')
        session_token = request.args.get('session_token') or session.get('session_token')
        
        if session_token:
            session_info = db.get_session(session_token)
            if session_info['success']:
                user_id = session_info['session']['user_id']
        
        if not user_id:
            return jsonify({'success': False, 'error': '未登錄或會話無效'}), 401
        
        result = db.get_user_profile(user_id)
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 404
            
    except Exception as e:
        return jsonify({'success': False, 'error': f'獲取資料失敗：{str(e)}'}), 500

@app.route('/api/user/profile', methods=['PUT'])
def update_user_profile():
    """更新用戶資料"""
    try:
        user_id = request.json.get('user_id') or session.get('user_id')
        session_token = request.json.get('session_token') or session.get('session_token')
        
        if session_token:
            session_info = db.get_session(session_token)
            if session_info['success']:
                user_id = session_info['session']['user_id']
        
        if not user_id:
            return jsonify({'success': False, 'error': '未登錄或會話無效'}), 401
        
        # 獲取要更新的字段
        update_data = {}
        allowed_fields = ['full_name', 'avatar_url', 'bio', 'phone', 'birth_date', 'gender', 'location', 'preferences']
        
        for field in allowed_fields:
            if field in request.json:
                update_data[field] = request.json[field]
        
        if not update_data:
            return jsonify({'success': False, 'error': '沒有要更新的字段'}), 400
        
        result = db.update_user_profile(user_id, **update_data)
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': f'更新失敗：{str(e)}'}), 500

@app.route('/api/user/progress', methods=['GET'])
def get_user_progress():
    """獲取用戶學習進度"""
    try:
        user_id = request.args.get('user_id') or session.get('user_id')
        session_token = request.args.get('session_token') or session.get('session_token')
        
        if session_token:
            session_info = db.get_session(session_token)
            if session_info['success']:
                user_id = session_info['session']['user_id']
        
        if not user_id:
            return jsonify({'success': False, 'error': '未登錄或會話無效'}), 401
        
        result = db.get_user_progress(user_id)
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 404
            
    except Exception as e:
        return jsonify({'success': False, 'error': f'獲取進度失敗：{str(e)}'}), 500

@app.route('/api/user/progress', methods=['PUT'])
def update_user_progress():
    """更新用戶學習進度"""
    try:
        user_id = request.json.get('user_id') or session.get('user_id')
        session_token = request.json.get('session_token') or session.get('session_token')
        
        if session_token:
            session_info = db.get_session(session_token)
            if session_info['success']:
                user_id = session_info['session']['user_id']
        
        if not user_id:
            return jsonify({'success': False, 'error': '未登錄或會話無效'}), 401
        
        # 獲取要更新的字段
        update_data = {}
        allowed_fields = ['completed_exercises', 'scores', 'study_time', 'achievements', 'level', 'total_score']
        
        for field in allowed_fields:
            if field in request.json:
                update_data[field] = request.json[field]
        
        if not update_data:
            return jsonify({'success': False, 'error': '沒有要更新的字段'}), 400
        
        result = db.update_user_progress(user_id, **update_data)
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': f'更新失敗：{str(e)}'}), 500

@app.route('/api/user/interactive-progress', methods=['GET'])
def get_interactive_progress():
    """獲取用戶互動練習進度"""
    try:
        user_id = request.args.get('user_id') or session.get('user_id')
        session_token = request.args.get('session_token') or session.get('session_token')
        
        if session_token:
            session_info = db.get_session(session_token)
            if session_info['success']:
                user_id = session_info['session']['user_id']
        
        if not user_id:
            return jsonify({'success': False, 'error': '未登錄或會話無效'}), 401
        
        # 從user_profiles的preferences字段獲取互動練習進度
        profile = db.get_user_profile(user_id)
        if profile['success']:
            preferences = profile.get('profile', {}).get('preferences', {})
            interactive_progress = preferences.get('interactive_progress', {})
            return jsonify({'success': True, 'progress': interactive_progress})
        else:
            return jsonify({'success': True, 'progress': {}})
            
    except Exception as e:
        return jsonify({'success': False, 'error': f'獲取進度失敗：{str(e)}'}), 500

@app.route('/api/user/interactive-progress', methods=['PUT'])
def update_interactive_progress():
    """更新用戶互動練習進度"""
    try:
        user_id = request.json.get('user_id') or session.get('user_id')
        session_token = request.json.get('session_token') or session.get('session_token')
        
        if session_token:
            session_info = db.get_session(session_token)
            if session_info['success']:
                user_id = session_info['session']['user_id']
        
        if not user_id:
            return jsonify({'success': False, 'error': '未登錄或會話無效'}), 401
        
        # 獲取要更新的進度數據
        progress_data = request.json.get('progress', {})
        if not progress_data:
            return jsonify({'success': False, 'error': '沒有提供進度數據'}), 400
        
        # 獲取現有的preferences
        profile = db.get_user_profile(user_id)
        if profile['success']:
            preferences = profile.get('profile', {}).get('preferences', {})
        else:
            preferences = {}
        
        # 更新互動練習進度
        preferences['interactive_progress'] = progress_data
        
        # 更新用戶資料
        result = db.update_user_profile(user_id, preferences=preferences)
        if result['success']:
            return jsonify({'success': True, 'message': '進度已保存'})
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': f'更新失敗：{str(e)}'}), 500

# 訪問統計（簡單的內存存儲，可改為數據庫）
access_stats = []
access_log_file = 'access_log.json'

def load_access_log():
    """從文件加載訪問日誌"""
    global access_stats
    try:
        if os.path.exists(access_log_file):
            with open(access_log_file, 'r', encoding='utf-8') as f:
                access_stats = json.load(f)
    except:
        access_stats = []

def save_access_log():
    """保存訪問日誌到文件"""
    try:
        with open(access_log_file, 'w', encoding='utf-8') as f:
            json.dump(access_stats[-1000:], f, ensure_ascii=False, indent=2)  # 只保留最近1000條
    except:
        pass

# 啟動時加載日誌
load_access_log()

@app.route('/api/stats/access', methods=['GET'])
def get_access_stats():
    """獲取訪問統計數據"""
    try:
        # 返回最近24小時的數據
        now = datetime.now()
        recent_stats = []
        for stat in access_stats:
            stat_time = datetime.fromisoformat(stat.get('time', ''))
            if (now - stat_time).total_seconds() < 24 * 3600:  # 24小時內
                recent_stats.append(stat)
        
        return jsonify({
            'success': True,
            'data': recent_stats
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/stats/access', methods=['POST'])
def record_access():
    """記錄訪問次數"""
    try:
        now = datetime.now()
        access_stats.append({
            'time': now.isoformat(),
            'date': now.strftime('%Y-%m-%d %H:%M'),
            'count': 1,
            'access_count': 1
        })
        save_access_log()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 在每個請求前記錄訪問（簡單實現）
@app.before_request
def log_access():
    """記錄訪問請求"""
    if request.path not in ['/api/stats/access', '/favicon.ico']:
        try:
            now = datetime.now()
            # 按小時聚合
            hour_key = now.strftime('%Y-%m-%d %H:00')
            
            # 查找是否已有該小時的記錄
            found = False
            for stat in access_stats:
                if stat.get('date', '').startswith(hour_key):
                    stat['count'] = stat.get('count', 0) + 1
                    stat['access_count'] = stat.get('access_count', 0) + 1
                    found = True
                    break
            
            if not found:
                access_stats.append({
                    'time': now.isoformat(),
                    'date': hour_key,
                    'count': 1,
                    'access_count': 1
                })
            
            # 定期保存（每10次訪問保存一次）
            if len(access_stats) % 10 == 0:
                save_access_log()
        except:
            pass

@app.route('/api/user/check-username', methods=['POST'])
def check_username():
    """檢查用戶名是否存在"""
    try:
        data = request.json
        username = data.get('username', '').strip()
        
        if not username:
            return jsonify({'success': False, 'error': '用戶名不能為空'}), 400
        
        exists = db.check_username_exists(username)
        return jsonify({'success': True, 'exists': exists})
        
    except Exception as e:
        return jsonify({'success': False, 'error': f'檢查失敗：{str(e)}'}), 500

@app.route('/api/user/check-email', methods=['POST'])
def check_email():
    """檢查郵箱是否存在"""
    try:
        data = request.json
        email = data.get('email', '').strip()
        
        if not email:
            return jsonify({'success': False, 'error': '電子郵件不能為空'}), 400
        
        exists = db.check_email_exists(email)
        return jsonify({'success': True, 'exists': exists})
        
    except Exception as e:
        return jsonify({'success': False, 'error': f'檢查失敗：{str(e)}'}), 500

@app.route('/api/user/session', methods=['GET'])
def get_session():
    """驗證會話"""
    try:
        session_token = request.args.get('session_token') or session.get('session_token')
        
        if not session_token:
            return jsonify({'success': False, 'error': '會話令牌不存在'}), 401
        
        result = db.get_session(session_token)
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 401
            
    except Exception as e:
        return jsonify({'success': False, 'error': f'驗證失敗：{str(e)}'}), 500

@app.route('/api/user/ai-model', methods=['GET'])
def get_user_ai_model():
    """獲取用戶選擇的 AI 模型"""
    try:
        user_id = request.args.get('user_id') or session.get('user_id')
        session_token = request.args.get('session_token') or session.get('session_token')
        
        if session_token:
            session_info = db.get_session(session_token)
            if session_info['success']:
                user_id = session_info['session']['user_id']
        
        if not user_id:
            return jsonify({
                'success': True,
                'model': 'glm-4-flash-250414'  # 未登錄時返回默認模型
            })
        
        result = db.get_user_profile(user_id)
        if result['success']:
            preferences = result['profile'].get('preferences', {})
            if isinstance(preferences, str):
                try:
                    preferences = json.loads(preferences)
                except:
                    preferences = {}
            
            selected_model = preferences.get('ai_model', 'glm-4-flash-250414')
            return jsonify({
                'success': True,
                'model': selected_model
            })
        else:
            return jsonify({
                'success': True,
                'model': 'glm-4-flash-250414'  # 默認模型
            })
            
    except Exception as e:
        return jsonify({
            'success': True,
            'model': 'glm-4-flash-250414'  # 出錯時返回默認模型
        })

@app.route('/api/user/ai-model', methods=['PUT'])
def set_user_ai_model():
    """設置用戶選擇的 AI 模型"""
    try:
        user_id = request.json.get('user_id') or session.get('user_id')
        session_token = request.json.get('session_token') or session.get('session_token')
        model_id = request.json.get('model', 'glm-4-flash-250414')
        
        # 驗證模型ID
        valid_models = ['glm-4-flash-250414', 'deepseek-ai/DeepSeek-V3.2', 'Qwen/Qwen2.5-Coder-32B-Instruct']
        if model_id not in valid_models:
            return jsonify({
                'success': False,
                'error': f'無效的模型ID。支持的模型：{", ".join(valid_models)}'
            }), 400
        
        if session_token:
            session_info = db.get_session(session_token)
            if session_info['success']:
                user_id = session_info['session']['user_id']
        
        if not user_id:
            return jsonify({'success': False, 'error': '未登錄或會話無效'}), 401
        
        # 獲取當前偏好設置
        profile_result = db.get_user_profile(user_id)
        if profile_result['success']:
            preferences = profile_result['profile'].get('preferences', {})
            if isinstance(preferences, str):
                try:
                    preferences = json.loads(preferences)
                except:
                    preferences = {}
        else:
            preferences = {}
        
        # 更新模型偏好
        preferences['ai_model'] = model_id
        
        # 更新用戶資料
        result = db.update_user_profile(user_id, preferences=preferences)
        if result['success']:
            return jsonify({
                'success': True,
                'model': model_id,
                'message': 'AI模型偏好已更新'
            })
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': f'設置失敗：{str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health():
    """健康检查接口"""
    return jsonify({
        'status': 'ok',
        'service': 'DSE SQL 訓練營 完整服务',
        'features': {
            'ai_service': True,
            'static_files': True,
            'api_endpoints': True,
            'database': True,
            'user_management': True
        }
    })

# HTTP 到 HTTPS 重定向（必须在所有路由之前）
@app.before_request
def force_https():
    """将 HTTP 请求重定向到 HTTPS（仅对目标域名）"""
    # 获取主机名（去掉端口号）
    host = request.host.split(':')[0]
    
    # 目标域名列表
    target_domains = ['icthelper.duckdns.org']
    
    # 只对 HTTP 协议且 host 是目标域名的情况做重定向
    if request.scheme == 'http' and host in target_domains:
        # 重定向到 HTTPS 版本（保持原始 URL，但去掉端口号）
        https_url = request.url.replace('http://', 'https://', 1)
        # 如果 URL 中包含端口号，去掉它
        if ':5000' in https_url:
            https_url = https_url.replace(':5000', '')
        return redirect(https_url, code=301)

# SSL 证书验证路径（必须在根路径之前）
@app.route('/.well-known/acme-challenge/<path:filename>')
def acme_challenge(filename):
    """Let's Encrypt SSL 证书验证文件"""
    challenge_dir = '/tmp/letsencrypt'
    if os.path.exists(challenge_dir):
        try:
            return send_from_directory(challenge_dir, filename)
        except:
            pass
    # 如果文件不存在，返回 404
    return jsonify({'error': 'Challenge file not found'}), 404

# 静态文件服务（必须在所有API路由之后定义）
@app.route('/')
def index():
    """主页"""
    return send_file('index.html')

@app.route('/<path:path>')
def serve_static(path):
    """提供静态文件服务（API路由优先）"""
    # 跳过API路由
    if path.startswith('api/'):
        return jsonify({'error': 'API endpoint not found'}), 404
    
    # 如果是HTML文件，直接返回
    if path.endswith('.html'):
        try:
            return send_file(path)
        except:
            return jsonify({'error': 'File not found'}), 404
    
    # 其他静态文件（JS, CSS, 图片等）
    try:
        return send_from_directory('.', path)
    except:
        return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    # 生产环境配置
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    print("=" * 50)
    print("  DSE SQL 訓練營 - 完整后端服务")
    print("=" * 50)
    print(f"  服务地址: http://0.0.0.0:{port}")
    print(f"  本地访问: http://localhost:{port}")
    print("=" * 50)
    print("  功能:")
    print("  ✓ 静态文件服务（HTML, JS, CSS等）")
    print("  ✓ AI助手API接口")
    print("  ✓ 用户管理系统（SQLite数据库）")
    print("  ✓ 健康检查接口")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=port, debug=debug, threaded=True)

