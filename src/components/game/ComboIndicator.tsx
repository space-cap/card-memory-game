import { memo } from 'react';
import type { ComboState } from '../../types/game';

interface ComboIndicatorProps {
  combo: ComboState;
}

/**
 * 타임 어택 모드 콤보 표시 컴포넌트
 */
export const ComboIndicator = memo(({ combo }: ComboIndicatorProps) => {
  if (combo.count === 0) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 콤보 카운트 */}
      <div
        className="text-4xl font-bold text-yellow-500 animate-pulse"
        style={{
          animation: combo.count > 5 ? 'pulse 0.5s ease-in-out infinite' : undefined,
        }}
      >
        {combo.count} COMBO!
      </div>

      {/* 배율 표시 */}
      <div
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full text-lg shadow-lg"
        style={{
          transform: `scale(${1 + combo.multiplier * 0.1})`,
          transition: 'transform 0.3s ease',
        }}
      >
        ✨ {combo.multiplier}x 배율
      </div>

      {/* 최대 콤보 */}
      {combo.maxCombo > 3 && (
        <div className="text-sm text-gray-600">
          최고 콤보: {combo.maxCombo}
        </div>
      )}
    </div>
  );
});

ComboIndicator.displayName = 'ComboIndicator';
