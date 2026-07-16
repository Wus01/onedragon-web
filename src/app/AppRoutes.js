import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';
import Sidebar from '../app/shared/Sidebar';
import HiringList from './tables/HiringList';


const HiringDetail = lazy(() => import('./tables/HiringDetail'));
const Dashboard = lazy(() => import('./dashboard/Dashboard'));

const Buttons = lazy(() => import('./basic-ui/Buttons'));
const Dropdowns = lazy(() => import('./basic-ui/Dropdowns'));

const BasicElements = lazy(() => import('./form-elements/BasicElements'));

const BasicTable = lazy(() => import('./tables/BasicTable'));

const Mdi = lazy(() => import('./icons/Mdi'));

// const ChartJs = lazy(() => import('./charts/ChartJs'));

// const Error404 = lazy(() => import('./error-pages/Error404'));
// const Error500 = lazy(() => import('./error-pages/Error500'));

const Login = lazy(() => import('./user-pages/Login'));
const Register1 = lazy(() => import('./user-pages/Register'));
const FindIdPw = lazy(() => import('./user-pages/FindIdPw'));

const ApplyDetail = lazy(() => import('./tables/ApplyDetail'));
const CrrHstrCreate = lazy(() => import('./form-elements/CrrHstrCreate'));
const StoreSearchPopup = lazy(() => import('./form-elements/StoreSearchPopup'));
const StoreInfoList = lazy(() => import('./storeInfo/StoreInfoList'));
const MypageHome = lazy(() => import('./form-elements/MypageHome'));






const ApplyList = lazy(() => import('./tables/ApplyList'));
const isLoggedIn = !!localStorage.getItem("user_id");


class AppRoutes extends Component {

  render () {
    return (
      <Suspense fallback={<Spinner/>}>
      {/* 로그인 상태일 때만 메뉴바를 렌더링 */}
      {isLoggedIn && <Sidebar />}
        <Switch>
          <Route exact path="/dashboard" component={ Dashboard } />

          <Route path="/basic-ui/buttons" component={ Buttons } />
          <Route path="/basic-ui/dropdowns" component={ Dropdowns } />

          <Route path="/form-Elements/basic-elements" component={ BasicElements } />

          <Route path="/tables/basic-table" component={ BasicTable } />

          <Route path="/icons/mdi" component={ Mdi } />

          {/* <Route path="/charts/chart-js" component={ ChartJs } /> */}


          <Route path="/login" component={ Login } />
          <Route path="/register" component={ Register1 } />
          <Route path="/findIdPw" component={ FindIdPw } />
          <Route path="/apply/:id" component={ ApplyDetail } />
          <Route path="/hiring/:id" component={ HiringDetail } />
          {/* <Route path="/error-pages/error-404" component={ Error404 } />
          <Route path="/error-pages/error-500" component={ Error500 } /> */}
          <Route path='/storelist' component={ StoreInfoList } />
          {/*재직이력 조회용 http://localhost:3000/CrrHstrCreate/1/7 */}
          <Route path='/crrHstrCreate/:crrHstrNo' component={ CrrHstrCreate } />
          {/*재직이력 등록용*/}
          <Route path='/crrHstrCreate' component={ CrrHstrCreate } />
          {/*마이페이지*/}
          <Route path='/MypageHome' component={ MypageHome } />
          {/*지점정보 검색*/}
          <Route path="/StoreSearchPopup" component={ StoreSearchPopup } />
          {/*내 공고리스트*/}
          <Route path='/hiringList' component={ HiringList } />

          <Redirect to="/login" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;