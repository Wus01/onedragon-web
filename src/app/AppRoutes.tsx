import React, { Component,Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from '../app/shared/Spinner';
import Sidebar from './shared/Sidebar';
import HiringList from './tables/HiringList';
import ErrorPage from "./common/ErrorPage";
import GlobalAxiosInterceptor from "./common/GlobalAxiosInterceptor";
// import Register1 from './user-pages/Register';

const HiringDetail = lazy(() => import('./tables/HiringDetail'));
const Dashboard = lazy(() => import('./dashboard/Dashboard'));

const Buttons = lazy(() => import('./basic-ui/Buttons'));
const Dropdowns = lazy(() => import('./basic-ui/Dropdowns'));

const BasicElements = lazy(() => import('./form-elements/BasicElements'));

const BasicTable = lazy(() => import('./tables/BasicTable'));

const Mdi = lazy(() => import('./icons/Mdi'));

// const ChartJs = lazy(() => import('./charts/ChartJs'));

const Login = lazy(() => import('./user-pages/Login'));
const Register1 = lazy(() => import('./user-pages/Register'));
const FindIdPw = lazy(() => import('./user-pages/FindIdPw'));

const ApplyDetail = lazy(() => import('./tables/ApplyDetail'));
const CrrHstrCreate = lazy(() => import('./form-elements/CrrHstrCreate'));
const StoreSearchPopup = lazy(() => import('./form-elements/StoreSearchPopup'));
const StoreInfoList = lazy(() => import('./storeInfo/StoreInfoList'));
const MypageHome = lazy(() => import('./form-elements/MypageHome'));
const ApplyList = lazy(() => import('./tables/ApplyList'));


const AppRoutes: React.FC = () => {
    const isLoggedIn = !!localStorage.getItem("user_id");

    return (
        <GlobalAxiosInterceptor>
          <Suspense fallback={<Spinner/>}>
          {/* 로그인 상태일 때만 메뉴바를 렌더링 */}
          {isLoggedIn && <Sidebar />}
            <Switch>
              <Route exact path="/">
                <Redirect to="/login" />
              </Route>
              <Route path="/dashboard" component={ Dashboard } />

              <Route path="/basic-ui/buttons" component={ Buttons } />
              <Route path="/basic-ui/dropdowns" component={ Dropdowns } />
              <Route path="/form-Elements/basic-elements" component={ BasicElements } />
              <Route path="/tables/basic-table" component={ BasicTable } />
              <Route path="/icons/mdi" component={ Mdi } />

              <Route path="/login" component={ Login } />
              <Route path="/register" component={ Register1 } />
              <Route path="/findIdPw" component={ FindIdPw } />
              <Route path="/apply/:id" component={ ApplyDetail } />
              <Route path="/hiring/:id" component={ HiringDetail } />

              <Route path='/storelist' component={ StoreInfoList } />
              {/*재직이력 조회용 http://localhost:3000/CrrHstrCreate/1/7 */}
              <Route path='/crrHstrCreate/:crrHstrNo' component={ CrrHstrCreate } />
              {/*재직이력 등록용*/}
              <Route path='/crrHstrCreate' component={ CrrHstrCreate } />
              {/*마이페이지*/}
              <Route path='/mypageHome' component={ MypageHome } />
              {/*지점정보 검색*/}
              <Route path="/storeSearchPopup" component={ StoreSearchPopup } />
              {/*내 공고리스트*/}
              <Route path='/hiringList' component={ HiringList } />
              {/* 에러페이지 */}
              <Route path="/error" component={ ErrorPage } />
              <Route path="/*" component={ ErrorPage } />

            </Switch>
          </Suspense>
        </GlobalAxiosInterceptor>
    );
}

export default AppRoutes;