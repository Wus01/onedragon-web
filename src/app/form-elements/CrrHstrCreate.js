import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useHistory } from 'react-router-dom';
axios.defaults.withCredentials = true;

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
// 파일 상단 safeDate 함수 근처에 추가하세요
const formatDate = (date) => {
    if (!date) return null;
    try {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // 결과: "2026-01-18"
    } catch (e) {
        return null; // date가 올바른 Date 객체가 아닐 경우 대비
    }
};
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
    const [storeName, setStoreName] = useState("");

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
                        setStoreName(result.storeName); // ✨ 'storeName'으로 매핑

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
        return {
            userId: storageUserId,      // String
            storeId: parseInt(storeId), // 💡 중요: String을 Integer로 변환
            crrStrtDate: formatDate(startDate), // 💡 중요: Date객체를 'YYYY-MM-DD' 문자열로 변환
            crrEndDate: formatDate(endDate),
            authYn: authYn || false,    // 💡 중요: Boolean 타입 보장
            delYn: false                // 신규 등록은 항상 false
        };
    };

    // [등록] 완료 후 해당 아이디의 조회 화면으로 이동
    const handleSave = () => {
        if (!storeId) {
            alert("지점 ID를 입력해주세요.");
            return;
        }

        // getPayload()를 통해 완성된 JSON 데이터를 POST로 전송
        axios.post(`${API_BASE_URL}/crrHstr`, getPayload())
            .then((res) => {
                alert("등록 완료!");
                // 💡 방법 A: 마이페이지 목록으로 이동 (추천)
                history.push("/MypageHome");

                // 💡 방법 B: 방금 등록한 상세 페이지로 이동 (조회 모드 전환)
                // history.push(`/CrrHstrCreate/${storeId}`);
            })
            .catch((err) => {
                console.error("등록 실패:", err);
                alert("등록에 실패했습니다. 지점 ID나 날짜를 확인해주세요.");
            });
    };
    const handleUpdate = () => {
        if (!window.confirm("수정하시겠습니까?")) return;

        axios.put(`${API_BASE_URL}/crrHstr/${storageUserId}/${pathStoreId}`, getPayload())
            .then((res) => {
                alert("수정 완료!");

                // 백엔드 ResponseDto에서 데이터를 받아와서 상태 업데이트
                const result = res.data.data;
                if (result) {
                    setStartDate(safeDate(result.crrStrtDate));
                    setEndDate(safeDate(result.crrEndDate));
                    setStoreName(result.storeName); // 혹시 바뀌었을 지점명 반영
                    setAuthYn(result.authYn);      // 인증 상태 반영
                }
            })
            .catch((err) => {
                console.error("수정 실패:", err);
                alert("수정 실패");
            });
    };
    const handleDelete = () => {
        if (!window.confirm("정말 이 기록을 삭제하시겠습니까?")) return;

        // axios.delete에서 body를 보낼 때는 { data: payload } 형식을 사용해야 합니다.
        axios.delete(`${API_BASE_URL}/crrHstr/${storageUserId}/${pathStoreId}`, {
            data: getPayload()
        })
            .then((res) => {
                const result = res.data.data;
                alert(`${result.storeName} 지점 기록이 삭제 처리되었습니다.`);
                history.push("/MypageHome");
            })
            .catch((err) => {
                console.error("삭제 에러:", err);
                alert("삭제 처리에 실패했습니다.");
            });
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
                        <Form.Label className="col-sm-3 fw-bold">지점명</Form.Label>
                        <div className="col-sm-9">
                            {isEditMode ? (
                                /* 수정 모드: 지점명을 Input Box 안에 넣고 읽기 전용으로 설정 */
                                <div className="d-flex align-items-center position-relative">
                                    <Form.Control
                                        type="text"
                                        value={storeName || "지점 정보 없음"}
                                        readOnly
                                        className="bg-light fw-bold border-1"
                                        style={{ cursor: 'default' }}
                                    />
                                    {/* 아이콘을 강조하고 싶다면 Input 위에 살짝 띄울 수 있습니다 (선택사항) */}
                                    <i className="bi bi-geo-alt-fill text-danger position-absolute" style={{ right: '15px' }}></i>
                                </div>
                            ) : (
                                /* 신규 등록 모드: 기존 유지 */
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Control
                                        type="number"
                                        placeholder="지점 ID 입력"
                                        value={storeId}
                                        onChange={(e) => setStoreId(e.target.value)}
                                        className="w-25"
                                    />
                                    {storeName && (
                                        <Form.Control
                                            type="text"
                                            value={storeName}
                                            readOnly
                                            className="bg-light flex-grow-1"
                                        />
                                    )}
                                </div>
                            )}
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