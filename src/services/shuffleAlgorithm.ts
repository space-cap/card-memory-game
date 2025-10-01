/**
 * Fisher-Yates 셔플 알고리즘
 * 배열을 무작위로 섞는 표준 알고리즘
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * 카드 쌍 생성 및 셔플
 * @param imageUrls - 이미지 URL 배열
 * @param pairs - 필요한 쌍의 개수
 * @returns 셔플된 카드 쌍 배열
 */
export function createShuffledPairs(imageUrls: string[], pairs: number): Array<{ imageUrl: string; pairId: string }> {
  // 필요한 만큼의 이미지만 선택
  const selectedImages = imageUrls.slice(0, pairs);

  // 각 이미지를 2번씩 사용하여 쌍 생성
  const cardPairs = selectedImages.flatMap((imageUrl, index) => [
    { imageUrl, pairId: `pair-${index}` },
    { imageUrl, pairId: `pair-${index}` },
  ]);

  // 셔플
  return shuffleArray(cardPairs);
}
