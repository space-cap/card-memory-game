import type { Card as CardType } from '../../types/game';
import { CardState } from '../../types/game';

interface CardProps {
  card: CardType;
  onClick: (cardId: string) => void;
  disabled?: boolean;
}

/**
 * 카드 컴포넌트
 */
const Card = ({ card, onClick, disabled = false }: CardProps) => {
  const isRevealed = card.state === CardState.REVEALED || card.state === CardState.MATCHED;
  const isMatched = card.state === CardState.MATCHED;

  const handleClick = () => {
    if (!disabled && card.state === CardState.HIDDEN) {
      onClick(card.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative aspect-square cursor-pointer
        transition-all duration-300 transform
        ${!disabled && card.state === CardState.HIDDEN ? 'hover:scale-105 hover:shadow-xl' : ''}
        ${isMatched ? 'opacity-60' : ''}
      `}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`
          relative w-full h-full transition-transform duration-500
          ${isRevealed ? '[transform:rotateY(180deg)]' : ''}
        `}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 카드 뒷면 */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600
                     rounded-xl shadow-lg flex items-center justify-center
                     [backface-visibility:hidden]"
        >
          <div className="text-6xl">🎴</div>
        </div>

        {/* 카드 앞면 */}
        <div
          className={`
            absolute inset-0 bg-white rounded-xl shadow-lg
            flex items-center justify-center p-2
            [backface-visibility:hidden] [transform:rotateY(180deg)]
            ${isMatched ? 'ring-4 ring-green-400' : ''}
          `}
        >
          <img
            src={card.imageUrl}
            alt="Card"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
