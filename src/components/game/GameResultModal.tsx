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
        <div className="text-6xl mb-4">
          {winner ? '👑' : '🤝'}
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {winner ? `${winner.name} 승리!` : '무승부!'}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {players.map((player) => (
            <div
              key={player.id}
              className={`
                p-6 rounded-xl
                ${player.id === winner?.id ? 'bg-yellow-50 ring-2 ring-yellow-400' : 'bg-gray-50'}
              `}
            >
              <div className="font-bold text-lg mb-3">{player.name}</div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{player.score}</div>
              <div className="text-sm text-gray-600">매칭: {player.matches}</div>
            </div>
          ))}
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {mode === GameMode.SINGLE ? renderSingleResult() : renderVersusResult()}
    </Modal>
  );
};

export default GameResultModal;
