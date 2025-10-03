import Modal from '../common/Modal';
import Button from '../common/Button';
import type { Player } from '../../types/game';
import { GameMode } from '../../types/game';

interface GameResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  mode: GameMode;
  moves: number;
  timeElapsed: number;
  pointsEarned?: number;
  onRestart: () => void;
  onExit: () => void;
}

/**
 * 게임 결과 모달 컴포넌트
 */
const GameResultModal = ({
  isOpen,
  onClose,
  players,
  mode,
  moves,
  timeElapsed,
  pointsEarned,
  onRestart,
  onExit,
}: GameResultModalProps) => {
  // Guard clause for invalid data
  if (!players || players.length === 0) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  const renderSingleResult = () => {
    const player = players[0];
    if (!player) return null;
    return (
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">게임 완료!</h2>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-sm text-gray-600 mb-2">최종 점수</div>
              <div className="text-3xl font-bold text-blue-600">{player.score}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-sm text-gray-600 mb-2">소요 시간</div>
              <div className="text-3xl font-bold text-gray-800">{formatTime(timeElapsed)}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-sm text-gray-600 mb-2">이동 횟수</div>
              <div className="text-3xl font-bold text-gray-800">{moves}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-sm text-gray-600 mb-2">매칭 성공</div>
              <div className="text-3xl font-bold text-green-600">{player.matches}</div>
            </div>
          </div>

          {pointsEarned && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
              <div className="text-sm text-yellow-800 mb-1">획득 포인트</div>
              <div className="text-2xl font-bold text-yellow-600">💎 {pointsEarned}</div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={onRestart} variant="primary" size="lg">
            🔄 다시하기
          </Button>
          <Button onClick={onExit} variant="outline" size="lg">
            🏠 홈으로
          </Button>
        </div>
      </div>
    );
  };

  const renderVersusResult = () => {
    const [player1, player2] = players;
    if (!player1 || !player2) return null;

    const winner = player1.matches > player2.matches ? player1 : player2.matches > player1.matches ? player2 : null;

    return (
      <div className="text-center">
        {/* 승자 표시 */}
        <div className="mb-6">
          <div className="text-8xl mb-4 animate-bounce">
            {winner ? '👑' : '🤝'}
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            {winner ? `${winner.name} 승리!` : '무승부!'}
          </h2>
          {winner && (
            <p className="text-lg text-gray-600">
              {winner.matches}개 매칭 성공!
            </p>
          )}
        </div>

        {/* 플레이어 결과 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {players.map((player) => {
            const isWinner = player.id === winner?.id;
            return (
              <div
                key={player.id}
                className={`
                  p-6 rounded-xl transition-all
                  ${isWinner
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 ring-4 ring-yellow-400 scale-105'
                    : 'bg-gray-50'}
                `}
              >
                {isWinner && (
                  <div className="text-3xl mb-2">🏆</div>
                )}
                <div className="font-bold text-xl mb-3">{player.name}</div>
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {player.matches}
                </div>
                <div className="text-sm text-gray-600">매칭 성공</div>
              </div>
            );
          })}
        </div>

        {/* 게임 통계 */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">총 이동</div>
              <div className="font-bold text-gray-800">{moves}회</div>
            </div>
            <div>
              <div className="text-gray-600">플레이 시간</div>
              <div className="font-bold text-gray-800">{formatTime(timeElapsed)}</div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 justify-center">
          <Button onClick={onRestart} variant="primary" size="lg">
            🔄 다시하기
          </Button>
          <Button onClick={onExit} variant="outline" size="lg">
            🏠 홈으로
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {mode === GameMode.SINGLE ? renderSingleResult() : renderVersusResult()}
    </Modal>
  );
};

export default GameResultModal;
