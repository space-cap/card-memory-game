import type { Player } from '../../types/game';

interface TurnIndicatorProps {
  currentPlayer: Player;
  allPlayers: Player[];
}

/**
 * 대전 모드 턴 표시 컴포넌트
 */
const TurnIndicator = ({ currentPlayer, allPlayers }: TurnIndicatorProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        현재 턴
      </h3>

      <div className="flex justify-center gap-4">
        {allPlayers.map((player) => {
          const isCurrentPlayer = player.id === currentPlayer.id;
          return (
            <div
              key={player.id}
              className={`
                flex flex-col items-center p-4 rounded-xl transition-all
                ${
                  isCurrentPlayer
                    ? 'bg-blue-500 text-white shadow-lg scale-110 animate-pulse'
                    : 'bg-gray-100 text-gray-600'
                }
              `}
            >
              <div className="text-4xl mb-2">
                {player.id === 'player-1' ? '👤' : '👥'}
              </div>
              <div className="font-bold text-lg">{player.name}</div>
              <div className="text-sm mt-1">
                {player.matches}개 매칭
              </div>
              {isCurrentPlayer && (
                <div className="mt-2 text-xs font-semibold uppercase tracking-wide">
                  ⚡ 진행 중
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TurnIndicator;
