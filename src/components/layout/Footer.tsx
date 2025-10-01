/**
 * 푸터 컴포넌트
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 저작권 정보 */}
          <div className="text-sm">
            © {currentYear} 카드 메모리 게임. All rights reserved.
          </div>

          {/* 링크 */}
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              이용약관
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              개인정보처리방침
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              문의하기
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
