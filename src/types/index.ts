// 应用阶段类型
export type AppPhase = 'splash' | 'input' | 'processing' | 'result'

// 性别类型
export type Gender = 'male' | 'female'

// 问询方向类型
export type QueryType = 'comprehensive' | 'career' | 'love' | 'wealth'

// 用户表单数据类型
export interface FormData {
  name: string
  birthDate?: Date
  gender: Gender | null
  query: string
}

// 算命结果类型
export interface DivinationResult {
  // 灵签/判词
  verse: string[]
  // 五行能量分布
  elementalEnergy: {
    wood: number // 木
    fire: number // 火
    earth: number // 土
    metal: number // 金
    water: number // 水
  }
  // AI 详细解读
  interpretation: string
  // 今日宜忌
  advice: {
    suitable: string[] // 宜
    avoid: string[] // 忌
  }
  // 幸运数字
  luckyNumber: number
  // 幸运颜色
  luckyColor: string
}
