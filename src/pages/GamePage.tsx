import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import { useTimer } from '../hooks/useTimer';
import type { GameConfig } from '../types/game';
import { GameMode, Difficulty, GameStatus, DIFFICULTY_CONFIG } from '../types/game';
import { getDeckById } from '../data/defaultDecks';
import GameBoard from '../components/game/GameBoard';
import Timer from '../components/game/Timer';
import MoveCounter from '../components/game/MoveCounter';
import ScoreBoard from '../components/game/ScoreBoard';
import GameControls from '../components/game/GameControls';
import GameResultModal from '../components/game/GameResultModal';
import { calculateEarnedPoints } from '../services/scoreCalculator';
import { saveGameRecord } from '../services/statisticsStorage';

/**
 * 게임 플레이 페이지
 */
const GamePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showResult, setShowResult] = useState(false);

  const mode = (searchParams.get('mode') as GameMode) || GameMode.SINGLE;
  const difficulty = (searchParams.get('difficulty') as Difficulty) || Difficulty.EASY;
  const deckId = searchParams.get('deckId') || 'deck-animals';

  const { state, initGame, startGame, pauseGame, resumeGame, flipCard, resetGame, updateTime } = useGame();
  const { elapsed, reset: resetTimer } = useTimer(
    state.status === GameStatus.PLAYING,
    updateTime
  );

  // 게임 초기화
  useEffect(() => {
    const deck = getDeckById(deckId);
    if (!deck) {
      navigate('/');
      return;
    }

    const config: GameConfig = {
      mode,
      difficulty,
      deckId,
      timeLimit: DIFFICULTY_CONFIG[difficulty].timeLimit,
    };

    initGame(config, deck.images);
    startGame();
  }, [mode, difficulty, deckId, initGame, startGame, navigate]);

  // 게임 종료 감지 및 기록 저장
  useEffect(() => {
    if (state.status === GameStatus.FINISHED) {
      // 게임 기록 저장
      const isCompleted = state.cards.every((c) => c.state === 'matched');
      saveGameRecord({
        mode,
        difficulty,
        deckId,
        score: state.players[0]?.score || 0,
        moves: state.stats.moves,
        timeElapsed: elapsed,
        isCompleted,
      });
      setShowResult(true);
    }
  }, [state.status, state.cards, state.players, state.stats.moves, mode, difficulty, deckId, elapsed]);

  const handleRestart = () => {
    setShowResult(false);
    resetGame();
    resetTimer();
    startGame();
  };

  const handleExit = () => {
    navigate('/');
  };

  const difficultyConfig = DIFFICULTY_CONFIG[difficulty];
  const pointsEarned = state.status === GameStatus.FINISHED
    ? calculateEarnedPoints(state.players[0]?.score || 0, difficulty)
    : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 게임 헤더 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Timer
            timeElapsed={elapsed}
            timeLimit={difficultyConfig.timeLimit}
          />
          <MoveCounter moves={state.stats.moves} />
          <ScoreBoard
            players={state.players}
            currentPlayerId={state.currentPlayerId}
            mode={mode}
          />
        </div>
      </div>

      {/* 게임 컨트롤 */}
      <div className="mb-6">
        <GameControls
          status={state.status}
          onPause={pauseGame}
          onResume={resumeGame}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      </div>

      {/* 일시정지 오버레이 */}
      {state.status === GameStatus.PAUSED && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">⏸️</div>
            <h2 className="text-2xl font-bold text-gray-800">일시정지</h2>
          </div>
        </div>
      )}

      {/* 게임 보드 */}
      <GameBoard
        cards={state.cards}
        onCardClick={flipCard}
        disabled={state.status !== GameStatus.PLAYING || state.revealedCards.length >= 2}
        gridCols={difficultyConfig.gridCols}
      />

      {/* 결과 모달 */}
      <GameResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        players={state.players}
        mode={mode}
        moves={state.stats.moves}
        timeElapsed={elapsed}
        pointsEarned={pointsEarned}
        onRestart={handleRestart}
        onExit={handleExit}
      />
    </div>
  );
};

export default GamePage;
