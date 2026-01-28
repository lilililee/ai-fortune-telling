import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BrainCircuit, Compass, Briefcase, Heart, Coins, History, X, Clock, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import type { FormData } from '@/types';

// 历史记录存储键
const HISTORY_STORAGE_KEY = 'lingji-input-history';
const MAX_HISTORY_COUNT = 5;

// 历史记录条目类型
interface HistoryEntry {
  id: string;
  name: string;
  birthDate: string; // ISO 字符串格式
  gender: 'male' | 'female';
  timestamp: number;
}

// 历史记录管理 hooks
const useInputHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // 从 localStorage 加载历史记录
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as HistoryEntry[];
        setHistory(parsed);
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  // 保存历史记录
  const saveToHistory = useCallback((formData: FormData) => {
    if (!formData.name || !formData.birthDate || !formData.gender) return;

    const newEntry: HistoryEntry = {
      id: `${formData.name}-${formData.birthDate.toISOString()}-${formData.gender}`,
      name: formData.name,
      birthDate: formData.birthDate.toISOString(),
      gender: formData.gender,
      timestamp: Date.now(),
    };

    setHistory(prev => {
      // 移除相同记录（基于 id 去重）
      const filtered = prev.filter(item => item.id !== newEntry.id);
      // 将新记录添加到最前面
      const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY_COUNT);
      // 保存到 localStorage
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save history:', e);
      }
      return updated;
    });
  }, []);

  // 删除历史记录
  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save history:', e);
      }
      return updated;
    });
  }, []);

  return { history, saveToHistory, removeFromHistory };
};

// 问询方向选项
const QUERY_OPTIONS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'comprehensive', label: '综合运势', icon: Compass },
  { value: 'career', label: '事业', icon: Briefcase },
  { value: 'love', label: '爱情', icon: Heart },
  { value: 'wealth', label: '财运', icon: Coins },
];

interface InputFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: () => void;
}

// 页面头部组件
const Header = () => (
  <header className="w-full flex justify-between items-center mb-8 sm:mb-12 border-b border-white/10 pb-3 sm:pb-4">
    <div className="flex items-center gap-2">
      <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-red" />
      <span className="font-display text-xl sm:text-2xl tracking-widest">灵机</span>
    </div>
    <div className="font-display text-xs sm:text-sm text-white/40">
      {new Date().toLocaleDateString('zh-CN')}
    </div>
  </header>
);

// 姓名输入组件
const NameInput = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-display text-cyber-cyan">姓名</label>
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-cyber-cyan focus:outline-none transition-colors font-display text-lg" 
      placeholder="请输入姓名" 
    />
  </div>
);

