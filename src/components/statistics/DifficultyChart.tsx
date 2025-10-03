import type { DifficultyStats } from '../../types/statistics';
import { Difficulty } from '../../types/game';

interface DifficultyChartProps {
  stats: DifficultyStats[];
}

/**
 * 난이도별 통계 차트 컴포넌트 (간단한 바 차트)
 */
const DifficultyChart = ({ stats }: DifficultyChartProps) => {
  const maxScore = Math.max(...stats.map((s) => s.bestScore), 1000);

  const getDifficultyLabel = (difficulty: Difficulty): string => {
    const labels: Record<Difficulty, string> = {
      easy: '쉬움',
      medium: '보통',
      hard: '어려움',
      expert: '전문가',
    };
    return labels[difficulty];
  };

  const getDifficultyColor = (difficulty: Difficulty): string => {
    const colors: Record<Difficulty, string> = {
      easy: 'bg-green-500',
      medium: 'bg-blue-500',
      hard: 'bg-orange-500',
      expert: 'bg-red-500',
    };
    return colors[difficulty];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">난이도별 최고 점수</h3>
      <div className="space-y-4">
        {stats.map((stat) => {
          const percentage = stat.bestScore > 0 ? (stat.bestScore / maxScore) * 100 : 0;
          return (
            <div key={stat.difficulty}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {getDifficultyLabel(stat.difficulty)}
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {stat.bestScore > 0 ? stat.bestScore : '-'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getDifficultyColor(stat.difficulty)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 완료율 차트 */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">난이도별 완료율</h3>
        <div className="space-y-4">
          {stats.map((stat) => {
            const completionRate = stat.gamesPlayed > 0
              ? (stat.gamesCompleted / stat.gamesPlayed) * 100
              : 0;
            return (
              <div key={stat.difficulty}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {getDifficultyLabel(stat.difficulty)}
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {stat.gamesPlayed > 0
                      ? `${stat.gamesCompleted}/${stat.gamesPlayed} (${completionRate.toFixed(0)}%)`
                      : '-'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getDifficultyColor(stat.difficulty)}`}
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DifficultyChart;
