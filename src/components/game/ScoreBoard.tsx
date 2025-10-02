import type { Player } from '../../types/game';
import { GameMode } from '../../types/game';

interface ScoreBoardProps {
  players: Player[];
  currentPlayerId?: string;
  mode: GameMode;
}

/**
 * 점수판 컴포넌트
 */
const ScoreBoard = ({ players, currentPlayerId, mode }: ScoreBoardProps) => {
  if (!players || players.length === 0) {
    return null;
  }

  if (mode === GameMode.SINGLE) {
    const player = players[0];
    return (
      <div className="flex flex-col items-center">
        <div className="text-sm text-gray-600 mb-1">점수</div>
        <div className="text-2xl font-bold text-blue-600">{player.score}</div>
        <div className="text-xs text-gray-500 mt-1">
          매칭: {player.matches}
        </div>
      </div>
    );
  }

  // 대전 모드
  return (
    <div className="flex gap-8">
      {players.map((player) => (
        <div
          key={player.id}
          className={`
            flex flex-col items-center p-4 rounded-lg transition-all
            ${player.id === currentPlayerId ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-100'}
          `}
        >
          <div className="text-sm font-medium mb-2">{player.name}</div>
          <div className="text-3xl font-bold text-blue-600">{player.score}</div>
          <div className="text-xs text-gray-500 mt-1">
            매칭: {player.matches}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreBoard;
