import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Share2, Download, Sparkles, Zap, Check, ScrollText, X } from 'lucide-react';
import { toPng } from 'html-to-image';
import type { FormData, DivinationResult } from '@/types';

// Toast 通知组件
const Toast = ({ 
  message, 
  type = 'success', 
  onClose 
}: { 
  message: string; 
  type?: 'success' | 'error' | 'info'; 
  onClose: () => void;
}) => {
  const bgColors = {
    success: 'bg-cyber-cyan/20 border-cyber-cyan/50',
    error: 'bg-cyber-red/20 border-cyber-red/50',
    info: 'bg-white/10 border-white/30',
  };
  const textColors = {
    success: 'text-cyber-cyan',
    error: 'text-cyber-red',
    info: 'text-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg border backdrop-blur-sm ${bgColors[type]} flex items-center gap-3 shadow-lg`}
    >
      <span className={`font-display text-sm ${textColors[type]}`}>{message}</span>
      <button onClick={onClose} className="text-white/40 hover:text-white/60 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

interface ResultProps {
  formData: FormData;
  result: DivinationResult;
  onRestart: () => void;
}

// 装饰性八卦符号
const BaguaDecoration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* 四角八卦符号 */}
    <motion.div
      initial={{ opacity: 0, rotate: -45 }}
      animate={{ opacity: 0.1, rotate: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="absolute -top-12 -left-12 text-6xl font-display text-cyber-cyan select-none"
    >
      ☰
    </motion.div>
    <motion.div
      initial={{ opacity: 0, rotate: 45 }}
      animate={{ opacity: 0.1, rotate: 0 }}
      transition={{ duration: 1, delay: 0.6 }}
      className="absolute -top-12 -right-12 text-6xl font-display text-cyber-red select-none"
    >
      ☷
    </motion.div>
    <motion.div
      initial={{ opacity: 0, rotate: -45 }}
      animate={{ opacity: 0.1, rotate: 0 }}
      transition={{ duration: 1, delay: 0.7 }}
      className="absolute -bottom-12 -left-12 text-6xl font-display text-cyber-red select-none"
    >
      ☵
    </motion.div>
    <motion.div
      initial={{ opacity: 0, rotate: 45 }}
      animate={{ opacity: 0.1, rotate: 0 }}
      transition={{ duration: 1, delay: 0.8 }}
      className="absolute -bottom-12 -right-12 text-6xl font-display text-cyber-cyan select-none"
    >
      ☲
    </motion.div>
  </div>
);

// 灵签诗句组件
const VerseCard = ({ verse }: { verse: string[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="relative bg-gradient-to-br from-cyber-red/10 to-cyber-cyan/10 border border-cyber-cyan/30 p-4 sm:p-6 rounded-lg overflow-hidden"
  >
    {/* 装饰线 */}
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent" />
    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-red/50 to-transparent" />
    
    <div className="flex items-center gap-2 mb-3 sm:mb-4">
      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyber-cyan flex-shrink-0" />
      <h3 className="font-display text-base sm:text-lg text-cyber-cyan whitespace-nowrap">灵签 · 判词</h3>
    </div>
    <div className="space-y-1.5 sm:space-y-2 text-center py-2">
      {verse.map((line, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.15 }}
          className="font-display text-lg sm:text-xl text-white/90 tracking-wider"
        >
          {line}
        </motion.p>
      ))}
    </div>
  </motion.div>
);

// 五行能量雷达图组件 (真正的雷达图)
const ElementalRadarChart = ({ energy }: { energy: DivinationResult['elementalEnergy'] }) => {
  const elements = [
    { key: 'wood', label: '木', color: '#4ade80', angle: -90 },
    { key: 'fire', label: '火', color: '#f87171', angle: -18 },
    { key: 'earth', label: '土', color: '#fbbf24', angle: 54 },
    { key: 'metal', label: '金', color: '#e5e7eb', angle: 126 },
    { key: 'water', label: '水', color: '#60a5fa', angle: 198 },
  ] as const;

  const centerX = 100;
  const centerY = 100;
  const maxRadius = 70;
  const levels = [0.25, 0.5, 0.75, 1];

  // 计算五边形顶点
  const getPoint = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    };
  };

  // 生成五边形路径
  const generatePentagonPath = (radius: number) => {
    return elements
      .map((el, i) => {
        const point = getPoint(el.angle, radius);
        return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
      })
      .join(' ') + ' Z';
  };

  // 生成数据多边形路径
  const generateDataPath = () => {
    return elements
      .map((el, i) => {
        const value = energy[el.key] / 100;
        const point = getPoint(el.angle, maxRadius * value);
        return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
      })
      .join(' ') + ' Z';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-lg"
    >
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyber-cyan" />
        <h3 className="font-display text-base sm:text-lg text-cyber-cyan whitespace-nowrap">五行能量</h3>
      </div>
      
      <div className="flex justify-center">
        <svg className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px]" viewBox="0 0 200 200">
          {/* 背景网格 */}
          {levels.map((level, i) => (
            <motion.path
              key={i}
              d={generatePentagonPath(maxRadius * level)}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            />
          ))}
          
          {/* 轴线 */}
          {elements.map((el, i) => {
            const point = getPoint(el.angle, maxRadius);
            return (
              <motion.line
                key={i}
                x1={centerX}
                y1={centerY}
                x2={point.x}
                y2={point.y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
              />
            );
          })}
          
          {/* 数据区域 */}
          <motion.path
            d={generateDataPath()}
            fill="url(#radarGradient)"
            fillOpacity="0.3"
            stroke="url(#radarStroke)"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            style={{ transformOrigin: 'center' }}
          />
          
          {/* 数据点 */}
          {elements.map((el, i) => {
            const value = energy[el.key] / 100;
            const point = getPoint(el.angle, maxRadius * value);
            return (
              <motion.circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={el.color}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
              />
            );
          })}
          
          {/* 标签 */}
          {elements.map((el, i) => {
            const labelRadius = maxRadius + 20;
            const point = getPoint(el.angle, labelRadius);
            return (
              <motion.text
                key={i}
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={el.color}
                fontSize="14"
                fontFamily="Ma Shan Zheng, cursive"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 + i * 0.05 }}
              >
                {el.label}
              </motion.text>
            );
          })}
          
          {/* 渐变定义 */}
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFCC" />
              <stop offset="100%" stopColor="#FF2A2A" />
            </linearGradient>
            <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFCC" />
              <stop offset="100%" stopColor="#FF2A2A" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* 数值显示 */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2 mt-3 sm:mt-4">
        {elements.map((el, i) => (
          <motion.div
            key={el.key}
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 + i * 0.05 }}
          >
            <div className="text-[10px] sm:text-xs font-mono" style={{ color: el.color }}>
              {energy[el.key]}%
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// AI 解读组件
const Interpretation = ({ text }: { text: string }) => {
  // 将文本按换行符分割为段落，同时处理可能的双换行
  const paragraphs = text.split(/\n+/).filter(p => p.trim());
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="relative bg-white/5 border border-white/10 p-4 sm:p-6 rounded-lg overflow-hidden"
    >
      {/* 扫描线动画 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent"
        initial={{ y: '-100%' }}
        animate={{ y: '100%' }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      />
      
      <h3 className="font-display text-base sm:text-lg text-cyber-cyan mb-3 sm:mb-4 flex items-center gap-2 whitespace-nowrap">
        <ScrollText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        详细解读
      </h3>
      <div className="space-y-3 sm:space-y-4 relative z-10">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="text-white/80 leading-relaxed sm:leading-loose text-sm sm:text-base font-display"
            style={{ textIndent: '2em' }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
};

// 今日宜忌组件
const DailyAdvice = ({ advice }: { advice: DivinationResult['advice'] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8 }}
    className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-lg"
  >
    <h3 className="font-display text-base sm:text-lg text-cyber-cyan mb-3 sm:mb-4 whitespace-nowrap">今日宜忌</h3>
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      <div className="bg-cyber-cyan/5 rounded-lg p-3 sm:p-4 border border-cyber-cyan/20">
        <div className="text-cyber-cyan text-sm sm:text-base font-display mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </span>
          宜
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          {advice.suitable.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.05 }}
              className="text-white/70 text-xs sm:text-sm font-display flex items-center gap-1.5 sm:gap-2"
            >
              <span className="text-cyber-cyan text-[10px] sm:text-xs">▸</span>
              {item}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="bg-cyber-red/5 rounded-lg p-3 sm:p-4 border border-cyber-red/20">
        <div className="text-cyber-red text-sm sm:text-base font-display mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-cyber-red/20 flex items-center justify-center text-[10px] sm:text-xs">
            ✕
          </span>
          忌
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          {advice.avoid.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.05 }}
              className="text-white/70 text-xs sm:text-sm font-display flex items-center gap-1.5 sm:gap-2"
            >
              <span className="text-cyber-red text-[10px] sm:text-xs">▸</span>
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

// 颜色名称到CSS颜色值的映射
const colorNameToCSS: Record<string, string> = {
  '红色': '#ef4444',
  '橙色': '#f97316',
  '黄色': '#eab308',
  '绿色': '#22c55e',
  '青色': '#06b6d4',
  '蓝色': '#3b82f6',
  '紫色': '#a855f7',
  '粉色': '#ec4899',
  '白色': '#f5f5f5',
  '黑色': '#1f1f1f',
  '金色': '#fbbf24',
  '银色': '#a1a1aa',
  '棕色': '#a16207',
  '灰色': '#6b7280',
};

// 幸运信息组件
const LuckyInfo = ({ luckyNumber, luckyColor }: { luckyNumber: number; luckyColor: string }) => {
  // 获取幸运颜色对应的CSS颜色值
  const cssColor = colorNameToCSS[luckyColor] || '#ff2a2a';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="flex gap-2 sm:gap-4"
    >
      <div className="flex-1 bg-gradient-to-br from-cyber-cyan/10 to-transparent border border-cyber-cyan/20 p-3 sm:p-4 rounded-lg text-center">
        <div className="text-xs sm:text-sm font-display text-white/40 mb-1">幸运数字</div>
        <motion.div
          className="text-2xl sm:text-3xl font-display text-cyber-cyan"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.1, type: 'spring' }}
        >
          {luckyNumber}
        </motion.div>
      </div>
      <div 
        className="flex-1 bg-gradient-to-br to-transparent p-3 sm:p-4 rounded-lg text-center border"
        style={{ 
          borderColor: `${cssColor}40`,
          background: `linear-gradient(to bottom right, ${cssColor}15, transparent)`
        }}
      >
        <div className="text-xs sm:text-sm font-display text-white/40 mb-1">幸运颜色</div>
        <motion.div
          className="text-2xl sm:text-3xl font-display"
          style={{ color: cssColor }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: 'spring' }}
        >
          {luckyColor}
        </motion.div>
      </div>
    </motion.div>
  );
};

// 操作按钮组件
const ActionButtons = ({ 
  onRestart, 
  onSave, 
  onShare,
  isSaving,
  saveSuccess 
}: { 
  onRestart: () => void;
  onSave: () => void;
  onShare: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1 }}
    className="flex flex-col sm:flex-row gap-2 sm:gap-3"
  >
    <button
      onClick={onRestart}
      className="flex-1 py-2.5 sm:py-3 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-black transition-colors flex items-center justify-center gap-2 font-display text-sm sm:text-base rounded-lg"
    >
      <RefreshCw className="w-4 h-4" />
      重新算命
    </button>
    <div className="flex gap-2 sm:contents">
      <button
        onClick={onSave}
        disabled={isSaving}
        className={`flex-1 py-2.5 sm:py-3 border transition-colors flex items-center justify-center gap-2 font-display text-sm sm:text-base rounded-lg ${
          saveSuccess 
            ? 'border-green-500 text-green-500 bg-green-500/10'
            : 'border-white/20 text-white/60 hover:bg-white/10'
        }`}
      >
        {isSaving ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Download className="w-4 h-4" />
          </motion.div>
        ) : saveSuccess ? (
          <Check className="w-4 h-4" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span className="hidden xs:inline">{saveSuccess ? '已保存' : '保存灵符'}</span>
        <span className="xs:hidden">{saveSuccess ? '已存' : '保存'}</span>
      </button>
      <button
        onClick={onShare}
        className="flex-1 py-2.5 sm:py-3 border border-white/20 text-white/60 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 font-display text-sm sm:text-base rounded-lg"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden xs:inline">分享天机</span>
        <span className="xs:hidden">分享</span>
      </button>
    </div>
  </motion.div>
);

// 主结果组件
export const Result = ({ formData, result, onRestart }: ResultProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // 显示 toast 通知
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // 保存灵符为图片
  const handleSave = useCallback(async () => {
    if (isSaving || !cardRef.current) return;
    
    setIsSaving(true);
    
    try {
      // 使用 html-to-image 生成图片
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: '#0a0a0a',
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true, // 跳过远程字体以避免 CORS 错误
      });
      
      // 生成文件名
      const timestamp = new Date().toISOString().slice(0, 10);
      const fileName = `灵符-${formData.name}-${timestamp}.png`;
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSaveSuccess(true);
      showToast('灵符已保存到本地', 'success');
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('保存图片失败:', error);
      showToast('保存失败，请重试', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [formData.name, isSaving, showToast]);

  // 分享天机
  const handleShare = useCallback(async () => {
    const shareData = {
      title: '灵机算命 - 天机已显',
      text: `${formData.name}的运势解读：\n${result.verse.join('\n')}\n\n${result.interpretation.slice(0, 100)}...`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // 用户取消分享或不支持
        console.log('分享取消或不支持');
      }
    } else {
      // 复制到剪贴板
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
        alert('已复制到剪贴板');
      } catch {
        alert('分享功能暂不可用');
      }
    }
  }, [formData.name, result]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-6 sm:py-8 px-3 sm:px-4"
    >
      {/* Toast 通知 */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      <div className="max-w-lg mx-auto space-y-4 sm:space-y-6">
        {/* 可截图的卡片区域 - 外层用于截图，内层处理边距 */}
        <div ref={cardRef} className="relative bg-[#0a0a0a] rounded-lg overflow-hidden">
          <div className="relative space-y-4 sm:space-y-6 p-4 sm:p-6">
          <BaguaDecoration />
          
          {/* 头部信息 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-8 relative"
          >
            {/* 装饰边框 */}
            <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent" />
            
            <motion.div
              className="inline-block"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(0,255,204,0.5)',
                  '0 0 20px rgba(255,42,42,0.5)',
                  '0 0 10px rgba(0,255,204,0.5)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <h2 className="text-2xl sm:text-3xl font-display text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-red">
                天机已显
              </h2>
            </motion.div>
            <p className="font-display text-xs sm:text-sm text-white/40 mt-2">
              命主：{formData.name} ｜ 问卦：{formData.query === 'comprehensive' ? '综合运势' : formData.query === 'career' ? '事业' : formData.query === 'love' ? '爱情' : '财运'}
            </p>
            
            <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-[1px] bg-gradient-to-r from-transparent via-cyber-red to-transparent" />
          </motion.div>

          {/* 灵签诗句 */}
          <VerseCard verse={result.verse} />

          {/* 五行能量雷达图 */}
          <ElementalRadarChart energy={result.elementalEnergy} />

          {/* AI 解读 */}
          <Interpretation text={result.interpretation} />

          {/* 今日宜忌 */}
          <DailyAdvice advice={result.advice} />

          {/* 幸运信息 */}
          <LuckyInfo luckyNumber={result.luckyNumber} luckyColor={result.luckyColor} />

          {/* 底部水印 (截图时显示) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-center pt-3 sm:pt-4 border-t border-white/5"
          >
            <p className="font-display text-base sm:text-lg text-white/20">灵机</p>
            <p className="font-display text-xs sm:text-sm text-white/10">仅供娱乐</p>
          </motion.div>
          </div>
        </div>

        {/* 操作按钮 (不包含在截图区域) */}
        <ActionButtons 
          onRestart={onRestart} 
          onSave={handleSave}
          onShare={handleShare}
          isSaving={isSaving}
          saveSuccess={saveSuccess}
        />
      </div>
    </motion.div>
  );
};

export default Result;