// 生辰选择组件
const BirthDateInput = ({ 
  date, 
  onSelect 
}: { 
  date?: Date; 
  onSelect: (date?: Date) => void;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-display text-cyber-cyan">生辰</label>
    <DatePicker 
      date={date} 
      onSelect={onSelect}
      placeholder="选择出生日期"
    />
  </div>
);

// 性别选择组件
const GenderSelect = ({ 
  value, 
  onChange 
}: { 
  value: 'male' | 'female' | null;
  onChange: (value: 'male' | 'female') => void;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-display text-cyber-cyan">性别</label>
    <div className="flex gap-3 sm:gap-4">
      <label className="flex-1 cursor-pointer">
        <input 
          type="radio" 
          name="gender" 
          checked={value === 'male'}
          onChange={() => onChange('male')}
          className="peer sr-only" 
        />
        <div className="w-full p-2.5 sm:p-3 border border-white/20 text-center font-display text-sm sm:text-base peer-checked:bg-cyber-cyan/20 peer-checked:border-cyber-cyan peer-checked:text-cyber-cyan transition-all hover:bg-white/5">
          乾（男）
        </div>
      </label>
      <label className="flex-1 cursor-pointer">
        <input 
          type="radio" 
          name="gender" 
          checked={value === 'female'}
          onChange={() => onChange('female')}
          className="peer sr-only" 
        />
        <div className="w-full p-2.5 sm:p-3 border border-white/20 text-center font-display text-sm sm:text-base peer-checked:bg-cyber-red/20 peer-checked:border-cyber-red peer-checked:text-cyber-red transition-all hover:bg-white/5">
          坤（女）
        </div>
      </label>
    </div>
  </div>
);

// 问询方向选择组件
const QuerySelect = ({ 
  value, 
  onChange 
}: { 
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-display text-cyber-cyan">问询方向</label>
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {QUERY_OPTIONS.map((option) => (
        <label key={option.value} className="cursor-pointer">
          <input 
            type="radio" 
            name="query" 
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="peer sr-only" 
          />
          <div className="w-full p-2.5 sm:p-3 border border-white/20 text-center font-display peer-checked:bg-gradient-to-r peer-checked:from-cyber-cyan/20 peer-checked:to-cyber-red/20 peer-checked:border-cyber-cyan transition-all hover:bg-white/5 flex items-center justify-center gap-1.5 sm:gap-2">
            <option.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">{option.label}</span>
          </div>
        </label>
      ))}
    </div>
  </div>
);

// 提交按钮组件
const SubmitButton = ({ 
  disabled, 
  onClick 
}: { 
  disabled: boolean;
  onClick: () => void;
}) => (
  <motion.button 
    type="button" 
    onClick={onClick}
    disabled={disabled}
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    className={`w-full mt-6 sm:mt-8 py-3 sm:py-4 font-bold font-display text-lg sm:text-xl transition-all flex items-center justify-center gap-2 group ${
      !disabled 
        ? 'bg-cyber-cyan text-cyber-black hover:bg-white hover:text-black cursor-pointer' 
        : 'bg-white/10 text-white/30 cursor-not-allowed'
    }`}
  >
    <Sparkles className={`w-4 h-4 ${!disabled ? 'group-hover:rotate-12' : ''} transition-transform`} />
    开始算命
  </motion.button>
);

// 历史记录选择器组件
const HistorySelector = ({
  history,
  onSelect,
  onRemove,
}: {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (history.length === 0) return null;

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString('zh-CN');
  };

  return (
    <div className="relative mb-6">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-cyber-cyan/10 to-cyber-red/10 border border-white/20 hover:border-cyber-cyan/50 transition-all rounded"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-2 text-cyber-cyan">
          <History className="w-4 h-4" />
          <span className="font-display text-sm">历史记录</span>
          <span className="text-white/40 text-xs">({history.length}条)</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-cyber-black/95 border border-white/20 rounded backdrop-blur-md overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto">
              {history.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center justify-between p-3 hover:bg-white/5 border-b border-white/5 last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(entry);
                      setIsOpen(false);
                    }}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      entry.gender === 'male' 
                        ? 'bg-cyber-cyan/20 text-cyber-cyan' 
                        : 'bg-cyber-red/20 text-cyber-red'
                    }`}>
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm truncate">{entry.name}</div>
                      <div className="text-xs text-white/40 flex items-center gap-2">
                        <span>{formatDate(entry.birthDate)}</span>
                        <span>•</span>
                        <span>{entry.gender === 'male' ? '男' : '女'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-white/30 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimestamp(entry.timestamp)}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(entry.id);
                    }}
                    className="ml-2 p-1.5 text-white/30 hover:text-cyber-red hover:bg-cyber-red/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="删除记录"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 主表单组件
export const InputForm = ({ formData, setFormData, onSubmit }: InputFormProps) => {
  const { history, saveToHistory, removeFromHistory } = useInputHistory();
  const isFormValid = formData.name && formData.birthDate && formData.gender;

  // 从历史记录中选择
  const handleSelectHistory = (entry: HistoryEntry) => {
    setFormData(prev => ({
      ...prev,
      name: entry.name,
      birthDate: new Date(entry.birthDate),
      gender: entry.gender,
    }));
  };

  // 提交时保存历史记录
  const handleSubmit = () => {
    saveToHistory(formData);
    onSubmit();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex flex-col items-center min-h-screen"
    >
      <Header />

      <div className="w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-display mb-6 sm:mb-8 text-center text-glow">请输入命主信息</h2>
        
        <form className="space-y-5 sm:space-y-6 bg-white/5 p-5 sm:p-8 rounded-lg border border-white/10 backdrop-blur-sm">
          {/* 历史记录选择器 */}
          <HistorySelector
            history={history}
            onSelect={handleSelectHistory}
            onRemove={removeFromHistory}
          />

          <NameInput 
            value={formData.name}
            onChange={(name) => setFormData(prev => ({ ...prev, name }))}
          />

          <BirthDateInput 
            date={formData.birthDate}
            onSelect={(birthDate) => setFormData(prev => ({ ...prev, birthDate }))}
          />

          <GenderSelect 
            value={formData.gender}
            onChange={(gender) => setFormData(prev => ({ ...prev, gender }))}
          />

          <QuerySelect 
            value={formData.query}
            onChange={(query) => setFormData(prev => ({ ...prev, query }))}
          />

          <SubmitButton 
            disabled={!isFormValid}
            onClick={handleSubmit}
          />
        </form>
      </div>
    </motion.div>
  );
};

export default InputForm;
