import { memo, useCallback } from 'react';
import type { Card as CardType } from '../../types/game';
import { CardState } from '../../types/game';

interface CardProps {
  card: CardType;
  onClick: (cardId: string) => void;
  disabled?: boolean;
}

/**
 * 카드 컴포넌트 (React.memo로 최적화)
 */
const Card = memo(({ card, onClick, disabled = false }: CardProps) => {
  const isRevealed = card.state === CardState.REVEALED || card.state === CardState.MATCHED;
  const isMatched = card.state === CardState.MATCHED;

  const handleClick = useCallback(() => {
    if (!disabled && card.state === CardState.HIDDEN) {
      onClick(card.id);
    }
  }, [disabled, card.state, card.id, onClick]);

  return (
    <div
      onClick={handleClick}
      className={`
        relative aspect-square cursor-pointer
        transition-all duration-300 transform
        ${!disabled && card.state === CardState.HIDDEN ? 'hover:scale-110 hover:shadow-2xl hover:-translate-y-1' : ''}
        ${isMatched ? 'animate-[pulse_0.5s_ease-in-out] scale-105' : ''}
      `}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`
          relative w-full h-full transition-all duration-700 ease-out
          ${isRevealed ? '[transform:rotateY(180deg)]' : ''}
          ${isMatched ? 'animate-[bounce_0.6s_ease-in-out]' : ''}
        `}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 카드 뒷면 */}
        <div
          className={`
            absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600
            rounded-xl shadow-lg flex items-center justify-center
            [backface-visibility:hidden]
            transition-all duration-300
            ${!disabled && card.state === CardState.HIDDEN ? 'hover:shadow-purple-400/50' : ''}
          `}
        >
          <div className="text-6xl animate-pulse">🎴</div>
        </div>

        {/* 카드 앞면 */}
        <div
          className={`
            absolute inset-0 bg-white rounded-xl shadow-lg
            flex items-center justify-center p-2
            [backface-visibility:hidden] [transform:rotateY(180deg)]
            transition-all duration-300
            ${isMatched ? 'ring-4 ring-green-400 shadow-green-400/50 animate-[wiggle_0.5s_ease-in-out]' : ''}
          `}
        >
          <img
            src={card.imageUrl}
            alt="Card"
            className={`
              w-full h-full object-contain
              transition-transform duration-300
              ${isMatched ? 'scale-110' : ''}
            `}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
