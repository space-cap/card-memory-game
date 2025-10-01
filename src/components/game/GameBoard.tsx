import type { Card as CardType } from '../../types/game';
import Card from './Card';

interface GameBoardProps {
  cards: CardType[];
  onCardClick: (cardId: string) => void;
  disabled?: boolean;
  gridCols: number;
}

/**
 * 게임 보드 컴포넌트
 */
const GameBoard = ({ cards, onCardClick, disabled = false, gridCols }: GameBoardProps) => {
  return (
    <div
      className="w-full max-w-4xl mx-auto p-4"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        gap: '1rem',
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={onCardClick}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default GameBoard;
