import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import DragonMascot from '../../assets/images/dragon-mascot-v2.png';
import { getNotifications, markAllAsRead } from '../../api/mypageApi';

interface NotificationItem {
  notiNo?: number;
  notiContent: string;
  readYn: 'Y' | 'N';
  targetUrl: string;
}

interface NavbarProps {
  isApiOnline: boolean | null;
}

const Navbar: React.FC<NavbarProps> = ({ isApiOnline }) => {
  const history = useHistory();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [hideBadge, setHideBadge] = useState(false);
  const [userId, setUserId] = useState('');
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((notification) => notification.readYn === 'N').length;
  const hasUnread = unreadCount > 0;

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || '';
    setUserId(storedUserId);

    if (!storedUserId) return;

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data || []);
        setHideBadge(false);
      } catch (error) {
        console.error('알림을 불러오지 못했습니다.', error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const apiBaseUrl = process.env.REACT_APP_API_URL;

    if (!storedUserId || !apiBaseUrl) return;

    const eventSource = new EventSource(`${apiBaseUrl}/noti/subscribe/${storedUserId}`);

    eventSource.addEventListener('notification', (event: MessageEvent) => {
      const newNotification = JSON.parse(event.data) as NotificationItem;
      setNotifications((previous) => [newNotification, ...previous]);
      setHideBadge(false);
    });

    eventSource.onerror = () => eventSource.close();

    return () => eventSource.close();
  }, []);

  useEffect(() => {
    const closeMobileSidebarOnOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!window.matchMedia('(max-width: 991px)').matches) return;

      const sidebar = document.querySelector('.sidebar-offcanvas');
      const target = event.target as Node | null;

      if (!sidebar?.classList.contains('active') || !target) return;
      if (sidebar.contains(target) || mobileMenuButtonRef.current?.contains(target)) return;

      sidebar.classList.remove('active');
    };

    document.addEventListener('mousedown', closeMobileSidebarOnOutsideClick);
    document.addEventListener('touchstart', closeMobileSidebarOnOutsideClick);

    return () => {
      document.removeEventListener('mousedown', closeMobileSidebarOnOutsideClick);
      document.removeEventListener('touchstart', closeMobileSidebarOnOutsideClick);
    };
  }, []);

  const handleNotificationToggle = async (isOpen: boolean) => {
    if (!isOpen || !hasUnread) return;

    setHideBadge(true);

    try {
      await markAllAsRead();
      setNotifications((previous) => previous.map((notification) => ({
        ...notification,
        readYn: 'Y',
      })));
    } catch (error) {
      console.error('알림 전체 읽음 처리에 실패했습니다.', error);
    }
  };

  return (
    <nav className="navbar col-lg-12 col-12 p-lg-0 fixed-top d-flex flex-row onedragon-navbar">
      <div className="navbar-menu-wrapper d-flex align-items-center">
        <button
          className="navbar-toggler d-none d-lg-flex align-self-center"
          type="button"
          aria-label="사이드바 접기"
          onClick={() => document.body?.classList.toggle('sidebar-icon-only')}
        >
          <span className="hamburger-icon" aria-hidden="true" />
        </button>

        <div className="mobile-brand d-lg-none">
          <button
            ref={mobileMenuButtonRef}
            className="navbar-toggler mobile-menu-toggler"
            type="button"
            aria-label="메뉴 열기"
            onClick={() => document.querySelector('.sidebar-offcanvas')?.classList.toggle('active')}
          >
            <span className="hamburger-icon" aria-hidden="true" />
          </button>
          <Link className="mobile-brand-name" to="/hiringList">
            <strong>일용이네</strong>
          </Link>
        </div>

        <div className="navbar-heading d-none d-md-block">
          <span>동네에서 만나는 가장 빠른 일자리</span>
          <small>&nbsp;&nbsp;오늘도 좋은 일자리를 연결해 드릴게요.</small>
        </div>

        <div className="navbar-actions ml-auto">
          <span
            className={`service-state is-navbar is-mobile ${isApiOnline === false ? 'is-offline' : isApiOnline === null ? 'is-checking' : ''}`}
            role="status"
            aria-live="polite"
          >
            <i aria-hidden="true" /> {isApiOnline === false ? '서비스 연결 끊김' : isApiOnline === null ? '서비스 연결 확인 중' : '서비스 연결됨'}
          </span>
          <span
            className={`service-state is-navbar is-desktop ${isApiOnline === false ? 'is-offline' : isApiOnline === null ? 'is-checking' : ''}`}
            role="status"
            aria-live="polite"
          >
            <i aria-hidden="true" /> {isApiOnline === false ? '서비스 연결 끊김' : isApiOnline === null ? '서비스 연결 확인 중' : '서비스 연결됨'}
          </span>
          <Dropdown onToggle={handleNotificationToggle}>
            <Dropdown.Toggle className="notification-button toggle-arrow-hide bg-transparent">
              <i className="mdi mdi-bell-outline" aria-hidden="true" />
              {hasUnread && !hideBadge && <span className="notification-count">{unreadCount}</span>}
              <span className="sr-only">알림 열기</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="navbar-dropdown notification-menu">
              <div className="notification-menu-header">
                <div>
                  <strong>알림</strong>
                  <span>{unreadCount > 0 ? `새 알림 ${unreadCount}개` : '새로운 알림이 없습니다'}</span>
                </div>
                <i className="mdi mdi-bell-ring-outline" aria-hidden="true" />
              </div>

              <div className="notification-list">
                {notifications.length > 0 ? notifications.map((notification, index) => (
                  <Dropdown.Item
                    key={notification.notiNo || index}
                    className={`notification-item ${notification.readYn === 'N' ? 'is-unread' : ''}`}
                    onClick={() => history.push(notification.targetUrl)}
                  >
                    <span className="notification-item-icon">
                      <i className="mdi mdi-briefcase-check-outline" aria-hidden="true" />
                    </span>
                    <span>{notification.notiContent}</span>
                  </Dropdown.Item>
                )) : (
                  <div className="notification-empty">
                    <i className="mdi mdi-bell-sleep-outline" aria-hidden="true" />
                    <p>도착한 알림이 없습니다.</p>
                  </div>
                )}
              </div>
            </Dropdown.Menu>
          </Dropdown>

          <div className="navbar-profile">
            <img src={DragonMascot} alt="일용이네 용 캐릭터" />
            <div className="d-none d-sm-block">
              <strong>{userId || '게스트'}</strong>
              <span>반가워요!</span>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
