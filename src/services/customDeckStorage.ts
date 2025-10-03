import { v4 as uuidv4 } from 'uuid';
import type { Deck } from '../types/deck';

const CUSTOM_DECKS_KEY = 'card-memory-game-custom-decks';

/**
 * 모든 커스텀 덱 가져오기
 */
export function getCustomDecks(): Deck[] {
  try {
    const data = localStorage.getItem(CUSTOM_DECKS_KEY);
    if (!data) return [];
    return JSON.parse(data) as Deck[];
  } catch (error) {
    console.error('Failed to load custom decks:', error);
    return [];
  }
}

/**
 * 커스텀 덱 저장
 */
export function saveCustomDeck(deck: Omit<Deck, 'id' | 'createdAt' | 'isOwned' | 'isPremium' | 'price'>): Deck {
  const newDeck: Deck = {
    ...deck,
    id: `custom-${uuidv4()}`,
    price: 0,
    isPremium: false,
    isOwned: true,
    createdAt: new Date().toISOString(),
  };

  try {
    const decks = getCustomDecks();
    decks.push(newDeck);
    localStorage.setItem(CUSTOM_DECKS_KEY, JSON.stringify(decks));
    return newDeck;
  } catch (error) {
    console.error('Failed to save custom deck:', error);
    throw new Error('덱 저장에 실패했습니다.');
  }
}

/**
 * 커스텀 덱 업데이트
 */
export function updateCustomDeck(deckId: string, updates: Partial<Deck>): boolean {
  try {
    const decks = getCustomDecks();
    const index = decks.findIndex(d => d.id === deckId);

    if (index === -1) {
      return false;
    }

    decks[index] = { ...decks[index], ...updates };
    localStorage.setItem(CUSTOM_DECKS_KEY, JSON.stringify(decks));
    return true;
  } catch (error) {
    console.error('Failed to update custom deck:', error);
    return false;
  }
}

/**
 * 커스텀 덱 삭제
 */
export function deleteCustomDeck(deckId: string): boolean {
  try {
    const decks = getCustomDecks();
    const filtered = decks.filter(d => d.id !== deckId);

    if (filtered.length === decks.length) {
      return false; // 삭제할 덱이 없음
    }

    localStorage.setItem(CUSTOM_DECKS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete custom deck:', error);
    return false;
  }
}

/**
 * ID로 커스텀 덱 가져오기
 */
export function getCustomDeckById(deckId: string): Deck | undefined {
  const decks = getCustomDecks();
  return decks.find(d => d.id === deckId);
}

/**
 * 덱 내보내기 (JSON)
 */
export function exportDeck(deckId: string): string | null {
  const deck = getCustomDeckById(deckId);
  if (!deck) return null;

  try {
    return JSON.stringify(deck, null, 2);
  } catch (error) {
    console.error('Failed to export deck:', error);
    return null;
  }
}

/**
 * 덱 가져오기 (JSON)
 */
export function importDeck(jsonString: string): Deck | null {
  try {
    const deck = JSON.parse(jsonString) as Deck;

    // 유효성 검사
    if (!deck.name || !deck.images || !Array.isArray(deck.images) || deck.images.length < 6) {
      throw new Error('Invalid deck format');
    }

    // 새 ID 부여
    return saveCustomDeck({
      name: deck.name,
      description: deck.description || '',
      category: deck.category,
      thumbnailUrl: deck.thumbnailUrl,
      images: deck.images,
    });
  } catch (error) {
    console.error('Failed to import deck:', error);
    return null;
  }
}

/**
 * 덱 복제
 */
export function duplicateDeck(deckId: string): Deck | null {
  const deck = getCustomDeckById(deckId);
  if (!deck) return null;

  return saveCustomDeck({
    name: `${deck.name} (복사본)`,
    description: deck.description,
    category: deck.category,
    thumbnailUrl: deck.thumbnailUrl,
    images: deck.images,
  });
}

/**
 * 모든 커스텀 덱 삭제
 */
export function clearAllCustomDecks(): void {
  try {
    localStorage.removeItem(CUSTOM_DECKS_KEY);
  } catch (error) {
    console.error('Failed to clear custom decks:', error);
  }
}
