import React, {Component, useEffect} from 'react';
import {useLocation, withRouter} from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import SettingsPanel from './shared/SettingsPanel';
import Footer from './shared/Footer';
import {useTranslation, withTranslation} from "react-i18next";

// class App extends Component {
const App: React.FC = () => {
  // 1. 현재 라우트(URL) 정보 가져오기
  const location = useLocation();

  const { i18n } = useTranslation();

  // 1. 풀페이지 레이아웃 경로 목록
  const fullPageLayoutRoutes: string[] = [
    '/login',
    '/register',
    '/user-pages/register-1',
    '/user-pages/register-2',
    '/user-pages/lockscreen',
    '/error-pages/error-404',
    '/error-pages/error-500',
    '/general-pages/landing-page',
    '/findIdPw',
    '/storeSearchPopup'
  ];

  // 2. 현재 경로가 풀페이지 경로인지 체크 (동적 파라미터 :id 고려)
  const isFullPageLayout: boolean = fullPageLayoutRoutes.some((path) => {
    if (path.includes(':id')) {
      const prefix = path.split('/:id')[0];
      return location.pathname.startsWith(prefix);
    }
    return location.pathname === path;
  });

  // 3. 기존 onRouteChanged() 로직을 useEffect로 대체 (경로 변경 시 실행)
  useEffect(() => {
    const body = document.querySelector('body');

    // RTL 및 언어 설정
    if (location.pathname === '/layout/RtlLayout') {
      body?.classList.add('rtl');
      i18n.changeLanguage('ar');
    } else {
      body?.classList.remove('rtl');
      i18n.changeLanguage('en');
    }

    // 페이지 이동 시 최상단으로 스크롤 이동
    window.scrollTo(0, 0);

    // page-body-wrapper 클래스 조작
    const pageBodyWrapper = document.querySelector('.page-body-wrapper');
    if (pageBodyWrapper) {
      if (isFullPageLayout) {
        pageBodyWrapper.classList.add('full-page-wrapper');
      } else {
        pageBodyWrapper.classList.remove('full-page-wrapper');
      }
    }
  }, [location.pathname, isFullPageLayout, i18n]);

  return (
      <div className="container-scroller">
        {/* 풀페이지가 아닐 때만 Navbar 렌더링 */}
        {!isFullPageLayout && <Navbar />}
        <div className="container-fluid page-body-wrapper">
          {/* 풀페이지가 아닐 때만 Sidebar 렌더링 */}
          {!isFullPageLayout && <Sidebar />}
          <div className="main-panel">
            <div className="content-wrapper">
              <AppRoutes/>
              {/* 풀페이지가 아닐 때만 SettingsPanel 렌더링 */}
              {!isFullPageLayout && <SettingsPanel />}
              {/*{ SettingsPanelComponent }*/}
            </div>
            {/* 풀페이지가 아닐 때만 Footer 렌더링 */}
            {!isFullPageLayout && <Footer />}
            {/*{ footerComponent }*/}
          </div>
        </div>
      </div>
    );
}

export default App;