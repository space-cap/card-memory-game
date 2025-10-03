import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/deck/ImageUploader';
import Button from '../components/common/Button';
import { DeckCategory } from '../types/deck';
import { saveCustomDeck } from '../services/customDeckStorage';

/**
 * 커스텀 덱 생성 페이지
 */
const DeckCreatorPage = () => {
  const navigate = useNavigate();
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [category, setCategory] = useState<DeckCategory>(DeckCategory.CUSTOM);
  const [images, setImages] = useState<string[]>(Array(12).fill(''));
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(0);

  const handleImageChange = (index: number, imageUrl: string) => {
    const newImages = [...images];
    newImages[index] = imageUrl;
    setImages(newImages);
  };

  const handleAddSlot = () => {
    if (images.length < 18) {
      setImages([...images, '']);
    }
  };

  const handleRemoveSlot = () => {
    if (images.length > 6) {
      setImages(images.slice(0, -1));
    }
  };

  const handleSave = () => {
    // 유효성 검사
    const filledImages = images.filter(img => img !== '');

    if (!deckName.trim()) {
      alert('덱 이름을 입력해주세요.');
      return;
    }

    if (filledImages.length < 6) {
      alert('최소 6개의 이미지가 필요합니다.');
      return;
    }

    try {
      // 덱 저장
      saveCustomDeck({
        name: deckName.trim(),
        description: deckDescription.trim(),
        category,
        images: filledImages,
        thumbnailUrl: filledImages[thumbnailIndex] || filledImages[0],
      });

      alert('덱이 성공적으로 저장되었습니다!');
      navigate('/');
    } catch (error) {
      alert('덱 저장에 실패했습니다. 다시 시도해주세요.');
      console.error('Failed to save deck:', error);
    }
  };

  const filledCount = images.filter(img => img !== '').length;
  const canSave = deckName.trim() && filledCount >= 6;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🎨 커스텀 덱 만들기
        </h1>
        <p className="text-lg text-gray-600">
          나만의 이미지로 특별한 덱을 만들어보세요
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* 덱 정보 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">덱 정보</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                덱 이름 *
              </label>
              <input
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="예: 나의 가족 사진"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                placeholder="덱에 대한 간단한 설명을 입력하세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DeckCategory)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={DeckCategory.CUSTOM}>커스텀</option>
                <option value={DeckCategory.ANIMALS}>동물</option>
                <option value={DeckCategory.FOOD}>음식</option>
                <option value={DeckCategory.NATURE}>자연</option>
                <option value={DeckCategory.SPORTS}>스포츠</option>
                <option value={DeckCategory.EMOJI}>이모지</option>
              </select>
            </div>
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              이미지 ({filledCount}/{images.length})
            </h2>
            <div className="flex gap-2">
              <Button
                onClick={handleRemoveSlot}
                variant="outline"
                size="sm"
                disabled={images.length <= 6}
              >
                - 슬롯 제거
              </Button>
              <Button
                onClick={handleAddSlot}
                variant="outline"
                size="sm"
                disabled={images.length >= 18}
              >
                + 슬롯 추가
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            최소 6개, 최대 18개의 이미지를 업로드하세요. 첫 번째 이미지가 썸네일로 사용됩니다.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <ImageUploader
                  currentImage={image}
                  onImageSelect={(url) => handleImageChange(index, url)}
                  label={`#${index + 1}`}
                />
                {index === 0 && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    썸네일
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            variant="primary"
            size="lg"
            disabled={!canSave}
          >
            {canSave ? '덱 저장' : `이미지 ${6 - filledCount}개 더 필요`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeckCreatorPage;
