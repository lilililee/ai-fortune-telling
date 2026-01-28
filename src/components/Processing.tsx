import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { FormData, DivinationResult } from '@/types';
import { getDivination, getFallbackResult } from '@/services/deepseek';

// 天干地支字符
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const BAGUA = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
const HEX_CHARS = '0123456789ABCDEF';

interface ProcessingProps {
  formData: FormData;
  onComplete: (result: DivinationResult) => void;
}

// 生成随机十六进制字符串
const generateHexCode = (length: number): string => {
  return Array.from({ length }, () => HEX_CHARS[Math.floor(Math.random() * 16)]).join('');
};

// 生成随机八字
const generateBazi = (): string[] => {
  return Array.from({ length: 4 }, () => 
    HEAVENLY_STEMS[Math.floor(Math.random() * 10)] + 
    EARTHLY_BRANCHES[Math.floor(Math.random() * 12)]
  );
};

// 代码雨字符组件
const MatrixRain = () => {
  const columns = 20;
  const chars = [...HEAVENLY_STEMS, ...EARTHLY_BRANCHES, ...BAGUA];
  
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 font-display text-cyber-cyan text-base"
          style={{ left: `${(i / columns) * 100}%` }}
          initial={{ y: -100 }}
          animate={{ y: '100vh' }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'linear',
          }}
        >
          {Array.from({ length: 15 }).map((_, j) => (
            <div key={j} className="opacity-70" style={{ opacity: 1 - j * 0.06 }}>
              {chars[Math.floor(Math.random() * chars.length)]}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

// 神经网络节点组件
const NeuralNetwork = () => {
  const nodeCount = 12;
  const centerX = 50;
  const centerY = 50;
  const radius = 35;
  
  const nodes = Array.from({ length: nodeCount }).map((_, i) => {
    const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      delay: i * 0.1,
    };
  });
  
  return (
    <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100">
      {/* 连接线 - 星盘形状 */}
      {nodes.map((node, i) => 
        nodes.slice(i + 1).map((targetNode, j) => (
          <motion.line
            key={`${i}-${j}`}
            x1={node.x}
            y1={node.y}
            x2={targetNode.x}
            y2={targetNode.y}
            stroke="url(#lineGradient)"
            strokeWidth="0.3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 1.5, delay: node.delay + 0.5 }}
          />
        ))
      )}
      
      {/* 中心到各节点的连接 */}
      {nodes.map((node, i) => (
        <motion.line
          key={`center-${i}`}
          x1={centerX}
          y1={centerY}
          x2={node.x}
          y2={node.y}
          stroke="url(#lineGradient)"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1, delay: node.delay }}
        />
      ))}
      
      {/* 外圈节点 */}
      {nodes.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.x}
          cy={node.y}
          r="2"
          fill="#00FFCC"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: node.delay }}
        />
      ))}
      
      {/* 中心核心节点 */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r="5"
        fill="none"
        stroke="#FF2A2A"
        strokeWidth="1"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle
        cx={centerX}
        cy={centerY}
        r="3"
        fill="#FF2A2A"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      
      {/* 渐变定义 */}
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FFCC" />
          <stop offset="100%" stopColor="#FF2A2A" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// 数据转换动画组件
const DataTransform = ({ bazi, hexCode }: { bazi: string[]; hexCode: string }) => {
  return (
    <motion.div 
      className="text-center space-y-3 sm:space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* 八字显示 */}
      <div className="flex justify-center gap-1.5 sm:gap-2">
        {bazi.map((char, i) => (
          <motion.span
            key={i}
            className="text-xl sm:text-2xl font-display text-cyber-red"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.2 }}
          >
            {char}
          </motion.span>
        ))}
      </div>
      
      {/* 转换箭头 */}
      <motion.div
        className="text-cyber-cyan font-display text-sm sm:text-base"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: 1.5 }}
      >
        ▼ 命理编码 ▼
      </motion.div>
      
      {/* 十六进制代码 */}
      <motion.div
        className="font-mono text-cyber-cyan text-xs tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        0x{hexCode}
      </motion.div>
    </motion.div>
  );
};

