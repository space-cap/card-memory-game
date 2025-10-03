import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import DeckSelector from '../components/home/DeckSelector';
import { GameMode, Difficulty } from '../types/game';
import { getOwnedDecks } from '../data/defaultDecks';

/**
 * 홈페이지 - 게임 모드 및 난이도 선택
 */
const HomePage = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.SINGLE);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [selectedDeckId, setSelectedDeckId] = useState<string>('deck-animals');

  const ownedDecks = getOwnedDecks();

  const handleStartGame = () => {
    const params = new URLSearchParams({
      mode: selectedMode,
      difficulty: selectedDifficulty,
      deckId: selectedDeckId,
    });
    navigate(`/game?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 타이틀 */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          🎴 카드 메모리 게임
        </h1>
        <p className="text-xl text-gray-600">
          모드와 난이도를 선택하여 게임을 시작하세요!
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* 게임 모드 선택 */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🎮 게임 모드
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* 싱글 모드 */}
            <button
              onClick={() => setSelectedMode(GameMode.SINGLE)}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedMode === GameMode.SINGLE
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                싱글 플레이
              </h3>
              <p className="text-gray-600 text-sm">
                혼자서 최고 기록에 도전하세요
              </p>
            </button>

            {/* 대전 모드 (Phase 2에서 구현) */}
            <button
              onClick={() => setSelectedMode(GameMode.VERSUS)}
              disabled
              className="p-6 rounded-xl border-2 border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
            >
              <div className="text-4xl mb-3">⚔️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                대전 모드
              </h3>
              <p className="text-gray-600 text-sm">
                곧 출시 예정!
              </p>
            </button>
          </div>
        </section>

        {/* 덱 선택 */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <DeckSelector
            decks={ownedDecks}
            selectedDeckId={selectedDeckId}
            onSelect={setSelectedDeckId}
          />
        </section>

        {/* 난이도 선택 */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            ⭐ 난이도
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 쉬움 */}
            <button
              onClick={() => setSelectedDifficulty(Difficulty.EASY)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedDifficulty === Difficulty.EASY
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-3xl mb-2">😊</div>
              <h3 className="font-bold text-gray-800 mb-1">쉬움</h3>
              <p className="text-xs text-gray-600">6쌍 (12장)</p>
            </button>

            {/* 보통 */}
            <button
              onClick={() => setSelectedDifficulty(Difficulty.MEDIUM)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedDifficulty === Difficulty.MEDIUM
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-3xl mb-2">🙂</div>
              <h3 className="font-bold text-gray-800 mb-1">보통</h3>
              <p className="text-xs text-gray-600">9쌍 (18장)</p>
            </button>

            {/* 어려움 */}
            <button
              onClick={() => setSelectedDifficulty(Difficulty.HARD)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedDifficulty === Difficulty.HARD
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-3xl mb-2">😤</div>
              <h3 className="font-bold text-gray-800 mb-1">어려움</h3>
              <p className="text-xs text-gray-600">12쌍 (24장)</p>
              <p className="text-xs text-orange-600 mt-1">제한시간 3분</p>
            </button>

            {/* 전문가 */}
            <button
              onClick={() => setSelectedDifficulty(Difficulty.EXPERT)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedDifficulty === Difficulty.EXPERT
                  ? 'border-red-500 bg-red-50 shadow-md'
                  : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-3xl mb-2">🔥</div>
              <h3 className="font-bold text-gray-800 mb-1">전문가</h3>
              <p className="text-xs text-gray-600">18쌍 (36장)</p>
              <p className="text-xs text-red-600 mt-1">제한시간 5분</p>
            </button>
          </div>
        </section>

        {/* 버튼 */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => navigate('/statistics')}
            variant="secondary"
            size="lg"
            className="px-8 text-lg"
          >
            📊 통계 보기
          </Button>
          <Button
            onClick={handleStartGame}
            size="lg"
            className="px-12 text-xl"
          >
            게임 시작 🚀
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
