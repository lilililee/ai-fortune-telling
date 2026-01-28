const pptxgen = require('pptxgenjs')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const SKILLS_PATH = '/Users/liguang/.cursor/projects/Users-liguang-Desktop-project-practice-gemini3/skills/skills/skills/pptx'
const html2pptx = require(path.join(SKILLS_PATH, 'scripts/html2pptx.js'))

const WORKSPACE = '/Users/liguang/Desktop/project/practice/gemini3/ppt-workspace'
const SLIDES_DIR = path.join(WORKSPACE, 'slides')

// 创建渐变背景
async function createGradientBackground(filename, color1, color2, angle = 135) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="810">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1}"/>
        <stop offset="100%" style="stop-color:${color2}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`
  await sharp(Buffer.from(svg)).png().toFile(filename)
  return filename
}

// 创建装饰线条
async function createDecoLine(filename, color, width = 200, height = 2) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="${color}" rx="1"/>
  </svg>`
  await sharp(Buffer.from(svg)).png().toFile(filename)
  return filename
}

// 创建八卦符号图片
async function createBaguaIcon(filename, color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
    <text x="40" y="60" font-size="60" text-anchor="middle" fill="${color}" font-family="Arial">☰</text>
  </svg>`
  await sharp(Buffer.from(svg)).png().toFile(filename)
  return filename
}

