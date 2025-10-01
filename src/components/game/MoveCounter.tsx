interface MoveCounterProps {
  moves: number;
}

/**
 * 이동 횟수 카운터 컴포넌트
 */
const MoveCounter = ({ moves }: MoveCounterProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-gray-600 mb-1">이동</div>
      <div className="text-2xl font-bold text-gray-800">{moves}</div>
    </div>
  );
};

export default MoveCounter;
