import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApplyList from "./ApplyList";
import { getHiringDetailAPI, insertApply} from "../../api/hiringBoardApi";

interface ApplyData {
    hiringNo: number;
    rgstId: string;
    applySucYn : 'Y' | 'N';
    applySts : string;
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

function HiringDetail(){
    const { id } = useParams();
    const [hiring,setHiring] = useState<Hiring>({} as Hiring);

    // 게시글 불러오기
    const getHiringDetail= async () => {
        // axios.get(`${process.env.REACT_APP_API_URL}/hiring/${id}`)
        try {
            const data = await getHiringDetailAPI(id);

                // .then(response => {
                    console.log('게시글 가져오기 성공:', data);
                    setHiring(data);
                // })
        } catch (error){
            console.error('게시글 가져오기 실패:', error);
            alert("게시글을 불러오는 데 실패했습니다.");
        };
    };

        // 지원여부상태
        const [isApplied, setIsApplied] = useState(false);

        useEffect(() => {
            getHiringDetail();
            // getApplicantList();
        }, [id]); // id가 바뀔 때마다 다시 실행

    const loginUserId = localStorage.getItem("userId");
    const isOwner = String(loginUserId) === String(hiring.rgstId);

    const goToApply = async () => {
        // 지원여부 확인
        if(isApplied){
            alert("이미 지원한 공고입니다.");
           return false;
        }

        if(window.confirm("지원하시겠습니까?")){
            // 데이터 세팅
            const userId = localStorage.getItem("userId");
            const applyData: ApplyData ={
                hiringNo : Number(hiring.hiringNo),
                rgstId: userId,
                applySucYn : 'N',
                applySts : '01' //지원완료
            }

            try{
                await insertApply(applyData);

                getHiringDetail();
            }catch(e){
                alert("지원 중 오류가 발생했습니다.");
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
                                    disabled={hiring.hiringSts === '02' || isApplied}
                                >
                                    지원하기
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