async function createPresentation() {
  console.log('Creating gradient backgrounds...')

  // 创建背景和装饰元素
  await createGradientBackground(path.join(SLIDES_DIR, 'bg-dark.png'), '#0a0a0a', '#1a1a2e')
  await createDecoLine(path.join(SLIDES_DIR, 'line-cyan.png'), '#00FFCC', 300, 3)
  await createDecoLine(path.join(SLIDES_DIR, 'line-red.png'), '#FF2A2A', 300, 3)
  await createBaguaIcon(path.join(SLIDES_DIR, 'bagua-cyan.png'), '#00FFCC')
  await createBaguaIcon(path.join(SLIDES_DIR, 'bagua-red.png'), '#FF2A2A')

  // 创建HTML幻灯片
  console.log('Creating HTML slides...')

  // Slide 1: 封面
  const slide1Html = `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #0a0a0a; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background-image: url('${path.join(SLIDES_DIR, 'bg-dark.png')}');
  background-size: cover;
  font-family: Arial, sans-serif;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
}
.title { color: #00FFCC; font-size: 48pt; font-weight: bold; margin-bottom: 15pt; text-align: center; }
.subtitle { color: #ffffff; font-size: 24pt; opacity: 0.9; margin-bottom: 30pt; }
.tagline { color: #FF2A2A; font-size: 16pt; opacity: 0.7; }
.deco-top { position: absolute; top: 30pt; left: 50%; transform: translateX(-50%); }
.deco-bottom { position: absolute; bottom: 30pt; left: 50%; transform: translateX(-50%); }
</style>
</head>
<body>
<div class="deco-top"><img src="${path.join(SLIDES_DIR, 'line-cyan.png')}" style="width: 200pt; height: 2pt;"></div>
<h1 class="title">灵机 CyberDivination</h1>
<p class="subtitle">AI 算命 H5 应用</p>
<p class="tagline">融合传统玄学与现代AI技术的创新体验</p>
<div class="deco-bottom"><img src="${path.join(SLIDES_DIR, 'line-red.png')}" style="width: 200pt; height: 2pt;"></div>
</body>
</html>`
  fs.writeFileSync(path.join(SLIDES_DIR, 'slide1.html'), slide1Html)

  // Slide 2: 项目概述
  const slide2Html = `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #0a0a0a; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 40pt;
  background-image: url('${path.join(SLIDES_DIR, 'bg-dark.png')}');
  background-size: cover;
  font-family: Arial, sans-serif;
  display: flex; flex-direction: column;
  box-sizing: border-box;
}
.header { display: flex; align-items: center; margin-bottom: 25pt; }
.header-icon { width: 30pt; height: 30pt; margin-right: 12pt; }
.header-title { color: #00FFCC; font-size: 28pt; font-weight: bold; }
.content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.desc { color: #ffffff; font-size: 16pt; line-height: 1.8; margin-bottom: 20pt; opacity: 0.9; }
.highlight-box { background: rgba(0,255,204,0.1); border-left: 4pt solid #00FFCC; padding: 15pt 20pt; margin-top: 15pt; }
.highlight-text { color: #00FFCC; font-size: 14pt; }
</style>
</head>
<body>
<div class="header">
  <img src="${path.join(SLIDES_DIR, 'bagua-cyan.png')}" class="header-icon">
  <h1 class="header-title">项目概述</h1>
</div>
<div class="content">
  <p class="desc">灵机是一款创新的 AI 算命 H5 应用，将传统东方玄学智慧与现代人工智能技术完美融合，为用户提供个性化的命理解读服务。</p>
  <p class="desc">应用采用独特的"新中式赛博"视觉风格，通过沉浸式的交互体验，让用户在科技与传统之间找到平衡，获得娱乐性的算命体验。</p>
  <div class="highlight-box">
    <p class="highlight-text">核心理念：传统玄学 × 现代科技 = 创新体验</p>
  </div>
</div>
</body>
</html>`
  fs.writeFileSync(path.join(SLIDES_DIR, 'slide2.html'), slide2Html)

  // Slide 3: 核心功能
  const slide3Html = `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #0a0a0a; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 35pt;
  background-image: url('${path.join(SLIDES_DIR, 'bg-dark.png')}');
  background-size: cover;
  font-family: Arial, sans-serif;
  display: flex; flex-direction: column;
  box-sizing: border-box;
}
.header { display: flex; align-items: center; margin-bottom: 20pt; }
.header-icon { width: 28pt; height: 28pt; margin-right: 10pt; }
.header-title { color: #00FFCC; font-size: 26pt; font-weight: bold; }
.features { display: flex; flex-wrap: wrap; gap: 15pt; flex: 1; }
.feature-card { width: calc(50% - 8pt); background: rgba(255,255,255,0.03); border: 1pt solid rgba(255,255,255,0.1); padding: 18pt; box-sizing: border-box; }
.feature-num { color: #FF2A2A; font-size: 24pt; font-weight: bold; margin-bottom: 8pt; }
.feature-title { color: #00FFCC; font-size: 15pt; font-weight: bold; margin-bottom: 8pt; }
.feature-desc { color: #ffffff; font-size: 11pt; opacity: 0.8; line-height: 1.5; }
</style>
</head>
<body>
<div class="header">
  <img src="${path.join(SLIDES_DIR, 'bagua-red.png')}" class="header-icon">
  <h1 class="header-title">核心功能</h1>
</div>
<div class="features">
  <div class="feature-card">
    <p class="feature-num">01</p>
    <p class="feature-title">AI 智能算命</p>
    <p class="feature-desc">接入 DeepSeek 大模型，根据用户姓名、生辰、性别提供个性化的运势解读，包括综合运势、事业、爱情、财运等多维度分析</p>
  </div>
  <div class="feature-card">
    <p class="feature-num">02</p>
    <p class="feature-title">新中式赛博风格</p>
    <p class="feature-desc">独特的视觉设计语言，将传统八卦、五行等玄学元素与赛博朋克美学融合，营造神秘而现代的氛围</p>
  </div>
  <div class="feature-card">
    <p class="feature-num">03</p>
    <p class="feature-title">沉浸式体验</p>
    <p class="feature-desc">精心设计的过渡动画、粒子效果和交互反馈，让用户在算命过程中获得仪式感和沉浸感</p>
  </div>
  <div class="feature-card">
    <p class="feature-num">04</p>
    <p class="feature-title">离线备用方案</p>
    <p class="feature-desc">当 API 不可用时自动切换到本地算法生成结果，确保用户体验的连续性和可靠性</p>
  </div>
</div>
</body>
</html>`
  fs.writeFileSync(path.join(SLIDES_DIR, 'slide3.html'), slide3Html)

  // Slide 4: 技术架构
  const slide4Html = `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #0a0a0a; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 35pt;
  background-image: url('${path.join(SLIDES_DIR, 'bg-dark.png')}');
  background-size: cover;
  font-family: Arial, sans-serif;
  display: flex; flex-direction: column;
  box-sizing: border-box;
}
.header { display: flex; align-items: center; margin-bottom: 20pt; }
.header-icon { width: 28pt; height: 28pt; margin-right: 10pt; }
.header-title { color: #00FFCC; font-size: 26pt; font-weight: bold; }
.content { display: flex; gap: 25pt; flex: 1; }
.tech-col { flex: 1; }
.tech-section { margin-bottom: 18pt; }
.section-title { color: #FF2A2A; font-size: 14pt; font-weight: bold; margin-bottom: 10pt; border-bottom: 1pt solid rgba(255,42,42,0.3); padding-bottom: 5pt; }
.tech-item { color: #ffffff; font-size: 12pt; margin-bottom: 6pt; opacity: 0.85; }
.tech-badge { display: inline-block; background: rgba(0,255,204,0.15); color: #00FFCC; padding: 3pt 8pt; margin: 2pt; font-size: 11pt; }
</style>
</head>
<body>
<div class="header">
  <img src="${path.join(SLIDES_DIR, 'bagua-cyan.png')}" class="header-icon">
  <h1 class="header-title">技术架构</h1>
</div>
<div class="content">
  <div class="tech-col">
    <div class="tech-section">
      <p class="section-title">前端框架</p>
      <p class="tech-item"><span class="tech-badge">React 18</span> 现代化UI框架</p>
      <p class="tech-item"><span class="tech-badge">TypeScript</span> 类型安全</p>
      <p class="tech-item"><span class="tech-badge">Vite</span> 极速构建工具</p>
    </div>
    <div class="tech-section">
      <p class="section-title">样式与动画</p>
      <p class="tech-item"><span class="tech-badge">Tailwind CSS</span> 原子化CSS</p>
      <p class="tech-item"><span class="tech-badge">Framer Motion</span> 流畅动画</p>
    </div>
  </div>
  <div class="tech-col">
    <div class="tech-section">
      <p class="section-title">AI 服务</p>
      <p class="tech-item"><span class="tech-badge">DeepSeek API</span> 大语言模型</p>
      <p class="tech-item"><span class="tech-badge">Prompt Engineering</span> 命理提示词</p>
    </div>
    <div class="tech-section">
      <p class="section-title">功能特性</p>
      <p class="tech-item"><span class="tech-badge">html-to-image</span> 结果保存</p>
      <p class="tech-item"><span class="tech-badge">Web Share API</span> 社交分享</p>
      <p class="tech-item"><span class="tech-badge">localStorage</span> 历史记录</p>
    </div>
  </div>
</div>
</body>
</html>`
  fs.writeFileSync(path.join(SLIDES_DIR, 'slide4.html'), slide4Html)

  // Slide 5: 用户流程
  const slide5Html = `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #0a0a0a; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 35pt;
  background-image: url('${path.join(SLIDES_DIR, 'bg-dark.png')}');
  background-size: cover;
  font-family: Arial, sans-serif;
  display: flex; flex-direction: column;
  box-sizing: border-box;
}
.header { display: flex; align-items: center; margin-bottom: 25pt; }
.header-icon { width: 28pt; height: 28pt; margin-right: 10pt; }
.header-title { color: #00FFCC; font-size: 26pt; font-weight: bold; }
.flow { display: flex; align-items: center; justify-content: space-between; flex: 1; padding: 0 10pt; }
.step { width: 120pt; text-align: center; }
.step-circle { width: 60pt; height: 60pt; border-radius: 50%; background: rgba(0,255,204,0.1); border: 2pt solid #00FFCC; display: flex; align-items: center; justify-content: center; margin: 0 auto 12pt; }
.step-num { color: #00FFCC; font-size: 22pt; font-weight: bold; }
.step-title { color: #ffffff; font-size: 13pt; font-weight: bold; margin-bottom: 6pt; }
.step-desc { color: #ffffff; font-size: 10pt; opacity: 0.7; line-height: 1.4; }
.arrow { color: #FF2A2A; font-size: 24pt; opacity: 0.6; }
</style>
</head>
<body>
<div class="header">
  <img src="${path.join(SLIDES_DIR, 'bagua-red.png')}" class="header-icon">
  <h1 class="header-title">用户流程</h1>
</div>
<div class="flow">
  <div class="step">
    <div class="step-circle"><p class="step-num">1</p></div>
    <p class="step-title">输入信息</p>
    <p class="step-desc">姓名、生辰、性别、问询方向</p>
  </div>
  <p class="arrow">→</p>
  <div class="step">
    <div class="step-circle"><p class="step-num">2</p></div>
    <p class="step-title">AI 推算</p>
    <p class="step-desc">大模型分析命理生成解读</p>
  </div>
  <p class="arrow">→</p>
  <div class="step">
    <div class="step-circle"><p class="step-num">3</p></div>
    <p class="step-title">查看结果</p>
    <p class="step-desc">灵签、五行、宜忌、幸运信息</p>
  </div>
  <p class="arrow">→</p>
  <div class="step">
    <div class="step-circle"><p class="step-num">4</p></div>
    <p class="step-title">保存分享</p>
    <p class="step-desc">保存灵符图片或社交分享</p>
  </div>
</div>
</body>
</html>`
  fs.writeFileSync(path.join(SLIDES_DIR, 'slide5.html'), slide5Html)

  // Slide 6: 结果展示内容
  const slide6Html = `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #0a0a0a; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 35pt;
  background-image: url('${path.join(SLIDES_DIR, 'bg-dark.png')}');
  background-size: cover;
  font-family: Arial, sans-serif;
  display: flex; flex-direction: column;
  box-sizing: border-box;
}
.header { display: flex; align-items: center; margin-bottom: 20pt; }
.header-icon { width: 28pt; height: 28pt; margin-right: 10pt; }
.header-title { color: #00FFCC; font-size: 26pt; font-weight: bold; }
.grid { display: flex; flex-wrap: wrap; gap: 12pt; flex: 1; }
.card { width: calc(33.33% - 8pt); background: rgba(255,255,255,0.03); border: 1pt solid rgba(0,255,204,0.2); padding: 15pt; box-sizing: border-box; }
.card-title { color: #00FFCC; font-size: 13pt; font-weight: bold; margin-bottom: 8pt; }
.card-desc { color: #ffffff; font-size: 10pt; opacity: 0.8; line-height: 1.5; }
.card-example { color: #FF2A2A; font-size: 9pt; margin-top: 6pt; font-style: italic; }
</style>
</head>
<body>
<div class="header">
  <img src="${path.join(SLIDES_DIR, 'bagua-cyan.png')}" class="header-icon">
  <h1 class="header-title">算命结果内容</h1>
</div>
<div class="grid">
  <div class="card">
    <p class="card-title">灵签判词</p>
    <p class="card-desc">AI 生成的四句古典诗词风格判词，每句七字，文采斐然</p>
    <p class="card-example">"紫微星照命宫明，财官双美福禄盈"</p>
  </div>
  <div class="card">
    <p class="card-title">五行能量</p>
    <p class="card-desc">根据八字命理推算的五行能量分布，以雷达图可视化呈现</p>
    <p class="card-example">金木水火土各维度 0-100</p>
  </div>
  <div class="card">
    <p class="card-title">详细解读</p>
    <p class="card-desc">300-400字的通俗命理分析，涵盖性格、运势、建议</p>
    <p class="card-example">分段落展示，易于阅读</p>
  </div>
  <div class="card">
    <p class="card-title">今日宜忌</p>
    <p class="card-desc">结合现代生活场景的宜忌建议，各4条</p>
    <p class="card-example">宜：提交代码 忌：部署上线</p>
  </div>
  <div class="card">
    <p class="card-title">幸运数字</p>
    <p class="card-desc">根据命理推算的 1-9 幸运数字</p>
    <p class="card-example">大字展示，一目了然</p>
  </div>
  <div class="card">
    <p class="card-title">幸运颜色</p>
    <p class="card-desc">14种颜色选项，动态配色展示</p>
    <p class="card-example">红橙黄绿青蓝紫等</p>
  </div>
</div>
</body>
</html>`
  fs.writeFileSync(path.join(SLIDES_DIR, 'slide6.html'), slide6Html)

  // Slide 7: 总结
  const slide7Html = `<!DOCTYPE html>
<html>
<head>
<style>
html { background: #0a0a0a; }
body {
  width: 720pt; height: 405pt; margin: 0; padding: 0;
  background-image: url('${path.join(SLIDES_DIR, 'bg-dark.png')}');
  background-size: cover;
  font-family: Arial, sans-serif;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
}
.title { color: #00FFCC; font-size: 36pt; font-weight: bold; margin-bottom: 25pt; text-align: center; }
.points { margin-bottom: 30pt; }
.point { color: #ffffff; font-size: 16pt; margin-bottom: 12pt; text-align: center; opacity: 0.9; }
.point-icon { color: #FF2A2A; margin-right: 8pt; }
.footer { color: #ffffff; font-size: 14pt; opacity: 0.5; margin-top: 20pt; }
.deco-line { width: 150pt; height: 2pt; margin: 20pt auto; }
</style>
</head>
<body>
<img src="${path.join(SLIDES_DIR, 'line-cyan.png')}" class="deco-line">
<h1 class="title">灵机 · 天机已显</h1>
<div class="points">
  <p class="point"><span class="point-icon">✦</span>传统玄学与现代 AI 的创新融合</p>
  <p class="point"><span class="point-icon">✦</span>独特的新中式赛博视觉风格</p>
  <p class="point"><span class="point-icon">✦</span>沉浸式的交互体验设计</p>
  <p class="point"><span class="point-icon">✦</span>完善的技术架构与用户体验</p>
</div>
<img src="${path.join(SLIDES_DIR, 'line-red.png')}" class="deco-line">
<p class="footer">仅供娱乐 · 理性看待</p>
</body>
</html>`
  fs.writeFileSync(path.join(SLIDES_DIR, 'slide7.html'), slide7Html)

  // 创建PPT
  console.log('Generating PowerPoint...')
  const pptx = new pptxgen()
  pptx.layout = 'LAYOUT_16x9'
  pptx.title = '灵机 CyberDivination - AI 算命 H5 应用介绍'
  pptx.author = 'AI Assistant'
  pptx.subject = '项目功能介绍'

  const slideFiles = ['slide1.html', 'slide2.html', 'slide3.html', 'slide4.html', 'slide5.html', 'slide6.html', 'slide7.html']

  for (const file of slideFiles) {
    console.log(`Processing ${file}...`)
    await html2pptx(path.join(SLIDES_DIR, file), pptx)
  }

  const outputPath = path.join(WORKSPACE, 'CyberDivination-介绍.pptx')
  await pptx.writeFile({ fileName: outputPath })
  console.log(`\nPresentation saved to: ${outputPath}`)
}

createPresentation().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
