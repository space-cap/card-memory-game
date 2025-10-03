import { useEffect, useState } from 'react';

interface MatchEffectProps {
  type: 'success' | 'failure' | null;
  onComplete?: () => void;
}

/**
 * 매칭 성공/실패 시각 효과 컴포넌트
 */
const MatchEffect = ({ type, onComplete }: MatchEffectProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (type) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [type, onComplete]);

  if (!visible || !type) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {type === 'success' ? (
        <div className="animate-[bounce_0.6s_ease-in-out]">
          <div className="text-9xl drop-shadow-2xl animate-[pulse_0.5s_ease-in-out]">
            ✨
          </div>
        </div>
      ) : (
        <div className="animate-[wiggle_0.5s_ease-in-out]">
          <div className="text-9xl drop-shadow-2xl opacity-70">
            ❌
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchEffect;
