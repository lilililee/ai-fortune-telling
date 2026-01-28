import type { FormData, DivinationResult } from '@/types'

// DeepSeek API 配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

// 获取 API Key（从环境变量）
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('VITE_DEEPSEEK_API_KEY 环境变量未设置')
  }
  return apiKey
}

// 格式化日期为中文
const formatBirthDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()

  return `${year}年${month}月${day}日 ${hour}时`
}

// 映射性别
const formatGender = (gender: string | null): string => {
  if (gender === 'male') return '男'
  if (gender === 'female') return '女'
  return '未知'
}

// 映射问询方向
const formatQuery = (query: string): string => {
  const queryMap: Record<string, string> = {
    comprehensive: '综合运势',
    career: '事业运势',
    love: '感情运势',
    wealth: '财运'
  }
  return queryMap[query] || '综合运势'
}

// 构建算命提示词
const buildDivinationPrompt = (formData: FormData): string => {
  const birthDateStr = formData.birthDate ? formatBirthDate(formData.birthDate) : '未提供'
  const genderStr = formatGender(formData.gender)
  const queryStr = formatQuery(formData.query)

  return `你是一位精通中国传统命理学的AI大师，结合了紫微斗数、八字命理、易经等传统智慧。现在有一位求测者前来问卦，请根据以下信息进行推算：

【求测者信息】
- 姓名：${formData.name}
- 出生时间：${birthDateStr}
- 性别：${genderStr}
- 问询方向：${queryStr}

请你根据这些信息，用传统命理学的方式进行分析，并返回以下格式的JSON结果（注意：只返回JSON，不要有其他内容）：

{
  "verse": ["四句诗的第一句", "四句诗的第二句", "四句诗的第三句", "四句诗的第四句"],
  "elementalEnergy": {
    "wood": 0-100的数字,
    "fire": 0-100的数字,
    "earth": 0-100的数字,
    "metal": 0-100的数字,
    "water": 0-100的数字
  },
  "interpretation": "详细的命理解读文本",
  "advice": {
    "suitable": ["宜做的事1", "宜做的事2", "宜做的事3", "宜做的事4"],
    "avoid": ["忌做的事1", "忌做的事2", "忌做的事3", "忌做的事4"]
  },
  "luckyNumber": 1-9的幸运数字,
  "luckyColor": "幸运颜色（必须从以下选择：红色、橙色、黄色、绿色、青色、蓝色、紫色、粉色、白色、黑色、金色、银色、棕色、灰色）"
}

要求：
1. verse 要写成古典诗词风格的四句判词，每句7个字，要有文采且与命主信息相关
2. elementalEnergy 五行能量要根据出生时间和八字命理推算，这是五行各自的能量强弱值（不是比例分配）：
   - 每个元素独立计算，范围0-100，表示该行能量的强弱程度
   - 五个数值的总和不需要等于100，各自独立评估
   - 例如：日主属水，则水的能量可能较高(70-85)；如果火弱，火可能只有20-40
   - 要有明显的强弱差异和层次感，避免五行数值过于接近或平均
3. interpretation 解读要详细丰富，总字数300-400字，用通俗易懂的语言描述：
   - 命主性格特点：用生动的比喻描述命主的性格倾向和天赋
   - ${queryStr}运势详解：针对问询方向的具体分析，描述近期的运势走向、可能遇到的机遇与挑战
   - 流年运势：用通俗的话语描述今年整体运势走向
   - 开运建议：给出具体可行的建议，可以涉及穿着、饮食、方位、社交等方面
   【重要】禁止使用大量专业术语如"甲戌、壬申、丁卯、庚子"等天干地支组合，如需提及五行属性，请用"属水"、"属火"等简单表述
   【重要】interpretation 文本必须使用换行符(\\n)分成4-5个段落，每个段落聚焦一个主题，语言要亲切易懂
4. advice 中的宜忌要结合现代生活场景，用简洁的词语表达
5. luckyColor 必须从以下颜色中选择一个：红色、橙色、黄色、绿色、青色、蓝色、紫色、粉色、白色、黑色、金色、银色、棕色、灰色
6. 整体风格要有神秘感和仪式感，但内容积极正向，语言典雅且通俗易懂，让普通人也能轻松理解

请直接返回JSON，不要包含markdown代码块标记或其他说明文字。`
}

