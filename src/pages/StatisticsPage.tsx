import { useNavigate } from 'react-router-dom';
import { calculateGameStatistics } from '../services/statisticsStorage';
import { Difficulty } from '../types/game';
import Button from '../components/common/Button';
import DifficultyChart from '../components/statistics/DifficultyChart';

/**
 * 통계 페이지
 */
const StatisticsPage = () => {
  const navigate = useNavigate();
  const stats = calculateGameStatistics();

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const getDifficultyLabel = (difficulty: Difficulty): string => {
    const labels: Record<Difficulty, string> = {
      easy: '쉬움',
      medium: '보통',
      hard: '어려움',
      expert: '전문가',
    };
    return labels[difficulty];
  };

  const getDifficultyEmoji = (difficulty: Difficulty): string => {
    const emojis: Record<Difficulty, string> = {
      easy: '😊',
      medium: '🙂',
      hard: '😤',
      expert: '🔥',
    };
    return emojis[difficulty];
  };

  const getDifficultyColor = (difficulty: Difficulty): string => {
    const colors: Record<Difficulty, string> = {
      easy: 'green',
      medium: 'blue',
      hard: 'orange',
      expert: 'red',
    };
    return colors[difficulty];
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 헤더 */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">📊 게임 통계</h1>
        <p className="text-xl text-gray-600">당신의 게임 기록을 확인하세요</p>
      </div>

      {/* 전체 통계 카드 */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">🎮</div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalGamesPlayed}</div>
            <div className="text-gray-600">총 플레이 게임</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">{stats.totalGamesCompleted}</div>
            <div className="text-gray-600">완료한 게임</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">⏱️</div>
            <div className="text-3xl font-bold text-purple-600">{formatTime(stats.totalPlayTime)}</div>
            <div className="text-gray-600">총 플레이 시간</div>
          </div>
        </div>
      </div>

      {/* 난이도별 차트 */}
      <div className="max-w-6xl mx-auto mb-8">
        <DifficultyChart stats={stats.difficultyStats} />
      </div>

      {/* 난이도별 통계 */}
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">난이도별 상세 통계</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {stats.difficultyStats.map((diffStat) => {
            const color = getDifficultyColor(diffStat.difficulty);
            return (
              <div key={diffStat.difficulty} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{getDifficultyEmoji(diffStat.difficulty)}</span>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {getDifficultyLabel(diffStat.difficulty)}
                    </h3>
                  </div>
                  <div className={`text-${color}-600 font-bold text-lg`}>
                    {diffStat.gamesCompleted}/{diffStat.gamesPlayed}
                  </div>
                </div>

                {diffStat.gamesPlayed > 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">최고 점수</span>
                      <span className={`text-${color}-600 font-bold text-xl`}>
                        {diffStat.bestScore}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">평균 점수</span>
                      <span className="text-gray-800 font-semibold">
                        {diffStat.averageScore}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">최고 기록 (시간)</span>
                      <span className="text-gray-800 font-semibold">
                        {formatTime(diffStat.bestTime)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">평균 이동 횟수</span>
                      <span className="text-gray-800 font-semibold">
                        {diffStat.averageMoves}회
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    아직 기록이 없습니다
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 최근 기록 */}
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">최근 게임 기록</h2>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {stats.recentRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      날짜
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      난이도
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      점수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이동
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      시간
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.completedAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="flex items-center gap-2">
                          {getDifficultyEmoji(record.difficulty)}
                          {getDifficultyLabel(record.difficulty)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {record.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.moves}회
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatTime(record.timeElapsed)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {record.isCompleted ? (
                          <span className="text-green-600 font-semibold">✓ 완료</span>
                        ) : (
                          <span className="text-red-600 font-semibold">⏱️ 시간초과</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-lg">아직 게임 기록이 없습니다</p>
              <p className="text-sm mt-2">첫 게임을 시작해보세요!</p>
            </div>
          )}
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-center gap-4">
        <Button onClick={() => navigate('/')} variant="secondary">
          홈으로
        </Button>
        <Button onClick={() => navigate('/game?mode=single&difficulty=easy&deckId=deck-animals')}>
          게임 시작
        </Button>
      </div>
    </div>
  );
};

export default StatisticsPage;
