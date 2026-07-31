import React, {Component, useEffect, useState} from 'react';
import { Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import logoMini from "../../assets/images/logo-mini.svg";
import TestImage from "../../assets/images/temp.jpg";
import {getNotifications, markAllAsRead} from "../../api/mypageApi";
import {useHistory} from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const history = useHistory();
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [hideBadge, setHideBadge] = useState(false);

  const hasUnread = notifications.some(noti=>noti.readYn === 'N');

  // 종(알림) 아이콘 클릭 시
  const handleBellClick = async () => {
    // setIsNotiOpen(true);

      try {
        // const response = await axios.post(`http://localhost:8080/api/noti/markAllAsRead?userId=${userId}`);

        await markAllAsRead();
          // 화면에 있는 데이터 상태 모두 readYn='Y'로 변경하여 안읽음 표시 제거
          // setNotifications(prev=>prev.map(noti=>({...noti, readYn:'Y'})));
      } catch(error) {
        console.error("알림 전체 읽음 처리 에러: ", error);
      }

  }
  // 알림 단 건 클릭 시
  const handleNotificationsClick = async () => {

  }
  const toggleOffcanvas = (): void => {
    document.querySelector('.sidebar-offcanvas')?.classList.toggle('active');
  };

  const toggleRightSidebar = (): void => {
    document.querySelector('.right-sidebar')?.classList.toggle('open');
  };

  const handlePreventDefault = (evt: React.MouseEvent<any>): void=>{
    evt.preventDefault();
  };

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if(userId){
      setUserId(userId);
    }

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
        console.log("알림목록 가져오기 성공: ", data);

        setHideBadge(false);

      }catch(error) {
        console.error("알림을 불러오는데 실패했습니다.", error);
      }
    }
    fetchNotifications();
  }, []);


  useEffect(() => {
    console.log("진입");
    const userId = localStorage.getItem("userId");

    // 로그인이 안 되어 있다면 SSE 연결을 할 필요가 없으니 중단
    if (!userId) return;

    const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/noti/subscribe/${userId}`);
    eventSource.addEventListener('connect', (event) => {
      console.log("✅ 삐빅! 서버와 연결되었습니다: ", event.data);
    });
    // 서버에서 "notification" 이라는 이름으로 보낸 이벤트를 수신!
    eventSource.addEventListener('notification', (event) => {
      const newNoti = JSON.parse(event.data);
      console.log("🔥 실시간 새 알림 도착: ", newNoti);

      // 중요: 기존 알림 목록 맨 앞에 방금 온 새 알림을 쏙 추가해줍니다.
      setNotifications((prevNotiList) => [newNoti, ...prevNotiList]);

      // 알림이 왔으니 빨간 점(뱃지) 켜주기
      setHideBadge(false);
    });

    eventSource.onerror = (error) => {
      console.error("SSE 연결 에러:", error);
      eventSource.close(); // 에러 시 일단 연결 닫기 (무한 재연결 방지)
    };

    // 🧹 [매우 중요] 컴포넌트가 언마운트될 때(다른 페이지로 이동 등)
    // 불필요한 연결이 계속 남아있지 않도록 닫아줍니다.
    return () => {
      eventSource.close();
    };
  }, []); // 괄호 안을 비워두면 처음 렌더링될 때 한 번만 연결합니다.

  const unreadNotiCnt = notifications.filter(noti => noti.readYn === 'N').length;

  // 알림 단 건 클릭 시
  const handleNotiClick = (url) => {
    history.push(url);
  }

    return (
      <nav className="navbar col-lg-12 col-12 p-lg-0 fixed-top d-flex flex-row">
        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-between">
        <a className="navbar-brand brand-logo-mini align-self-center d-lg-none" href="#" onClick={handlePreventDefault}><img src={logoMini} alt="logo" /></a>
          <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={ () => document.body?.classList.toggle('sidebar-icon-only') }>
            <i className="mdi mdi-menu"></i>
          </button>
          <ul className="navbar-nav navbar-nav-left header-links align-self-center">
            <li className="nav-item font-weight-semibold d-none d-md-flex text-nowrap">문의사항은 방배역으로</li>
            <li className="nav-item dropdown language-dropdown">
            <Dropdown>
                {/*<Dropdown.Toggle className="nav-link count-indicator p-0 toggle-arrow-hide bg-transparent">*/}
                {/*  <div className="d-inline-flex mr-0 mr-md-3">*/}
                {/*    <div className="flag-icon-holder">*/}
                {/*      <i className="flag-icon flag-icon-us"></i>*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*  <span className="profile-text font-weight-medium d-none d-md-block">English</span>*/}
                {/*</Dropdown.Toggle>*/}
                <Dropdown.Menu className="navbar-dropdown preview-list">
                  <Dropdown.Item className="dropdown-item  d-flex align-items-center" href="#" onClick={handlePreventDefault}>
                    <div className="flag-icon-holder">
                      <i className="flag-icon flag-icon-us"></i>
                    </div>English
                  </Dropdown.Item>
                  <div className="dropdown-divider"></div>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center" href="#" onClick={handlePreventDefault}>
                    <div className="flag-icon-holder">
                      <i className="flag-icon flag-icon-fr"></i>
                    </div>French
                  </Dropdown.Item>
                  <div className="dropdown-divider"></div>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center" href="#" onClick={handlePreventDefault}>
                    <div className="flag-icon-holder">
                      <i className="flag-icon flag-icon-ae"></i>
                    </div>Arabic
                  </Dropdown.Item>
                  <div className="dropdown-divider"></div>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center" href="#" onClick={handlePreventDefault}>
                    <div className="flag-icon-holder">
                      <i className="flag-icon flag-icon-ru"></i>
                    </div>Russian
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
          {/*<form className="ml-auto search-form d-none d-md-block" action="#">*/}
          {/*  <div className="form-group">*/}
          {/*    <input type="search" className="form-control" placeholder="Search Here" />*/}
          {/*  </div>*/}
          {/*</form>*/}
          <ul className="navbar-nav navbar-nav-right" style={{ width: '100%'}}>
            <li className="nav-item nav-profile border-0 d-flex align-items-center ml-auto pr-0"
                style={{ paddingRight: '0', marginRight: '0' }}
            >
              <Dropdown onToggle={(isNotiOpen)=>{
                if(isNotiOpen) {
                  // 알림 창 열렸을 때
                  if (hasUnread) {
                    setHideBadge(true);
                    handleBellClick();
                  }
                } else {
                  // 알림 창 닫았을 때 : 닫는 순간 readYn = 'N'으로 변경
                  if(hasUnread) {
                    setNotifications(prev => prev.map(noti => ({...noti, readYn: 'Y'})));
                  }
                }
              }}>
              <Dropdown.Toggle className="nav-link count-indicator p-0 toggle-arrow-hide bg-transparent">
                <i className="mdi mdi-bell-outline text-muted" style={{ fontSize: '1.5rem' }}></i>
                {/* 안 읽은 알림이 있을 때만 뱃지 표시 */}
                {(hasUnread && !hideBadge) && <span className="count bg-success">{unreadNotiCnt}</span>}
              </Dropdown.Toggle>

              <Dropdown.Menu className="navbar-dropdown preview-list">
                {/* 드롭다운 헤더 */}
                <Dropdown.Item className="dropdown-item py-3 d-flex align-items-center" >
                  <p className="mb-0 font-weight-medium float-left">
                    📢{unreadNotiCnt > 0 ? `${unreadNotiCnt}개의 새 알림이 있습니다` : "새로운 알림이 없습니다"}
                  </p>
                  {/*<span className="badge badge-pill badge-primary float-right">전체 보기</span>*/}
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                {/* 알림 리스트 맵핑 */}
                {notifications && notifications.length > 0? (
                    notifications.map((noti, index) => (
                        <React.Fragment key={index}>
                          <Dropdown.Item
                              className="dropdown-item preview-item d-flex align-items-center"
                              onClick={()=> handleNotiClick(noti.targetUrl)}
                          >
                            <div className="preview-item-content py-2 d-flex align-items-center w-100">
                              <i className={`mdi mdi-alert ${noti.readYn === 'N' ? 'text-primary' : 'text-secondary'} mr-2`}
                                  style={{ fontSize: '1.2rem' }}
                              ></i>
                              {/* 2. 알림 메시지 내용 */}
                              <h6 className={`preview-subject font-weight-normal mb-0 ${noti.readYn === 'N' ? 'text-dark' : 'text-muted'}`}
                              >{noti.notiContent}
                              </h6>
                              {noti.readYn === 'N' && (
                                  <span className="badge badge-pill badge-danger ml-2" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                                    New
                                  </span>
                              )}
                            </div>
                          </Dropdown.Item>
                          <div className="dropdown-divider"></div>
                        </React.Fragment>
                    ))
                ) : (
                    <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center" onClick={handlePreventDefault}>
                      <div className="preview-item-content py-2 text-center w-100">
                        <p className="font-weight-light small-text mb-0 text-muted">알림 내역이 없습니다.</p>
                      </div>
                    </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            {/*</li>*/}
            {/*<li className="nav-item  nav-profile border-0">*/}
              {/*<li className="nav-item font-weight-semibold" style={{marginRight:'5px'}}>{userId} 님 환영해👋</li>*/}
              <div className="font-weight-semibold mr-2">
                {userId} 님 환영해👋
              </div>
              <Dropdown>
                {/*<Dropdown.Toggle className="nav-link count-indicator bg-transparent">*/}
                  <img className="img-xs rounded-circle" src={TestImage} alt="Profile" />
                {/*</Dropdown.Toggle>*/}

                {/*<Dropdown.Menu className="preview-list navbar-dropdown pb-3">*/}
                {/*  <Dropdown.Item className="dropdown-item p-0 preview-item d-flex align-items-center border-bottom" href="#" onClick={handlePreventDefault}>*/}
                {/*    <div className="d-flex">*/}
                {/*      <div className="py-3 px-4 d-flex align-items-center justify-content-center">*/}
                {/*        <i className="mdi mdi-bookmark-plus-outline mr-0"></i>*/}
                {/*      </div>*/}
                {/*      <div className="py-3 px-4 d-flex align-items-center justify-content-center border-left border-right">*/}
                {/*        <i className="mdi mdi-account-outline mr-0"></i>*/}
                {/*      </div>*/}
                {/*      <div className="py-3 px-4 d-flex align-items-center justify-content-center">*/}
                {/*        <i className="mdi mdi-alarm-check mr-0"></i>*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*  </Dropdown.Item>*/}
                {/*  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center border-0 mt-2" onClick={evt=>evt.preventDefault()}>*/}
                {/*    <Trans>Manage Accounts</Trans>*/}
                {/*  </Dropdown.Item>*/}
                {/*  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center border-0" onClick={handlePreventDefault}>*/}
                {/*    <Trans>Change Password</Trans>*/}
                {/*  </Dropdown.Item>*/}
                {/*  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center border-0" onClick={handlePreventDefault}>*/}
                {/*    <Trans>Check Inbox</Trans>*/}
                {/*  </Dropdown.Item>*/}
                {/*  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center border-0" onClick={handlePreventDefault}>*/}
                {/*    <Trans>Sign Out</Trans>*/}
                {/*  </Dropdown.Item>*/}
                {/*</Dropdown.Menu>*/}
              </Dropdown>
            </li>
          </ul>
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={toggleOffcanvas}>
            <span className="mdi mdi-menu"></span>
          </button>
        </div>
      </nav>
    );
  // }
}

export default Navbar;
