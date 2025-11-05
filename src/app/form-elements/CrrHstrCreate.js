import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export class CrrHstrCreate extends Component {
    state = {
        startDate: null
    };



    componentDidMount() {
        bsCustomFileInput.init()
    }

    render() {
        return (
            <div>
                <div className="page-header">
                    <h3 className="page-title"> 재직등록관리 </h3>
                </div>
                <div className="row">


                    <div className="col-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                {/*<p className="card-description"> Basic form elements </p>*/}
                                <form className="forms-sample">
                                    <Form.Group as="div" className="row align-items-center mb-3">
                                        <label htmlFor="exampleInputName1" className="col-sm-2 col-form-label">
                                            지점
                                        </label>
                                        <div className="col-sm-3">
                                            <Form.Control
                                                type="text"
                                                className="form-control"
                                                id="exampleInputName1"
                                                placeholder="지점 선택"
                                            />
                                        </div>
                                    </Form.Group>
                                    <Form.Group as="div" className="row align-items-center mb-3">
                                        {/* 라벨 */}
                                        <label htmlFor="exampleInputDate" className="col-sm-2 col-form-label">
                                            근무 기간
                                        </label>

                                        {/* 날짜 입력 필드 */}
                                        <div className="col-sm-10">
                                            <div className="d-flex align-items-center">
                                                <DatePicker
                                                    selected={this.state.startDate}
                                                    onChange={(date) => this.setState({ startDate: date })}
                                                    className="form-control"
                                                    placeholderText="시작일"
                                                    dateFormat="yyyy-MM-dd"
                                                />
                                                <span className="mx-2">~</span>
                                                <DatePicker
                                                    selected={this.state.endDate}
                                                    onChange={(date) => this.setState({ endDate: date })}
                                                    className="form-control"
                                                    placeholderText="종료일"
                                                    dateFormat="yyyy-MM-dd"
                                                />
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group as="div" className="row align-items-center mb-3">
                                        <label htmlFor="exampleInputName1" className="col-sm-2 col-form-label">
                                            재직인증여부
                                        </label>
                                        <div className="col-sm-10">
                                            <label
                                                className="badge badge-danger"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    if (window.confirm("인증요청하시겠습니까?")) {
                                                        alert("인증요청이 완료되었습니다!");
                                                    }
                                                }}
                                            >
                                                인증요청하기
                                            </label>
                                            <label className="badge badge-danger">미인증</label>
                                            <label className="badge badge-warning">인증진행중</label>
                                            <label className="badge badge-info">인증거절</label>
                                            <label className="badge badge-success">인증완료</label>
                                        </div>
                                    </Form.Group>
                                    {/*
                                    <Form.Group as="div" className="row align-items-start mb-3">
                                        <label htmlFor="exampleTextarea1" className="col-sm-2 col-form-label">
                                            기타(특이사항)
                                        </label>
                                        <div className="col-sm-10">
                                            <Form.Control
                                                as="textarea"
                                                id="exampleTextarea1"
                                                rows={4}
                                                placeholder="내용을 입력하세요"
                                            />
                                        </div>
                                    </Form.Group>*/}

                                    <div className="d-flex justify-content-center mt-4">
                                        <button type="submit" className="btn btn-primary me-2">
                                            등록
                                        </button>
                                        <button type="button" className="btn btn-light">
                                            취소
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CrrHstrCreate
