import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './store';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import StatisticsPage from './pages/StatisticsPage';
import ShopPage from './pages/ShopPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </MainLayout>
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
