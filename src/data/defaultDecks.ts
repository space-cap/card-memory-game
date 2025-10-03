import type { Deck } from '../types/deck';
import { DeckCategory } from '../types/deck';

/**
 * 기본 무료 덱 데이터
 * 실제 프로젝트에서는 이미지를 assets 폴더에 넣거나 외부 URL 사용
 */

// 임시로 이모지를 사용합니다
const EMOJI_ANIMALS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦'];
const EMOJI_FOOD = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥕', '🌽', '🥦'];
const EMOJI_FACES = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚'];

/**
 * 이모지를 data URL 이미지로 변환
 */
function emojiToDataUrl(emoji: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.font = '100px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 64, 64);
  }

  return canvas.toDataURL();
}

/**
 * 기본 덱 목록
 */
export const DEFAULT_DECKS: Deck[] = [
  {
    id: 'deck-animals',
    name: '동물 친구들',
    description: '귀여운 동물 친구들과 함께 즐기는 카드 게임',
    category: DeckCategory.ANIMALS,
    thumbnailUrl: emojiToDataUrl('🐶'),
    images: EMOJI_ANIMALS.map(emojiToDataUrl),
    price: 0,
    isPremium: false,
    isOwned: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'deck-food',
    name: '맛있는 과일',
    description: '신선하고 맛있는 과일들',
    category: DeckCategory.FOOD,
    thumbnailUrl: emojiToDataUrl('🍎'),
    images: EMOJI_FOOD.map(emojiToDataUrl),
    price: 0,
    isPremium: false,
    isOwned: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'deck-emoji',
    name: '표정 이모지',
    description: '다양한 표정의 이모지들',
    category: DeckCategory.EMOJI,
    thumbnailUrl: emojiToDataUrl('😀'),
    images: EMOJI_FACES.map(emojiToDataUrl),
    price: 0,
    isPremium: false,
    isOwned: true,
    createdAt: new Date().toISOString(),
  },
];

/**
 * 덱 ID로 덱 가져오기 (기본 덱 + 커스텀 덱)
 */
export function getDeckById(deckId: string): Deck | undefined {
  // 먼저 기본 덱에서 찾기
  const defaultDeck = DEFAULT_DECKS.find((deck) => deck.id === deckId);
  if (defaultDeck) return defaultDeck;

  // 커스텀 덱에서 찾기
  if (typeof window !== 'undefined') {
    try {
      const customDecksData = localStorage.getItem('card-memory-game-custom-decks');
      if (customDecksData) {
        const customDecks = JSON.parse(customDecksData) as Deck[];
        return customDecks.find((deck) => deck.id === deckId);
      }
    } catch (error) {
      console.error('Failed to load custom deck:', error);
    }
  }

  return undefined;
}

/**
 * 소유한 덱만 가져오기 (기본 덱 + 커스텀 덱)
 */
export function getOwnedDecks(): Deck[] {
  const ownedDecks = DEFAULT_DECKS.filter((deck) => deck.isOwned);

  // 커스텀 덱 추가
  if (typeof window !== 'undefined') {
    try {
      const customDecksData = localStorage.getItem('card-memory-game-custom-decks');
      if (customDecksData) {
        const customDecks = JSON.parse(customDecksData) as Deck[];
        return [...ownedDecks, ...customDecks];
      }
    } catch (error) {
      console.error('Failed to load custom decks:', error);
    }
  }

  return ownedDecks;
}
