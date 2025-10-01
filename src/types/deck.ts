/**
 * 덱 카테고리
 */
export enum DeckCategory {
  ANIMALS = 'animals',
  HISTORY = 'history',
  NATURE = 'nature',
  FOOD = 'food',
  SPORTS = 'sports',
  ART = 'art',
  SCIENCE = 'science',
  FANTASY = 'fantasy',
}

/**
 * 덱 인터페이스
 */
export interface Deck {
  id: string;
  name: string;
  description: string;
  category: DeckCategory;
  thumbnailUrl: string;
  images: string[]; // 18개의 이미지 URL
  price: number; // 0이면 무료
  isPremium: boolean;
  isOwned: boolean;
  createdAt: string;
}

/**
 * 덱 필터 옵션
 */
export interface DeckFilter {
  category?: DeckCategory;
  isPremium?: boolean;
  isOwned?: boolean;
  searchTerm?: string;
}
