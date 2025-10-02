import type { Deck } from '../../types/deck';

interface DeckSelectorProps {
  decks: Deck[];
  selectedDeckId: string;
  onSelect: (deckId: string) => void;
}

/**
 * 덱 선택 컴포넌트
 */
const DeckSelector = ({ decks, selectedDeckId, onSelect }: DeckSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800">덱 선택</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {decks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => onSelect(deck.id)}
            className={`
              relative p-4 rounded-xl border-2 transition-all
              ${
                selectedDeckId === deck.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            {/* 썸네일 */}
            <div className="flex justify-center mb-3">
              <img
                src={deck.thumbnailUrl}
                alt={deck.name}
                className="w-20 h-20 object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* 덱 정보 */}
            <div className="text-center">
              <h4 className="font-bold text-gray-800 mb-1">{deck.name}</h4>
              <p className="text-sm text-gray-600">{deck.description}</p>
            </div>

            {/* 선택 표시 */}
            {selectedDeckId === deck.id && (
              <div className="absolute top-2 right-2">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  ✓
                </div>
              </div>
            )}

            {/* 프리미엄 배지 */}
            {deck.isPremium && (
              <div className="absolute top-2 left-2">
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  ⭐ Premium
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DeckSelector;