// 解析 AI 响应
const parseAIResponse = (content: string): DivinationResult => {
  try {
    // 尝试直接解析 JSON
    let jsonStr = content.trim()

    // 如果响应被包裹在代码块中，提取 JSON
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim()
    }

    const result = JSON.parse(jsonStr) as DivinationResult

    // 验证必要字段
    if (!result.verse || !Array.isArray(result.verse) || result.verse.length !== 4) {
      throw new Error('Invalid verse format')
    }

    if (!result.elementalEnergy) {
      throw new Error('Missing elementalEnergy')
    }

    // 确保数值在合理范围内
    const clampValue = (val: number) => Math.max(0, Math.min(100, Math.round(val)))
    result.elementalEnergy = {
      wood: clampValue(result.elementalEnergy.wood),
      fire: clampValue(result.elementalEnergy.fire),
      earth: clampValue(result.elementalEnergy.earth),
      metal: clampValue(result.elementalEnergy.metal),
      water: clampValue(result.elementalEnergy.water)
    }

    // 确保幸运数字在范围内
    result.luckyNumber = Math.max(1, Math.min(9, Math.round(result.luckyNumber)))

    return result
  } catch (error) {
    console.error('Failed to parse AI response:', error)
    console.error('Raw content:', content)
    throw new Error('无法解析 AI 响应')
  }
}

// 调用 DeepSeek API 进行算命
export const getDivination = async (formData: FormData): Promise<DivinationResult> => {
  const apiKey = getApiKey()
  const prompt = buildDivinationPrompt(formData)

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一位精通中国传统命理学的AI大师。你的回答必须是纯JSON格式，不要包含任何其他文字或markdown标记。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8, // 稍高的温度以增加创造性
      max_tokens: 2000
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('DeepSeek API error:', errorData)
    throw new Error(`API 请求失败: ${response.status}`)
  }

  const data = await response.json()

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('API 响应格式错误')
  }

  const content = data.choices[0].message.content
  return parseAIResponse(content)
}

// 默认的 fallback 结果（当 API 失败时使用）
export const getFallbackResult = (formData: FormData): DivinationResult => {
  // 根据姓名生成一些随机但一致的值
  const nameHash = formData.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // 生成有层次感的五行能量值（独立评估，不是比例分配）
  const baseEnergies = [75, 45, 60, 35, 80] // 基础能量差异
  const shuffled = [...baseEnergies].sort(() => (nameHash % 3) - 1)

  return {
    verse: ['紫微星照命宫明', '财官双美福禄盈', '但得贵人相扶助', '一路顺风万事成'],
    elementalEnergy: {
      wood: Math.min(100, shuffled[0] + (nameHash % 15)),
      fire: Math.min(100, shuffled[1] + (nameHash % 20)),
      earth: Math.min(100, shuffled[2] + (nameHash % 18)),
      metal: Math.min(100, shuffled[3] + (nameHash % 25)),
      water: Math.min(100, shuffled[4] + (nameHash % 12))
    },
    interpretation: `命主${formData.name}，生于庚辰年冬月，八字为庚辰、戊子、壬戌、庚子。日主壬水，生于子月，水势旺盛，然土金两透，官印相生，格局清奇。财星藏于戌库，待时而发。

少年行运多奔波，中年后财运渐入佳境。尤以火土流年最为得力，需注意人际关系中暗藏竞争，避免因小失大。命带天乙贵人，遇事多有转机，宜稳中求进，不可急功近利。

当前流年运势平稳，事业方面有贵人相助，宜把握机遇，积极进取。财运亨通，但需量入为出，避免冲动消费。感情方面桃花运旺，单身者易遇良缘，有伴者感情和谐。

开运建议：可佩戴金属饰品增强自身气场，居家宜摆放绿植调和五行。工作中多与年长者交流，可获贵人提携。总体运势向好，宜积极乐观面对生活，把握每一次机遇。`,
    advice: {
      suitable: ['Code Review', '提交代码', '团队会议', '学习新技术'],
      avoid: ['部署上线', '重构核心模块', '删库跑路', '通宵加班']
    },
    luckyNumber: (nameHash % 9) + 1,
    luckyColor: ['红色', '黄色', '青色', '白色', '黑色'][nameHash % 5]
  }
}
