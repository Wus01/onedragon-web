import React from 'react';
import { Link, useHistory, useLocation, withRouter } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Sidebar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { logout } = useAuth();

  const isPathActive = (path: string): boolean => location.pathname.startsWith(path);

  const closeMobileSidebar = () => {
    if (window.matchMedia('(max-width: 991px)').matches) {
      document.querySelector('.sidebar-offcanvas')?.classList.remove('active');
    }
  };

  const handleLogout = () => {
    if (!window.confirm('로그아웃 하시겠습니까?')) return;

    logout();
    window.dispatchEvent(new Event('loginStateChange'));
    history.replace('/login');
  };

  const menuItems = [
    { path: '/hiringList', label: '채용 공고', icon: 'mdi-briefcase-search-outline' },
    { path: '/mypageHome', label: '마이페이지', icon: 'mdi-account-circle-outline' },
    { path: '/crrHstrCreate', label: '경력 등록', icon: 'mdi-file-document-edit-outline' },
  ];

  return (
    <nav className="sidebar sidebar-offcanvas onedragon-sidebar" id="sidebar" aria-label="주요 메뉴">
      <div className="sidebar-branding">
        <Link to="/hiringList" className="sidebar-brand-link" aria-label="일용이네 채용 공고로 이동" onClick={closeMobileSidebar}>
          <span className="sidebar-brand-mark">
            <i className="mdi mdi-briefcase-check-outline" aria-hidden="true" />
          </span>
          <span className="sidebar-brand-copy">
            <strong>일용이네</strong>
            <small>동네 일자리 매칭</small>
          </span>
        </Link>
      </div>

      <div className="sidebar-section-label">WORKSPACE</div>
      <ul className="nav onedragon-nav">
        {menuItems.map((item) => (
          <li key={item.path} className={isPathActive(item.path) ? 'nav-item active' : 'nav-item'}>
            <Link className="nav-link" to={item.path} onClick={closeMobileSidebar}>
              <i className={`mdi ${item.icon} menu-icon`} aria-hidden="true" />
              <span className="menu-title">{item.label}</span>
              <i className="mdi mdi-chevron-right menu-chevron" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-spacer" />

      <div className="sidebar-guide-card">
        <span className="sidebar-guide-icon">
          <i className="mdi mdi-lightning-bolt-outline" aria-hidden="true" />
        </span>
        <strong>빠르게 일할 곳을 찾나요?</strong>
        <p>우리 동네 최신 공고를 바로 확인해 보세요.</p>
        <Link to="/hiringList" onClick={closeMobileSidebar}>공고 둘러보기</Link>
      </div>

      <button type="button" className="sidebar-logout" onClick={handleLogout}>
        <i className="mdi mdi-logout-variant" aria-hidden="true" />
        <span>로그아웃</span>
      </button>
    </nav>
  );
};

export default withRouter(Sidebar);
