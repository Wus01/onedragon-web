import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
//import Logo from '../../assets/images/logo.svg';
import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import TestImage  from "../../assets/images/temp.jpg";

export class Login extends Component {
  render() {
    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                    <img src={TestImage } alt="" width="50px" height="50px"/>
                </div>
                <h4>일용이네</h4>
                <Form className="pt-3">
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="id" placeholder="아이디" size="lg" className="h-auto" />
                  </Form.Group>
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="password" placeholder="비밀번호" size="lg" className="h-auto" />
                  </Form.Group>
                  <div className="mt-3">
                    <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/dashboard">로그인</Link>
                  </div>
                  <div className="my-2 d-flex justify-content-between align-items-center">
                    {/*<div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input"/>
                        <i className="input-helper"></i>
                        Keep me signed in
                      </label>
                    </div>*/}
                    <a href="!#" onClick={event => event.preventDefault()} className="auth-link text-black">아이디 찾기</a>
                  </div>
                <div className="my-2 d-flex justify-content-between align-items-center">
                    <a href="!#" onClick={event => event.preventDefault()} className="auth-link text-black">비밀번호 찾기</a>
                </div>
                <div className="my-2 d-flex justify-content-between align-items-center">
                    <Link to="/register" className="text-primary">회원가입</Link>
                </div>
                  {/*<div className="mb-2">
                    <button type="button" className="btn btn-block btn-facebook auth-form-btn">
                      <i className="mdi mdi-facebook mr-2"></i>Connect using facebook
                    </button>
                  </div>*/}
                </Form>
              </div>
            </div>
          </div>
        </div>  
      </div>
    )
  }
}

export default Login
