interface TimerProps {
  timeElapsed: number;
  timeLimit?: number;
}

/**
 * 타이머 컴포넌트
 */
const Timer = ({ timeElapsed, timeLimit }: TimerProps) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLimit && timeElapsed > timeLimit * 0.8;
  const isDanger = timeLimit && timeElapsed > timeLimit * 0.9;

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-gray-600 mb-1">시간</div>
      <div
        className={`
          text-2xl font-bold font-mono
          ${isDanger ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-gray-800'}
        `}
      >
        {formatTime(timeElapsed)}
      </div>
      {timeLimit && (
        <div className="text-xs text-gray-500 mt-1">
          / {formatTime(timeLimit)}
        </div>
      )}
    </div>
  );
};

export default Timer;
