import { Link } from 'react-router-dom';

/**
 * 헤더 컴포넌트
 */
const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <Link to="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
            🎴 메모리 게임
          </Link>

          {/* 네비게이션 */}
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="hover:text-blue-200 transition-colors font-medium"
            >
              홈
            </Link>
            <Link
              to="/shop"
              className="hover:text-blue-200 transition-colors font-medium"
            >
              덱 샵
            </Link>
            <Link
              to="/profile"
              className="hover:text-blue-200 transition-colors font-medium"
            >
              프로필
            </Link>
            <Link
              to="/settings"
              className="hover:text-blue-200 transition-colors font-medium"
            >
              설정
            </Link>
          </nav>

          {/* 포인트 표시 (추후 구현) */}
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
            <span className="text-yellow-300">💎</span>
            <span className="font-bold">0</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
