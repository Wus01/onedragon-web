import React, { useEffect, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import ApplyList from "./ApplyList";
import {checkApply, getHiringDetailAPI, insertApply} from "../../api/hiringBoardApi";

interface ApplyData {
    hiringNo: number;
}

interface Hiring {
    hiringNo: number;
    storeNm: string;
    rgstId: string;
    hiringStsNm: string;
    rgstDate: string;
    hiringTitle: string;
    workStartDate: string;
    workEndDate: string;
    hiringText : string;
    hiringSts: string;
}

export interface ApplyChk {
    applySts: string;
    accepted : boolean;
    applied : boolean;
}

function HiringDetail(){
    const { id } = useParams();
    const history = useHistory();
    const [hiring,setHiring] = useState<Hiring>({} as Hiring);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    // 지원여부상태
    const [isApplied, setIsApplied] = useState(false);
    const [isAccepted, setIsAccepted] = useState<boolean>(false);
    const [applySts, setApplySts] = useState<string>("");

    // 게시글 불러오기
    const getHiringDetail= async () => {
        try {
            const data = await getHiringDetailAPI(id);

            console.log('게시글 가져오기 성공:', data);
            setHiring(data);

            // 작성자와 로그인유저가 같은지 확인(지원자목록 보여주는 여부를 위함)
            const loginUserId = localStorage.getItem("userId");
            const isMyPost = (loginUserId === data.rgstId);
            setIsOwner(isMyPost);
            console.log("내 게시물인지 여부: ", isOwner);

            // 로그인유저가 지원한 공고인지 확인
            if(loginUserId && !isMyPost){
                checkApplySts(data.hiringNo);
            }
        } catch (error){
            console.error('게시글 가져오기 실패:', error);
            alert("게시글을 불러오는 데 실패했습니다.");
        };
    };

    // 사용자가 지원한 공고인지 확인
    const checkApplySts= async(hiringNo: number)=> {
        try{
            const applyChk: ApplyChk = await checkApply(hiringNo);

            setIsApplied(applyChk.applied);
            setIsAccepted(applyChk.accepted);
            setApplySts(applyChk.applySts);
        }catch(error){
            console.error("지원여부확인실패:", error);
        }
    }

    useEffect(() => {
        getHiringDetail();
    }, [id]);

    const goToApply = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인 후 지원할 수 있습니다.");
            history.push('/login');
            return;
        }

        if (!hiring.hiringNo) {
            alert("채용 공고 정보를 불러온 뒤 다시 시도해 주세요.");
            return;
        }

        // 지원여부 확인
        if(isApplied){
            alert("이미 지원한 공고입니다.");
           return false;
        }

        if(window.confirm("취소할 수 없습니다. 지원하시겠습니까?")){
            const applyData: ApplyData ={
                hiringNo : Number(hiring.hiringNo)
            }

            try{
                await insertApply(applyData);
                alert("지원에 성공하였습니다.");
                setIsApplied(true);
                await checkApplySts(hiring.hiringNo);
            }catch(e: any){
                const status = e.response?.status;
                const responseMessage = typeof e.response?.data === 'string'
                    ? e.response.data
                    : null;

                if (status === 409) {
                    alert(responseMessage || "이미 지원했거나 지원할 수 없는 공고입니다.");
                    await checkApplySts(hiring.hiringNo);
                } else if (status === 401) {
                    return;
                } else {
                    alert(responseMessage || "지원 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
                }
                console.error(e);
            }
        }
    }

    return (
        <div>
            {/* 💡 1. 거슬리던 "공고 상세보기" page-header 영역을 아예 삭제했습니다. */}

            <div className="auth-form-light text-left py-2 py-md-4 px-0 px-md-4">
                <div className="card shadow-sm border-0">
                    <div className="card-body p-2 p-md-4">

                        {/* 💡 2. 여백 다이어트: mb(마진)를 없애고 py-2(위아래 패딩)만 주어서 선을 기준으로 위아래 간격을 아주 타이트하게 맞췄습니다. */}

                        {/* 1. 지점명 & 작성자 */}
                        <div className="row mx-0 border-bottom py-2 py-md-3 align-items-center">
                            <div className="col-4 col-md-2 fw-bold text-muted px-0 px-md-2" style={{ fontSize: '0.9rem' }}>지점명</div>
                            <div className="col-8 col-md-4 px-0 px-md-2" style={{ fontSize: '0.9rem' }}>{hiring.storeNm ?? '-'}</div>

                            <div className="col-4 col-md-2 fw-bold text-muted mt-1 mt-md-0 px-0 px-md-2" style={{ fontSize: '0.9rem' }}>작성자</div>
                            <div className="col-8 col-md-4 mt-1 mt-md-0 px-0 px-md-2" style={{ fontSize: '0.9rem' }}>{hiring.rgstId ?? '-'}</div>
                        </div>

                        {/* 2. 확정여부 & 작성일 */}
                        <div className="row mx-0 border-bottom py-2 py-md-3 align-items-center">
                            <div className="col-4 col-md-2 fw-bold text-muted px-0 px-md-2" style={{ fontSize: '0.9rem' }}>확정여부</div>
                            <div className="col-8 col-md-4 px-0 px-md-2" style={{ fontSize: '0.9rem' }}>{hiring.hiringStsNm ?? '-'}</div>

                            <div className="col-4 col-md-2 fw-bold text-muted mt-1 mt-md-0 px-0 px-md-2" style={{ fontSize: '0.9rem' }}>작성일</div>
                            <div className="col-8 col-md-4 mt-1 mt-md-0 px-0 px-md-2" style={{ fontSize: '0.9rem' }}>
                                {String(hiring.rgstDate).length > 18 ? hiring.rgstDate.substring(0, 19) : hiring.rgstDate}
                            </div>
                        </div>

                        {/* 3. 제목 */}
                        <div className="row mx-0 border-bottom py-2 py-md-3 align-items-center">
                            <div className="col-4 col-md-2 fw-bold text-muted px-0 px-md-2" style={{ fontSize: '0.9rem' }}>제목</div>
                            <div className="col-8 col-md-10 px-0 px-md-2" style={{ fontSize: '0.9rem' }}>{hiring.hiringTitle || '-'}</div>
                        </div>

                        {/* 4. 근무 시작일시 & 마감일시 */}
                        <div className="row mx-0 border-bottom py-2 py-md-3 align-items-center">
                            <div className="col-4 col-md-2 fw-bold text-muted px-0 px-md-2" style={{ fontSize: '0.9rem' }}>근무시작</div>
                            <div className="col-8 col-md-4 px-0 px-md-2" style={{ fontSize: '0.9rem' }}>{hiring.workStartDate || '-'}</div>

                            <div className="col-4 col-md-2 fw-bold text-muted mt-1 mt-md-0 px-0 px-md-2" style={{ fontSize: '0.9rem' }}>근무마감</div>
                            <div className="col-8 col-md-4 mt-1 mt-md-0 px-0 px-md-2" style={{ fontSize: '0.9rem' }}>{hiring.workEndDate || '-'}</div>
                        </div>

                        {/* 5. 내용 */}
                        <div className="row mx-0 pt-2 pt-md-3">
                            <div className="col-12 fw-bold text-muted mb-1 px-0 px-md-2" style={{ fontSize: '0.9rem' }}>내용</div>
                            <div className="col-12 px-0 px-md-2">
                                <div
                                    className="p-2 p-md-3 bg-light rounded"
                                    style={{ minHeight: '100px', whiteSpace: 'pre-line', fontSize: '0.9rem' }}
                                >
                                    {hiring.hiringText || '등록된 내용이 없습니다.'}
                                </div>
                            </div>
                        </div>

                        {/* 버튼 영역 */}
                        <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mt-md-4 pt-3 pt-md-4 border-top">
                            <Link to={`/hiringList`}>
                                <button type="button" className="btn btn-secondary px-3 px-md-4" style={{marginRight:'5px'}}>목록</button>
                            </Link>

                            {!isOwner && (
                                <button
                                    type="button"
                                    className="btn btn-primary px-3 px-md-4"
                                    onClick={goToApply}
                                    disabled={!hiring.hiringNo || hiring.hiringSts === '02' || isApplied}
                                    style={{
                                        backgroundColor: isAccepted ? '#19d895' : isApplied ? '#5c636a' : '#0d6efd',
                                        borderColor: isAccepted ? '#19d895' : isApplied ? '#5c636a' : '#0d6efd',
                                        color: 'white'
                                    }}
                                >
                                    {isAccepted ? "🎉 최종합격"
                                        : isApplied ? "지원완료"
                                        : "지원하기"}
                                </button>
                            )}
                        </div>

                        {/* 지원자 목록 */}
                        <div>
                            {isOwner && (
                                <div className="mt-4 mt-md-5">
                                    <ApplyList hiringNo={id} hiring={hiring} />
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
  );
}

export default HiringDetail;
