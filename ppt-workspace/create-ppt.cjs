const pptxgen = require('pptxgenjs')

const WORKSPACE = '/Users/liguang/Desktop/project/practice/gemini3/ppt-workspace'

async function createPresentation() {
  console.log('Creating PowerPoint presentation...')

  const pptx = new pptxgen()
  pptx.layout = 'LAYOUT_16x9'
  pptx.title = '灵机 CyberDivination - AI 算命 H5 应用介绍'
  pptx.author = 'AI Assistant'
  pptx.subject = '项目功能介绍'

  // 颜色定义 (不带#)
  const CYAN = '00FFCC'
  const RED = 'FF2A2A'
  const BG = '0a0a0a'
  const WHITE = 'FFFFFF'
  const GRAY = 'AAAAAA'

  // Slide 1: 封面
  console.log('Creating slide 1: Cover...')
  let slide = pptx.addSlide()
  slide.background = { color: BG }

  // 顶部装饰线
  slide.addShape(pptx.shapes.RECTANGLE, { x: 3.5, y: 1.2, w: 3, h: 0.03, fill: { color: CYAN } })

  // 标题
  slide.addText('灵机 CyberDivination', {
    x: 0,
    y: 2,
    w: '100%',
    h: 0.8,
    fontSize: 44,
    fontFace: 'Arial',
    color: CYAN,
    bold: true,
    align: 'center'
  })

  // 副标题
  slide.addText('AI 算命 H5 应用', {
    x: 0,
    y: 2.9,
    w: '100%',
    h: 0.5,
    fontSize: 24,
    fontFace: 'Arial',
    color: WHITE,
    align: 'center'
  })

  // 标语
  slide.addText('融合传统玄学与现代AI技术的创新体验', {
    x: 0,
    y: 3.6,
    w: '100%',
    h: 0.4,
    fontSize: 16,
    fontFace: 'Arial',
    color: RED,
    align: 'center'
  })

  // 底部装饰线
  slide.addShape(pptx.shapes.RECTANGLE, { x: 3.5, y: 4.3, w: 3, h: 0.03, fill: { color: RED } })

  // Slide 2: 项目概述
  console.log('Creating slide 2: Overview...')
  slide = pptx.addSlide()
  slide.background = { color: BG }

  // 标题区域
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 0.5, w: 0.15, h: 0.15, fill: { color: CYAN } })
  slide.addText('项目概述', {
    x: 0.8,
    y: 0.4,
    w: 4,
    h: 0.5,
    fontSize: 28,
    fontFace: 'Arial',
    color: CYAN,
    bold: true
  })

  // 内容
  slide.addText('灵机是一款创新的 AI 算命 H5 应用，将传统东方玄学智慧与现代人工智能技术完美融合，为用户提供个性化的命理解读服务。', {
    x: 0.5,
    y: 1.3,
    w: 9,
    h: 0.8,
    fontSize: 16,
    fontFace: 'Arial',
    color: WHITE,
    lineSpacing: 28
  })

  slide.addText('应用采用独特的"新中式赛博"视觉风格，通过沉浸式的交互体验，让用户在科技与传统之间找到平衡，获得娱乐性的算命体验。', {
    x: 0.5,
    y: 2.3,
    w: 9,
    h: 0.8,
    fontSize: 16,
    fontFace: 'Arial',
    color: WHITE,
    lineSpacing: 28
  })

  // 高亮框
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 3.4, w: 0.05, h: 0.6, fill: { color: CYAN } })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 3.4, w: 9, h: 0.6, fill: { color: CYAN, transparency: 90 } })
  slide.addText('核心理念：传统玄学 × 现代科技 = 创新体验', {
    x: 0.7,
    y: 3.5,
    w: 8.5,
    h: 0.4,
    fontSize: 14,
    fontFace: 'Arial',
    color: CYAN
  })

  // Slide 3: 核心功能
  console.log('Creating slide 3: Core Features...')
  slide = pptx.addSlide()
  slide.background = { color: BG }

  // 标题
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 0.4, w: 0.15, h: 0.15, fill: { color: RED } })
  slide.addText('核心功能', {
    x: 0.8,
    y: 0.3,
    w: 4,
    h: 0.5,
    fontSize: 26,
    fontFace: 'Arial',
    color: CYAN,
    bold: true
  })

  // 功能卡片
  const features = [
    { num: '01', title: 'AI 智能算命', desc: '接入 DeepSeek 大模型，根据用户姓名、生辰、性别提供个性化的运势解读', x: 0.5, y: 1.1 },
    { num: '02', title: '新中式赛博风格', desc: '独特的视觉设计语言，将传统八卦、五行等玄学元素与赛博朋克美学融合', x: 5.1, y: 1.1 },
    { num: '03', title: '沉浸式体验', desc: '精心设计的过渡动画、粒子效果和交互反馈，让用户获得仪式感和沉浸感', x: 0.5, y: 2.9 },
    { num: '04', title: '离线备用方案', desc: '当 API 不可用时自动切换到本地算法生成结果，确保用户体验的连续性', x: 5.1, y: 2.9 }
  ]

  features.forEach((f) => {
    slide.addShape(pptx.shapes.RECTANGLE, { x: f.x, y: f.y, w: 4.4, h: 1.6, fill: { color: WHITE, transparency: 97 }, line: { color: WHITE, transparency: 90, pt: 1 } })
    slide.addText(f.num, { x: f.x + 0.2, y: f.y + 0.15, w: 1, h: 0.4, fontSize: 22, fontFace: 'Arial', color: RED, bold: true })
    slide.addText(f.title, { x: f.x + 0.2, y: f.y + 0.55, w: 4, h: 0.3, fontSize: 14, fontFace: 'Arial', color: CYAN, bold: true })
    slide.addText(f.desc, { x: f.x + 0.2, y: f.y + 0.9, w: 4, h: 0.6, fontSize: 11, fontFace: 'Arial', color: WHITE, lineSpacing: 18 })
  })

  // Slide 4: 技术架构
  console.log('Creating slide 4: Tech Stack...')
  slide = pptx.addSlide()
  slide.background = { color: BG }

  // 标题
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 0.4, w: 0.15, h: 0.15, fill: { color: CYAN } })
  slide.addText('技术架构', {
    x: 0.8,
    y: 0.3,
    w: 4,
    h: 0.5,
    fontSize: 26,
    fontFace: 'Arial',
    color: CYAN,
    bold: true
  })

  // 左侧
  slide.addText('前端框架', { x: 0.5, y: 1.1, w: 3, h: 0.3, fontSize: 14, fontFace: 'Arial', color: RED, bold: true })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 4.3, h: 0.02, fill: { color: RED, transparency: 70 } })

  const leftTech = [
    { badge: 'React 18', desc: '现代化UI框架' },
    { badge: 'TypeScript', desc: '类型安全' },
    { badge: 'Vite', desc: '极速构建工具' }
  ]
  leftTech.forEach((t, i) => {
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 1.6 + i * 0.45, w: 1.2, h: 0.3, fill: { color: CYAN, transparency: 85 } })
    slide.addText(t.badge, { x: 0.5, y: 1.6 + i * 0.45, w: 1.2, h: 0.3, fontSize: 10, fontFace: 'Arial', color: CYAN, align: 'center', valign: 'middle' })
    slide.addText(t.desc, { x: 1.8, y: 1.6 + i * 0.45, w: 2, h: 0.3, fontSize: 11, fontFace: 'Arial', color: WHITE, valign: 'middle' })
  })

  slide.addText('样式与动画', { x: 0.5, y: 3.1, w: 3, h: 0.3, fontSize: 14, fontFace: 'Arial', color: RED, bold: true })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 3.4, w: 4.3, h: 0.02, fill: { color: RED, transparency: 70 } })

  const leftTech2 = [
    { badge: 'Tailwind CSS', desc: '原子化CSS' },
    { badge: 'Framer Motion', desc: '流畅动画' }
  ]
  leftTech2.forEach((t, i) => {
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 3.6 + i * 0.45, w: 1.5, h: 0.3, fill: { color: CYAN, transparency: 85 } })
    slide.addText(t.badge, { x: 0.5, y: 3.6 + i * 0.45, w: 1.5, h: 0.3, fontSize: 10, fontFace: 'Arial', color: CYAN, align: 'center', valign: 'middle' })
    slide.addText(t.desc, { x: 2.1, y: 3.6 + i * 0.45, w: 2, h: 0.3, fontSize: 11, fontFace: 'Arial', color: WHITE, valign: 'middle' })
  })

  // 右侧
  slide.addText('AI 服务', { x: 5.1, y: 1.1, w: 3, h: 0.3, fontSize: 14, fontFace: 'Arial', color: RED, bold: true })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 5.1, y: 1.4, w: 4.3, h: 0.02, fill: { color: RED, transparency: 70 } })

  const rightTech = [
    { badge: 'DeepSeek API', desc: '大语言模型' },
    { badge: 'Prompt Eng.', desc: '命理提示词' }
  ]
  rightTech.forEach((t, i) => {
    slide.addShape(pptx.shapes.RECTANGLE, { x: 5.1, y: 1.6 + i * 0.45, w: 1.4, h: 0.3, fill: { color: CYAN, transparency: 85 } })
    slide.addText(t.badge, { x: 5.1, y: 1.6 + i * 0.45, w: 1.4, h: 0.3, fontSize: 10, fontFace: 'Arial', color: CYAN, align: 'center', valign: 'middle' })
    slide.addText(t.desc, { x: 6.6, y: 1.6 + i * 0.45, w: 2, h: 0.3, fontSize: 11, fontFace: 'Arial', color: WHITE, valign: 'middle' })
  })

  slide.addText('功能特性', { x: 5.1, y: 2.7, w: 3, h: 0.3, fontSize: 14, fontFace: 'Arial', color: RED, bold: true })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 5.1, y: 3, w: 4.3, h: 0.02, fill: { color: RED, transparency: 70 } })

  const rightTech2 = [
    { badge: 'html-to-image', desc: '结果保存' },
    { badge: 'Web Share API', desc: '社交分享' },
    { badge: 'localStorage', desc: '历史记录' }
  ]
  rightTech2.forEach((t, i) => {
    slide.addShape(pptx.shapes.RECTANGLE, { x: 5.1, y: 3.2 + i * 0.45, w: 1.4, h: 0.3, fill: { color: CYAN, transparency: 85 } })
    slide.addText(t.badge, { x: 5.1, y: 3.2 + i * 0.45, w: 1.4, h: 0.3, fontSize: 10, fontFace: 'Arial', color: CYAN, align: 'center', valign: 'middle' })
    slide.addText(t.desc, { x: 6.6, y: 3.2 + i * 0.45, w: 2, h: 0.3, fontSize: 11, fontFace: 'Arial', color: WHITE, valign: 'middle' })
  })

  // Slide 5: 用户流程
  console.log('Creating slide 5: User Flow...')
  slide = pptx.addSlide()
  slide.background = { color: BG }

  // 标题
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 0.4, w: 0.15, h: 0.15, fill: { color: RED } })
  slide.addText('用户流程', {
    x: 0.8,
    y: 0.3,
    w: 4,
    h: 0.5,
    fontSize: 26,
    fontFace: 'Arial',
    color: CYAN,
    bold: true
  })

  // 流程步骤
  const steps = [
    { num: '1', title: '输入信息', desc: '姓名、生辰\n性别、问询方向', x: 0.8 },
    { num: '2', title: 'AI 推算', desc: '大模型分析\n命理生成解读', x: 3.0 },
    { num: '3', title: '查看结果', desc: '灵签、五行\n宜忌、幸运信息', x: 5.2 },
    { num: '4', title: '保存分享', desc: '保存灵符图片\n或社交分享', x: 7.4 }
  ]

  steps.forEach((s, i) => {
    // 圆圈
    slide.addShape(pptx.shapes.OVAL, { x: s.x + 0.3, y: 1.5, w: 0.8, h: 0.8, fill: { color: CYAN, transparency: 90 }, line: { color: CYAN, pt: 2 } })
    slide.addText(s.num, { x: s.x + 0.3, y: 1.6, w: 0.8, h: 0.6, fontSize: 22, fontFace: 'Arial', color: CYAN, bold: true, align: 'center', valign: 'middle' })
    // 标题
    slide.addText(s.title, { x: s.x, y: 2.5, w: 1.4, h: 0.3, fontSize: 13, fontFace: 'Arial', color: WHITE, bold: true, align: 'center' })
    // 描述
    slide.addText(s.desc, { x: s.x, y: 2.9, w: 1.4, h: 0.7, fontSize: 10, fontFace: 'Arial', color: GRAY, align: 'center', lineSpacing: 16 })

    // 箭头 (除了最后一个)
    if (i < 3) {
      slide.addText('→', { x: s.x + 1.5, y: 1.7, w: 0.5, h: 0.4, fontSize: 24, fontFace: 'Arial', color: RED, align: 'center' })
    }
  })

  // Slide 6: 算命结果内容
  console.log('Creating slide 6: Result Content...')
  slide = pptx.addSlide()
  slide.background = { color: BG }

  // 标题
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 0.4, w: 0.15, h: 0.15, fill: { color: CYAN } })
  slide.addText('算命结果内容', {
    x: 0.8,
    y: 0.3,
    w: 4,
    h: 0.5,
    fontSize: 26,
    fontFace: 'Arial',
    color: CYAN,
    bold: true
  })

  // 结果卡片
  const results = [
    { title: '灵签判词', desc: 'AI 生成的四句古典诗词风格判词，每句七字', example: '"紫微星照命宫明"', x: 0.5, y: 1.1 },
    { title: '五行能量', desc: '根据八字命理推算的五行能量分布，雷达图可视化', example: '金木水火土 0-100', x: 3.5, y: 1.1 },
    { title: '详细解读', desc: '300-400字的通俗命理分析，涵盖性格、运势', example: '分段落展示', x: 6.5, y: 1.1 },
    { title: '今日宜忌', desc: '结合现代生活场景的宜忌建议，各4条', example: '宜：提交代码', x: 0.5, y: 2.75 },
    { title: '幸运数字', desc: '根据命理推算的 1-9 幸运数字', example: '大字展示', x: 3.5, y: 2.75 },
    { title: '幸运颜色', desc: '14种颜色选项，动态配色展示', example: '红橙黄绿青蓝紫', x: 6.5, y: 2.75 }
  ]

  results.forEach((r) => {
    slide.addShape(pptx.shapes.RECTANGLE, { x: r.x, y: r.y, w: 2.8, h: 1.45, fill: { color: WHITE, transparency: 97 }, line: { color: CYAN, transparency: 80, pt: 1 } })
    slide.addText(r.title, { x: r.x + 0.15, y: r.y + 0.1, w: 2.5, h: 0.3, fontSize: 13, fontFace: 'Arial', color: CYAN, bold: true })
    slide.addText(r.desc, { x: r.x + 0.15, y: r.y + 0.45, w: 2.5, h: 0.55, fontSize: 10, fontFace: 'Arial', color: WHITE, lineSpacing: 16 })
    slide.addText(r.example, { x: r.x + 0.15, y: r.y + 1.05, w: 2.5, h: 0.25, fontSize: 9, fontFace: 'Arial', color: RED, italic: true })
  })

  // Slide 7: 总结
  console.log('Creating slide 7: Summary...')
  slide = pptx.addSlide()
  slide.background = { color: BG }

  // 顶部装饰线
  slide.addShape(pptx.shapes.RECTANGLE, { x: 3.5, y: 1, w: 3, h: 0.03, fill: { color: CYAN } })

  // 标题
  slide.addText('灵机 · 天机已显', {
    x: 0,
    y: 1.5,
    w: '100%',
    h: 0.6,
    fontSize: 36,
    fontFace: 'Arial',
    color: CYAN,
    bold: true,
    align: 'center'
  })

  // 要点
  const points = ['✦  传统玄学与现代 AI 的创新融合', '✦  独特的新中式赛博视觉风格', '✦  沉浸式的交互体验设计', '✦  完善的技术架构与用户体验']

  points.forEach((p, i) => {
    slide.addText(p, {
      x: 0,
      y: 2.3 + i * 0.45,
      w: '100%',
      h: 0.4,
      fontSize: 16,
      fontFace: 'Arial',
      color: WHITE,
      align: 'center'
    })
  })

  // 底部装饰线
  slide.addShape(pptx.shapes.RECTANGLE, { x: 3.5, y: 4.3, w: 3, h: 0.03, fill: { color: RED } })

  // 页脚
  slide.addText('仅供娱乐 · 理性看待', {
    x: 0,
    y: 4.6,
    w: '100%',
    h: 0.3,
    fontSize: 14,
    fontFace: 'Arial',
    color: GRAY,
    align: 'center'
  })

  // 保存
  const outputPath = `${WORKSPACE}/CyberDivination-介绍.pptx`
  await pptx.writeFile({ fileName: outputPath })
  console.log(`\nPresentation saved to: ${outputPath}`)
}

createPresentation().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
