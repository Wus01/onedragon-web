import React, {Component, useEffect, useState} from 'react';
import {Link, useHistory, useLocation, withRouter} from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import logo from "../../assets/images/logo.svg";
import logoMini from "../../assets/images/logo-mini.svg";
import face8 from "../../assets/images/faces/face8.jpg";
import {useAuth} from "./AuthContext";

interface MenuState {
  [key: string]: any; // toggleMenuState에서 동적 키 접근(this.state[menuState])을 허용하기 위함
}

const dropdownPaths = [
  {path:'/apps', state: 'appsMenuOpen'},
  {path:'/basic-ui', state: 'basicUiMenuOpen'},
  {path:'/form-elements', state: 'formElementsMenuOpen'},
  {path:'/tables', state: 'tablesMenuOpen'},
  {path:'/icons', state: 'iconsMenuOpen'},
  {path:'/charts', state: 'chartsMenuOpen'},
  {path:'/user-pages', state: 'userPagesMenuOpen'},
  {path:'/error-pages', state: 'errorPagesMenuOpen'},
];

const Sidebar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { isLoggedIn, logout} = useAuth();
  const [menuState, setMenuState] = useState<MenuState>({});

  // 로그인 상태 감지 (이벤트 리스너) 및 경로 변경 시 사이드바 닫기
  useEffect(()=>{
    // 사이드바 아이콘 모드 호버 이벤트 등록
    const body = document.querySelector('body');
    const navItems = document.querySelectorAll('.sidebar .nav-item');

    const handleMouseOver = (el: Element)=>{
      if(body?.classList.contains('sidebar-icon-only')){
        el.classList.add('hover-open');
      }
    };

    const handleMouseOut = (el: Element)=>{
      if(body?.classList.contains('sidebar-icon-only')){
        el.classList.remove('hover-open');
      }
    };

    const cleanupFns: Array<() => void> = [];

    navItems.forEach((el)=>{
      const onOver = () => handleMouseOver(el);
      const onOut = () => handleMouseOut(el);

      el.addEventListener('mouseover', onOver);
      el.addEventListener('mouseout', onOut);

      cleanupFns.push(()=>{
        el.removeEventListener('mouseover', onOver);
        el.removeEventListener('mouseout', onOut);
      });
    });

    // cleanup: 컴포넌트 언마운트 시 리스너 제거
    return () => {
      cleanupFns.forEach((cleanup)=> cleanup());
    };
  },[]);

  // 라우트(URL) 변경 시 모바일 사이드바 닫기 처리
  useEffect(() => {
    // 모바일 사이드바 닫기
    document.querySelector('#sidebar')?.classList.remove('active');

    // 현재 url 경로에 맞는 드롭다운 메뉴 찾아서 열어주기
    const initialMenuState: MenuState={};
    dropdownPaths.forEach((obj)=>{
      if(isPathActive((obj.path))){
        initialMenuState[obj.state] = true;
      }
    });

    // 펼쳐진 서브메뉴 모두 접기 (state 초기화)
    setMenuState(initialMenuState);
  }, [location.pathname]); // url 경로가 바뀔 때마다 실행됨

  // 로그아웃 핸들러
  const handleLogout = () => {
    if(window.confirm("로그아웃 하시겠습니까?")){
      localStorage.removeItem("userId");
      localStorage.removeItem('token');

      // 다른 컴포넌트에도 로그인 상태 변경 알림
      window.dispatchEvent(new Event('loginStateChange'));

      alert("로그아웃 되었습니다.");
      history.push('/');
    }
  };

  // 메뉴 아코디언 토글 핸들러
  const toggleMenuState = (menuName: string)=> {
    setMenuState((prevState)=> {
      //이미 열려있던 메뉴면 닫기
      if(prevState[menuName]){
        return { ...prevState, [menuName]: false};
      }
    })
      // 다른 모든 메뉴는 닫고, 클릭한 메뉴만 열기
      return {
        [menuName]:true,
      };
    };

  // 현재 url 활성화 체크 함수
  const isPathActive = (path: string): boolean => {
    return location.pathname.startsWith(path);
  };

  return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="text-center sidebar-brand-wrapper d-flex align-items-center">
          <a className="sidebar-brand brand-logo" href="index.html"><img src={logo} alt="logo" /></a>
          <a className="sidebar-brand brand-logo-mini pt-3" href="index.html"><img src={logoMini} alt="logo" /></a>
        </div>
        <ul className="nav">
          <li className="nav-item nav-profile not-navigation-link">
            <div className="nav-link">
              <Dropdown>
                <Dropdown.Toggle className="nav-link user-switch-dropdown-toggler p-0 toggle-arrow-hide bg-transparent border-0 w-100">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="profile-image">
                    <img className="img-xs rounded-circle" src={ face8} alt="profile" />
                      <div className="dot-indicator bg-success"></div>
                    </div>
                    <div className="text-wrapper">
                      <p className="profile-name">Allen Moreno</p>
                      <p className="designation">Premium user</p>
                    </div>
                    
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="preview-list navbar-dropdown">
                  <Dropdown.Item className="dropdown-item p-0 preview-item d-flex align-items-center" href="!#" onClick={evt =>evt.preventDefault()}>
                    <div className="d-flex">
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center">
                        <i className="mdi mdi-bookmark-plus-outline mr-0"></i>
                      </div>
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center border-left border-right">
                        <i className="mdi mdi-account-outline mr-0"></i>
                      </div>
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center">
                        <i className="mdi mdi-alarm-check mr-0"></i>
                      </div>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                    <Trans>Manage Accounts</Trans>
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                    <Trans>Change Password</Trans>
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                    <Trans>Check Inbox</Trans>
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center text-small" onClick={evt =>evt.preventDefault()}>
                    <Trans>Sign Out</Trans>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </li>
          {isLoggedIn ? (
          <li className= 'nav-item active'  onClick={handleLogout}>
            <Link className="nav-link" to="#">
              <i className="mdi mdi-television menu-icon"></i>
              <span className="menu-title"><Trans>로그아웃</Trans></span>
            </Link>
          </li>
          ) : (
              <li className={ isPathActive('/login') ? 'nav-item active' : 'nav-item' }>
                <Link className="nav-link" to='/login'>
                  <i className="mdi mdi-television menu-icon"></i>
                  <span className="menu-title"><Trans>로그인</Trans></span>
                </Link>
              </li>
          )}
            <li className={ isPathActive('/mypageHome') ? 'nav-item active' : 'nav-item' }>
                <Link className="nav-link" to='/mypageHome'>
                    <i className="mdi mdi-television menu-icon"></i>
                    <span className="menu-title"><Trans>마이 페이지</Trans></span>
                </Link>
            </li>
            <li className={ isPathActive('/hiringList') ? 'nav-item active' : 'nav-item' }>
                <Link className="nav-link" to='/hiringList'>
                    <i className="mdi mdi-television menu-icon"></i>
                        <span className="menu-title"><Trans>공고 리스트</Trans></span>
                </Link>
            </li>
          <li className={ isPathActive('/CrrHstrCreate') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to='/CrrHstrCreate'>
              <i className="mdi mdi-television menu-icon"></i>
              <span className="menu-title"><Trans>마이페이지/경력등록</Trans></span>
            </Link>
          </li>
          <li className={ isPathActive('/dashboard') ? 'nav-item active' : 'nav-item' }>
            <Link className="nav-link" to="/dashboard">
              <i className="mdi mdi-television menu-icon"></i>
              <span className="menu-title"><Trans>Dashboard</Trans></span>
            </Link>
          </li>
          <li className={ isPathActive('/basic-ui') ? 'nav-item active' : 'nav-item' }>
            <div className={ menuState.basicUiMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => toggleMenuState('basicUiMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-crosshairs-gps menu-icon"></i>
              <span className="menu-title"><Trans>Basic UI Elements</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ menuState.basicUiMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ isPathActive('/basic-ui/buttons') ? 'nav-link active' : 'nav-link' } to="/basic-ui/buttons"><Trans>Buttons</Trans></Link></li>
                <li className="nav-item"> <Link className={ isPathActive('/basic-ui/dropdowns') ? 'nav-link active' : 'nav-link' } to="/basic-ui/dropdowns"><Trans>Dropdowns</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ isPathActive('/form-elements') ? 'nav-item active' : 'nav-item' }>
            <div className={ menuState.formElementsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => toggleMenuState('formElementsMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              <span className="menu-title"><Trans>Form Elements</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ menuState.formElementsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ isPathActive('/form-elements/basic-elements') ? 'nav-link active' : 'nav-link' } to="/form-elements/basic-elements"><Trans>Basic Elements</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ isPathActive('/tables') ? 'nav-item active' : 'nav-item' }>
            <div className={ menuState.tablesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => toggleMenuState('tablesMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-table-large menu-icon"></i>
              <span className="menu-title"><Trans>Tables</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ menuState.tablesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ isPathActive('/tables/basic-table') ? 'nav-link active' : 'nav-link' } to="/tables/basic-table"><Trans>Basic Table</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ isPathActive('/icons') ? 'nav-item active' : 'nav-item' }>
            <div className={ menuState.iconsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => toggleMenuState('iconsMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-account-box-outline menu-icon"></i>
              <span className="menu-title"><Trans>Icons</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ menuState.iconsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ isPathActive('/icons/mdi') ? 'nav-link active' : 'nav-link' } to="/icons/mdi">Material</Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ isPathActive('/charts') ? 'nav-item active' : 'nav-item' }>
            <div className={ menuState.chartsMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => toggleMenuState('chartsMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-chart-line menu-icon"></i>
              <span className="menu-title"><Trans>Charts</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ menuState.chartsMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ isPathActive('/charts/chart-js') ? 'nav-link active' : 'nav-link' } to="/charts/chart-js">Chart Js</Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ isPathActive('/user-pages') ? 'nav-item active' : 'nav-item' }>
            <div className={ menuState.userPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => toggleMenuState('userPagesMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-lock-outline menu-icon"></i>
              <span className="menu-title"><Trans>User Pages</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ menuState.userPagesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ isPathActive('/user-pages/login-1') ? 'nav-link active' : 'nav-link' } to="/user-pages/login-1"><Trans>Login</Trans></Link></li>
                <li className="nav-item"> <Link className={ isPathActive('/user-pages/register-1') ? 'nav-link active' : 'nav-link' } to="/user-pages/register-1"><Trans>Register</Trans></Link></li>
              </ul>
            </Collapse>
          </li>
          <li className={ isPathActive('/error-pages') ? 'nav-item active' : 'nav-item' }>
            <div className={ menuState.errorPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link' } onClick={ () => toggleMenuState('errorPagesMenuOpen') } data-toggle="collapse">
              <i className="mdi mdi-information-outline menu-icon"></i>
              <span className="menu-title"><Trans>Error Pages</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={ menuState.errorPagesMenuOpen }>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <Link className={ isPathActive('/error-pages/error-404') ? 'nav-link active' : 'nav-link' } to="/error-pages/error-404">404</Link></li>
                <li className="nav-item"> <Link className={ isPathActive('/error-pages/error-500') ? 'nav-link active' : 'nav-link' } to="/error-pages/error-500">500</Link></li>
              </ul>
            </Collapse>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="http://www.bootstrapdash.com/demo/star-admin-free/react/documentation/documentation.html" rel="noopener noreferrer" target="_blank">
              <i className="mdi mdi-file-outline menu-icon"></i>
              <span className="menu-title"><Trans>Documentation</Trans></span>
            </a>
          </li>
        </ul>
      </nav>
    );
};
export default withRouter(Sidebar);