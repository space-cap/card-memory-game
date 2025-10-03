import { memo } from 'react';

interface TimeAttackTimerProps {
  timeRemaining: number; // 남은 시간 (초)
  timeLimit: number; // 전체 시간 제한 (초)
}

/**
 * 타임 어택 모드 타이머 컴포넌트
 */
export const TimeAttackTimer = memo(({ timeRemaining, timeLimit }: TimeAttackTimerProps) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const percentage = (timeRemaining / timeLimit) * 100;

  // 남은 시간에 따른 색상 결정
  const getColor = () => {
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col items-center gap-2 min-w-[120px]">
      {/* 시간 표시 */}
      <div className={`text-3xl font-bold ${getColor()}`}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>

      {/* 프로그레스 바 */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getBarColor()} transition-all duration-1000 ease-linear`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 라벨 */}
      <div className="text-xs text-gray-500">남은 시간</div>

      {/* 10초 이하일 때 경고 애니메이션 */}
      {timeRemaining <= 10 && (
        <div className="text-red-600 text-sm font-bold animate-pulse">
          ⚠️ 서둘러요!
        </div>
      )}
    </div>
  );
});

TimeAttackTimer.displayName = 'TimeAttackTimer';
