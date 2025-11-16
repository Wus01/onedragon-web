import React, { Component } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export class CrrHstrCreate extends Component {

    state = {
        userId: 1,   // 추후 로그인시 userId받아오므로 삭제예정
        branchName: "",
        startDate: null,
        endDate: null,
        authYn: false,
        storeId: "",
    };

safeDate(str) {
    if (!str) return null;

    // 1) YYYYMMDD 형식 처리
    if (/^\d{8}$/.test(str)) {
        const yyyy = str.substring(0, 4);
        const mm = str.substring(4, 6);
        const dd = str.substring(6, 8);
        return new Date(`${yyyy}-${mm}-${dd}`);
    }

    // 2) "2025-11-02 20:23:56.993" 처리
    if (str.includes(" ")) {
        str = str.replace(" ", "T");
    }

    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;


}

    isEditMode = () => {
        const { userId, storeId } = this.props.match.params;
        return userId && storeId;
    }

    componentDidMount() {
        if (this.isEditMode()) {
            const { userId, storeId } = this.props.match.params;

            axios.get(`${process.env.REACT_APP_API_URL}/crrHstr/${userId}/${storeId}`)
                .then(res => {
                    const data = res.data;

                    this.setState({
                        userId : data.userId,   // 🔥 진짜 DB값으로 덮어쓰기
                        storeId: data.storeId,
                        startDate: this.safeDate(data.crrStrtDate),
                        endDate: this.safeDate(data.crrEndDate),
                        authYn: data.authYn,    // boolean이어야 함
                    });
                })
                .catch(err => console.error("조회 실패:", err));
        }
    }

    // 저장(등록/수정)
    handleSave = () => {
        const { startDate, endDate, storeId, authYn } = this.state;
        const { userId, storeId: pathStoreId } = this.props.match.params;

        const payload = {
            userId: this.state.userId,
            storeId: storeId,
            crrStrtDate: startDate ? startDate.toISOString().slice(0, 10) : null,
            crrEndDate: endDate ? endDate.toISOString().slice(0, 10) : null,
            authYn: authYn
        };

        if (this.isEditMode()) {
            // 수정 모드 → PUT
            axios.put(`${process.env.REACT_APP_API_URL}/crrHstr/${userId}/${pathStoreId}`, payload)
                .then(() => alert("수정 완료!"))
                .catch(err => console.error("수정 실패:", err));
        } else {
            // 등록 모드 → POST
            axios.post(`${process.env.REACT_APP_API_URL}/crrHstr`, payload)
                .then(() => alert("등록 완료!"))
                .catch(err => console.error("등록 실패:", err));
        }
    }
    render() {
        return (
            <div>
                <div className="page-header">
                    <h3 className="page-title">
                        {this.isEditMode() ? "재직 수정" : "재직 등록"}
                    </h3>
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
                                                value ={this.state.storeId}
                                                onChange={(e) => this.setState({ storeId: e.target.value })}
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
                                            {this.state.authYn === false? (
                                              <label
                                                className="badge badge-danger"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    if (window.confirm("인증요청하시겠습니까?")) {
                                                        alert("인증요청이 완료되었습니다!");
                                                    }
                                                }}
                                            >
                                                미인증
                                            </label>
                                                ) : (
                                                <label className="badge badge-danger">인증완료</label>
                                                )}
                                            {/*<label className="badge badge-danger">미인증</label>*/}
                                            {/*<label className="badge badge-warning">인증진행중</label>*/}
                                            {/*<label className="badge badge-info">인증거절</label>*/}
                                            {/*<label className="badge badge-success">인증완료</label>*/}
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

                                    {/* 버튼 */}
                                    <div className="d-flex justify-content-center mt-4">
                                        <button
                                            type="button"
                                            onClick={this.handleSave}
                                            className="btn btn-primary me-2"
                                        >
                                            {this.isEditMode() ? "수정" : "등록"}
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
