import { useEffect, useState } from 'react';

interface CelebrationEffectProps {
  show: boolean;
}

/**
 * 게임 완료 축하 애니메이션
 */
const CelebrationEffect = ({ show }: CelebrationEffectProps) => {
  const [confetti, setConfetti] = useState<{ id: number; left: number; delay: number }[]>([]);

  useEffect(() => {
    if (show) {
      // 20개의 색종이 조각 생성
      const items = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setConfetti(items);
    } else {
      setConfetti([]);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((item) => (
        <div
          key={item.id}
          className="absolute top-0 text-4xl animate-[confetti_3s_ease-out_forwards]"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {['🎉', '✨', '🎊', '⭐', '🌟'][item.id % 5]}
        </div>
      ))}

      {/* 중앙 축하 메시지 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center animate-[float_2s_ease-in-out_infinite]">
          <div className="text-9xl mb-4 animate-[bounce_1s_ease-in-out_infinite]">
            🎉
          </div>
          <h2 className="text-6xl font-bold text-yellow-400 drop-shadow-2xl animate-pulse">
            완료!
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CelebrationEffect;
