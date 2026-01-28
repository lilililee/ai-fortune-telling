import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Splash } from '@/components/Splash';
import { InputForm } from '@/components/InputForm';
import { Processing } from '@/components/Processing';
import { Result } from '@/components/Result';
import type { AppPhase, FormData, DivinationResult } from '@/types';

function App() {
  const [phase, setPhase] = useState<AppPhase>('splash');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    birthDate: undefined,
    gender: null,
    query: 'comprehensive',
  });
  const [divinationResult, setDivinationResult] = useState<DivinationResult | null>(null);

  // 开始算命
  const handleStartDivination = useCallback(() => {
    if (formData.name && formData.birthDate && formData.gender) {
      setDivinationResult(null); // 清除之前的结果
      setPhase('processing');
    }
  }, [formData]);

  // 处理完成 - 接收 AI 返回的结果
  const handleProcessingComplete = useCallback((result: DivinationResult) => {
    setDivinationResult(result);
    setPhase('result');
  }, []);

  // 重新开始
  const handleRestart = useCallback(() => {
    setFormData({
      name: '',
      birthDate: undefined,
      gender: null,
      query: 'comprehensive',
    });
    setPhase('input');
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-cyber-black text-white font-sans selection:bg-cyber-cyan selection:text-cyber-black">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-20" />
      
      <AnimatePresence mode="wait">
        {phase === 'splash' && (
          <Splash 
            key="splash" 
            onEnter={() => setPhase('input')} 
          />
        )}
        
        {phase === 'input' && (
          <InputForm 
            key="input" 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleStartDivination}
          />
        )}
        
        {phase === 'processing' && (
          <Processing 
            key="processing" 
            formData={formData} 
            onComplete={handleProcessingComplete} 
          />
        )}
        
        {phase === 'result' && divinationResult && (
          <Result 
            key="result" 
            formData={formData}
            result={divinationResult}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
