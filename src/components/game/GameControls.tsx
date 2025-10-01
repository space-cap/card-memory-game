import Button from '../common/Button';
import { GameStatus } from '../../types/game';

interface GameControlsProps {
  status: GameStatus;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
}

/**
 * 게임 컨트롤 컴포넌트
 */
const GameControls = ({ status, onPause, onResume, onRestart, onExit }: GameControlsProps) => {
  return (
    <div className="flex gap-3 justify-center">
      {status === GameStatus.PLAYING && (
        <Button onClick={onPause} variant="secondary" size="sm">
          ⏸️ 일시정지
        </Button>
      )}

      {status === GameStatus.PAUSED && (
        <Button onClick={onResume} variant="primary" size="sm">
          ▶️ 재개
        </Button>
      )}

      <Button onClick={onRestart} variant="outline" size="sm">
        🔄 다시하기
      </Button>

      <Button onClick={onExit} variant="danger" size="sm">
        ❌ 종료
      </Button>
    </div>
  );
};

export default GameControls;
