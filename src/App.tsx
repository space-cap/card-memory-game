import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './store';
import MainLayout from './components/layout/MainLayout';
import './App.css';

// 코드 스플리팅: 라우트별 lazy loading
const HomePage = lazy(() => import('./pages/HomePage'));
const GamePage = lazy(() => import('./pages/GamePage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
const DeckCreatorPage = lazy(() => import('./pages/DeckCreatorPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// 로딩 컴포넌트
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="text-6xl mb-4 animate-bounce">🎴</div>
      <div className="text-xl font-semibold text-gray-600">로딩 중...</div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <MainLayout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/deck-creator" element={<DeckCreatorPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
