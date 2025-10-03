import { useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
}

/**
 * 이미지 업로드 컴포넌트
 */
const ImageUploader = ({ onImageSelect, currentImage, label = '이미지 선택' }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 검증 (5MB 제한)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('이미지 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    // 파일 형식 검증
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('JPG, PNG, GIF, WebP 형식만 지원됩니다.');
      return;
    }

    setError('');

    // FileReader로 이미지 읽기
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      onImageSelect(imageUrl);
    };
    reader.onerror = () => {
      setError('이미지를 읽는 중 오류가 발생했습니다.');
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelect('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError('');
  };

  return (
    <div className="relative">
      <div
        onClick={handleClick}
        className={`
          relative w-full aspect-square rounded-xl border-2 border-dashed
          cursor-pointer transition-all overflow-hidden
          ${currentImage
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }
          ${error ? 'border-red-500 bg-red-50' : ''}
        `}
      >
        {currentImage ? (
          <>
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
              aria-label="이미지 제거"
            >
              ✕
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <div className="text-5xl mb-2">📷</div>
            <div className="text-sm font-medium">{label}</div>
            <div className="text-xs mt-1">클릭하여 업로드</div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500 text-center">
        JPG, PNG, GIF, WebP (최대 5MB)
      </div>
    </div>
  );
};

export default ImageUploader;
