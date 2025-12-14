import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// v5 호환: useHistory 사용
import { useParams, useHistory } from 'react-router-dom';

// 날짜 변환 헬퍼 함수: 유효한 Date 객체 또는 null 반환 보장
const safeDate = (str) => {
    if (!str) return null;

    // 1) YYYYMMDD 형식 처리
    if (/^\d{8}$/.test(str)) {
        const yyyy = str.substring(0, 4);
        const mm = str.substring(4, 6);
        const dd = str.substring(6, 8);
        return new Date(`${yyyy}-${mm}-${dd}`);
    }

    // 2) "2025-11-02 20:23:56.993" 형식 처리
    if (str.includes(" ")) {
        str = str.replace(" ", "T");
    }

    const d = new Date(str);
    // Invalid Date 객체일 경우 null 반환하여 Controlled Component 상태 유지
    return isNaN(d.getTime()) ? null : d;
}

export const CrrHstrCreate = () => {
    // State 정의
    const [userId, setUserId] = useState(1);
    // 경고 해결: 입력 필드의 value가 null/undefined가 되지 않도록 빈 문자열("")로 초기화
    const [storeId, setStoreId] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [authYn, setAuthYn] = useState(false);

    // 라우팅 훅 사용 (v5)
    const { userId: pathUserId, storeId: pathStoreId } = useParams();
    const history = useHistory();

    const isEditMode = pathUserId && pathStoreId;

    // 데이터 조회 (componentDidMount 대체)
    useEffect(() => {
        if (isEditMode) {
            axios.get(`${process.env.REACT_APP_API_URL}/crrHstr/${pathUserId}/${pathStoreId}`)
                .then(res => {
                    // ⭐ 핵심 수정: 서버 응답 구조 변경에 따라 res.data.data에 접근
                    // 응답 본체가 { success: true, message: "...", data: {...} } 형태임
                    const data = res.data.data;

                    // Controlled Component 경고 방지 로직 적용
                    setStoreId(data.storeId || "");
                    setStartDate(safeDate(data.crrStrtDate || null));
                    setEndDate(safeDate(data.crrEndDate || null));

                    setUserId(data.userId);
                    setAuthYn(data.authYn);
                })
                .catch(err => {
                    console.error("조회 실패:", err);
                    alert("데이터 조회에 실패했습니다.");
                });
        }
    }, [isEditMode, pathUserId, pathStoreId]);

    // 공통 Payload 구성
    const createPayload = (currentStoreId) => ({
        userId: userId,
        storeId: currentStoreId || storeId,
        crrStrtDate: startDate ? startDate.toISOString().slice(0, 10) : null,
        crrEndDate: endDate ? endDate.toISOString().slice(0, 10) : null,
        authYn: authYn
    });

    // 등록 (POST)
    const handleSave = () => {
        const payload = createPayload(storeId);

        axios.post(`${process.env.REACT_APP_API_URL}/crrHstr`, payload)
            .then(res => {
                // API 응답 구조를 반영하여 success 여부 체크
                if (res.data.success) {
                    alert("등록 완료!");
                } else {
                    alert("등록 실패: " + (res.data.message || "서버 오류"));
                }
            })
            .catch(err => {
                console.error("등록 실패:", err);
                alert("등록 실패! 중복 값 또는 필수 값이 누락되었는지 확인해주세요.");
            });
    }

    // 수정 (PUT)
    const handleUpdate = () => {
        if (!window.confirm("정말 수정하시겠습니까?")) return;

        const payload = createPayload(pathStoreId);
        const url = `${process.env.REACT_APP_API_URL}/crrHstr/${pathUserId}/${pathStoreId}`;

        axios.put(url, payload)
            .then(res => {
                if (res.data.success) {
                    alert("수정 완료!");
                } else {
                    alert("수정 실패: " + (res.data.message || "서버 오류"));
                }
            })
            .catch(err => {
                console.error("수정 실패:", err);
                alert("수정 실패!");
            });
    };

    // 삭제 (DELETE)
    const handleDelete = () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        axios.delete(`${process.env.REACT_APP_API_URL}/crrHstr/${pathUserId}/${pathStoreId}`)
            .then(res => {
                if (res.data.success) {
                    alert("삭제 완료!");
                    history.push("/storelist"); // 삭제 후 페이지 이동
                } else {
                    alert("삭제 실패: " + (res.data.message || "서버 오류"));
                }
            })
            .catch(err => {
                console.error("삭제 실패:", err);
                alert("삭제 실패!");
            });
    };

    // 렌더링
    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    {isEditMode ? "재직 수정" : "재직 등록"}
                </h3>
            </div>
            <div className="row">
                <div className="col-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <form className="forms-sample">
                                {/* 지점 입력 */}
                                <Form.Group as="div" className="row align-items-center mb-3">
                                    <label htmlFor="exampleInputName1" className="col-sm-2 col-form-label">
                                        지점
                                    </label>
                                    <div className="col-sm-3">
                                        <Form.Control
                                            type="text"
                                            value={storeId}
                                            onChange={(e) => setStoreId(e.target.value)}
                                            className="form-control"
                                            id="exampleInputName1"
                                            placeholder="지점 선택 (Store ID 입력)"
                                        />
                                    </div>
                                </Form.Group>

                                {/* 근무 기간 입력 */}
                                <Form.Group as="div" className="row align-items-center mb-3">
                                    <label htmlFor="exampleInputDate" className="col-sm-2 col-form-label">
                                        근무 기간
                                    </label>
                                    <div className="col-sm-10">
                                        <div className="d-flex align-items-center">
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => setStartDate(date)}
                                                className="form-control"
                                                placeholderText="시작일"
                                                dateFormat="yyyy-MM-dd"
                                            />
                                            <span className="mx-2">~</span>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={(date) => setEndDate(date)}
                                                className="form-control"
                                                placeholderText="종료일"
                                                dateFormat="yyyy-MM-dd"
                                            />
                                        </div>
                                    </div>
                                </Form.Group>

                                {/* 재직 인증 여부 */}
                                <Form.Group as="div" className="row align-items-center mb-3">
                                    <label htmlFor="exampleInputName1" className="col-sm-2 col-form-label">
                                        재직인증여부
                                    </label>
                                    <div className="col-sm-10">
                                        {authYn === false ? (
                                            <label
                                                className="badge badge-danger"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    if (window.confirm("인증요청하시겠습니까?")) {
                                                        alert("인증요청이 완료되었습니다!");
                                                        // 실제 구현 시, 여기서 인증 요청 API 호출 로직 추가
                                                    }
                                                }}
                                            >
                                                미인증
                                            </label>
                                        ) : (
                                            <label className="badge badge-success">인증완료</label>
                                        )}
                                    </div>
                                </Form.Group>

                                {/* 버튼 영역 */}
                                <div className="d-flex justify-content-center mt-4">
                                    {isEditMode ? (
                                        <>
                                            {/* 수정 버튼 */}
                                            <button
                                                type="button"
                                                onClick={handleUpdate}
                                                className="btn btn-primary me-2"
                                            >
                                                수정
                                            </button>

                                            {/* 삭제 버튼 */}
                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                className="btn btn-danger me-2"
                                            >
                                                삭제
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {/* 등록 버튼 */}
                                            <button
                                                type="button"
                                                onClick={handleSave}
                                                className="btn btn-primary me-2"
                                            >
                                                등록
                                            </button>
                                        </>
                                    )}

                                    {/* 취소 버튼 (공통) */}
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() => history.goBack()}
                                    >
                                        취소
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CrrHstrCreate;