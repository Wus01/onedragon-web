import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useHistory } from 'react-router-dom';

const safeDate = (str) => {
    if (!str) return null;
    if (typeof str === 'string' && /^\d{8}$/.test(str)) {
        const yyyy = str.substring(0, 4);
        const mm = str.substring(4, 6);
        const dd = str.substring(6, 8);
        return new Date(`${yyyy}-${mm}-${dd}`);
    }
    let dateStr = String(str);
    if (dateStr.includes(" ")) dateStr = dateStr.replace(" ", "T");
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
}

export const CrrHstrCreate = () => {
    const { storeId: pathStoreId } = useParams();
    const history = useHistory();
    const storageUserId = localStorage.getItem('userId');
    const isEditMode = Boolean(storageUserId && pathStoreId);
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

    const [userId, setUserId] = useState(storageUserId || "");
    const [storeId, setStoreId] = useState(pathStoreId || "");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [authYn, setAuthYn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!storageUserId) {
            alert("로그인이 필요한 서비스입니다.");
            history.push("/login");
            return;
        }

        // pathStoreId가 있을 때만 조회 로직 실행
        if (pathStoreId) {
            setIsLoading(true);
            axios.get(`${API_BASE_URL}/crrHstr/${storageUserId}/${pathStoreId}`)
                .then(res => {
                    const result = res.data.data || res.data;
                    if (result) {
                        setUserId(storageUserId);
                        setStoreId(result.storeId);
                        setStartDate(safeDate(result.crrStrtDate));
                        setEndDate(safeDate(result.crrEndDate));
                        setAuthYn(result.authYn === true || result.authYn === 'Y');
                    }
                })
                .catch(err => console.error("데이터 로드 실패:", err))
                .finally(() => setIsLoading(false));
        } else {
            // 신규 등록 모드로 진입 시 필드 초기화
            setStoreId("");
            setStartDate(null);
            setEndDate(null);
            setAuthYn(false);
        }
    }, [pathStoreId, storageUserId, history, API_BASE_URL]);

    const getPayload = () => {
        const formatDate = (date) => {
            if (!date) return null;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}${month}${day}`;
        };

        return {
            userId: storageUserId,
            storeId: parseInt(storeId),
            crrStrtDate: formatDate(startDate),
            crrEndDate: formatDate(endDate),
            authYn: authYn,
            delYn: false
        };
    };

    // [등록] 완료 후 해당 아이디의 조회 화면으로 이동
    const handleSave = () => {
        if(!storeId) { alert("지점 ID를 입력해주세요."); return; }
        axios.post(`${API_BASE_URL}/crrHstr`, getPayload())
            .then(() => {
                alert("등록 완료!");
                // 등록 성공 후 URL에 storeId를 붙여서 페이지를 리다이렉트 (조회 모드로 전환됨)
                history.push(`/CrrHstrCreate/${storeId}`);
            }).catch(() => alert("등록 실패"));
    };

    // [수정] 완료 후 현재 상태 유지 (useEffect가 자동으로 다시 불러옴)
    const handleUpdate = () => {
        if (!window.confirm("수정하시겠습니까?")) return;
        axios.put(`${API_BASE_URL}/crrHstr/${storageUserId}/${pathStoreId}`, getPayload())
            .then(() => {
                alert("수정 완료!");
                // 현재 URL과 동일하므로 강제로 조회 로직이 타게 됨
                window.location.reload();
            }).catch(() => alert("수정 실패"));
    };

    const handleDelete = () => {
        if (!window.confirm("삭제하시겠습니까?")) return;
        axios.delete(`${API_BASE_URL}/crrHstr/${storageUserId}/${pathStoreId}`)
            .then(() => {
                alert("삭제 완료");
                history.push("/MypageHome");
            }).catch(() => alert("삭제 실패"));
    };

    if (isLoading) return <div className="p-5 text-center">데이터 로딩 중...</div>;

    return (
        <div className="p-4 bg-light min-vh-100">
            <div className="card shadow-sm border-0 rounded-4 p-4 mx-auto" style={{ maxWidth: '700px' }}>
                <h3 className="fw-bold mb-4 text-primary border-bottom pb-3">
                    {isEditMode ? "🏠 재직 정보 상세/수정" : "➕ 신규 재직 등록"}
                </h3>
                <Form>
                    <Form.Group className="row mb-3 align-items-center">
                        <Form.Label className="col-sm-3 fw-bold">신청인 ID</Form.Label>
                        <div className="col-sm-9">
                            <Form.Control type="text" value={storageUserId} readOnly className="bg-light border-0" />
                        </div>
                    </Form.Group>
                    <Form.Group className="row mb-3 align-items-center">
                        <Form.Label className="col-sm-3 fw-bold">지점 ID</Form.Label>
                        <div className="col-sm-9">
                            <Form.Control
                                type="number"
                                value={storeId}
                                onChange={(e) => setStoreId(e.target.value)}
                                readOnly={isEditMode}
                                className={isEditMode ? "bg-light" : ""}
                            />
                        </div>
                    </Form.Group>
                    <Form.Group className="row mb-4 align-items-center">
                        <Form.Label className="col-sm-3 fw-bold">근무 기간</Form.Label>
                        <div className="col-sm-9 d-flex gap-2 align-items-center">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="시작일"
                            />
                            <span>~</span>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="종료일"
                            />
                        </div>
                    </Form.Group>

                    {/* 수정 모드일 때만 인증 상태 배지 표시 */}
                    {isEditMode && (
                        <Form.Group className="row mb-4 align-items-center">
                            <Form.Label className="col-sm-3 fw-bold">상태</Form.Label>
                            <div className="col-sm-9">
                                {authYn ? <span className="badge bg-success">인증 완료</span> : <span className="badge bg-warning text-dark">인증 대기</span>}
                            </div>
                        </Form.Group>
                    )}

                    <div className="d-flex justify-content-end gap-2 border-top pt-4">
                        {isEditMode ? (
                            <>
                                <button type="button" className="btn btn-primary px-4" onClick={handleUpdate}>수정 내용 저장</button>
                                <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>기록 삭제</button>
                            </>
                        ) : (
                            <button type="button" className="btn btn-success px-4" onClick={handleSave}>등록 후 확인</button>
                        )}
                        <button type="button" className="btn btn-light" onClick={() => history.push("/MypageHome")}>목록으로</button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default CrrHstrCreate;