// 进度指示器
const ProgressIndicator = ({ progress }: { progress: number }) => {
  const stages = [
    { label: '解析命理', threshold: 20 },
    { label: '计算八字', threshold: 40 },
    { label: '通灵连接', threshold: 60 },
    { label: '生成卦象', threshold: 80 },
    { label: '完成', threshold: 100 },
  ];
  
  return (
    <div className="w-full max-w-xs mx-auto space-y-3">
      {/* 进度条 */}
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-red"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* 阶段标签 */}
      <div className="flex justify-between text-xs font-mono">
        {stages.map((stage, i) => (
          <motion.span
            key={i}
            className={progress >= stage.threshold ? 'text-cyber-cyan' : 'text-white/30'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            {progress >= stage.threshold ? '●' : '○'}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

// 主 Processing 组件
export const Processing = ({ formData, onComplete }: ProcessingProps) => {
  const [progress, setProgress] = useState(0);
  const [bazi] = useState(() => generateBazi());
  const [hexCode, setHexCode] = useState(() => generateHexCode(16));
  const [statusText, setStatusText] = useState('正在初始化...');
  const [aiResult, setAiResult] = useState<DivinationResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const apiCalledRef = useRef(false);
  
  // 十六进制代码动态更新效果
  useEffect(() => {
    const interval = setInterval(() => {
      setHexCode(generateHexCode(16));
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  // 调用 DeepSeek API
  const fetchDivination = useCallback(async () => {
    if (apiCalledRef.current) return;
    apiCalledRef.current = true;
    
    try {
      const result = await getDivination(formData);
      setAiResult(result);
    } catch (error) {
      console.error('AI 算命请求失败:', error);
      setApiError(error instanceof Error ? error.message : '未知错误');
      // 使用 fallback 结果
      const fallbackResult = getFallbackResult(formData);
      setAiResult(fallbackResult);
    }
  }, [formData]);
  
  // 启动 API 调用
  useEffect(() => {
    fetchDivination();
  }, [fetchDivination]);
  
  // 进度更新 - 根据 API 状态调整
  useEffect(() => {
    const statusMessages = [
      '正在初始化灵脉通道...',
      '正在解析命理数据...',
      '正在计算天命矩阵...',
      '正在通灵连接...',
      '正在生成运势图谱...',
      '正在生成卦象...',
      '正在整合天机...',
    ];
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        // 如果 API 还没返回，进度最多到 85%
        const maxProgress = aiResult ? 100 : 85;
        let increment = Math.random() * 15 + 5;
        
        // 接近上限时放慢速度
        if (prev > 70 && !aiResult) {
          increment = Math.random() * 3 + 1;
        }
        
        const newProgress = Math.min(prev + increment, maxProgress);
        
        // 更新状态文本
        const msgIndex = Math.min(
          Math.floor(newProgress / 15),
          statusMessages.length - 1
        );
        setStatusText(statusMessages[msgIndex]);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [aiResult]);
  
  // 当 API 返回后且进度已完成时，快速推进到 100%
  useEffect(() => {
    if (aiResult && progress >= 85 && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(100);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [aiResult, progress]);
  
  // 完成后跳转
  useEffect(() => {
    if (progress >= 100 && aiResult) {
      const timer = setTimeout(() => {
        onComplete(aiResult);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [progress, aiResult, onComplete]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-cyber-black flex flex-col items-center justify-center p-4 overflow-hidden"
    >
      {/* 背景代码雨 */}
      <MatrixRain />
      
      {/* 主内容容器 */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6 sm:gap-8 px-4">
        {/* 神经网络动画 */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64">
          <NeuralNetwork />
          
          {/* 中心状态文本 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin mx-auto" />
            </motion.div>
          </div>
        </div>
        
        {/* 八字转换动画 */}
        <DataTransform bazi={bazi} hexCode={hexCode} />
        
        {/* 状态文本 */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.p
            className="font-display text-lg sm:text-xl text-white"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            正在通灵...
          </motion.p>
          <p className="font-display text-xs sm:text-sm text-cyber-cyan/60">
            {statusText}
          </p>
          {formData.name && (
            <p className="font-display text-xs sm:text-sm text-white/40 mt-3 sm:mt-4">
              命主：{formData.name}
            </p>
          )}
        </motion.div>
        
        {/* 进度指示器 */}
        <ProgressIndicator progress={progress} />
        
        {/* 底部装饰文字 */}
        <motion.p
          className="font-display text-sm text-white/20 tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {apiError ? '本地占卜模式' : '连接天命矩阵中'}
        </motion.p>
        
        {/* API 错误提示（可选显示） */}
        {apiError && (
          <motion.p
            className="font-mono text-xs text-cyber-red/40 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            [{apiError}]
          </motion.p>
        )}
      </div>
      
      {/* 四角装饰 */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyber-cyan/30" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyber-cyan/30" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyber-red/30" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyber-red/30" />
    </motion.div>
  );
};

export default Processing;
