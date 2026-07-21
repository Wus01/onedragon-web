import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ApplyList from "./ApplyList";
import {insertApply} from "../../api/hiringBoardApi";

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
    const getHiringDetail = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/hiring/${id}`)
                .then(response => {
                    console.log('게시글 가져오기 성공:', response.data);
                    setHiring(response.data);
                })
                .catch(error => {
                    console.error('게시글 가져오기 실패:', error);
                    alert("게시글을 불러오는 데 실패했습니다.");
                });
    };

        // 지원자목록 불러오기
        // const [applyList, setApplyList] = useState([]);
        // 지원여부상태
        const [isApplied, setIsApplied] = useState(false);

        // const getApplicantList = () => {
        //     axios.get(`${process.env.REACT_APP_API_URL}/apply/list/${id}`)
        //             .then(response => {
        //                 console.log('지원자목록 가져오기 성공!:', response.data);
        //                 setApplyList(response.data);
        //
        //                 const applyY = response.data.some(apply => apply.rgstId === loginUserId);
        //                 setIsApplied(applyY);
        //             })
        //             .catch(error => {
        //                 console.error('지원자목록 가져오기 실패:', error);
        //                 alert("지원자목록을 불러오는 데 실패했습니다.");
        //             });
        // }
        useEffect(() => {
            getHiringDetail();
            // getApplicantList();
        }, [id]); // id가 바뀔 때마다 다시 실행


    // 컴포넌트 내부 상단
    // const [selectedApplyNos, setSelectedApplyNos] = useState([]);
    // const handleCheck = (applyNo) => {
    //
    //   setSelectedApplyNos((prev) =>
    //     prev.includes(applyNo)
    //       ? prev.filter((id) => id !== applyNo) // 이미 있으면 제거
    //       : [...prev, applyNo]                  // 없으면 추가
    //   );
    // };

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

                // if (onSaveSuccess) onSaveSuccess();
                getHiringDetail();
                // getApplicantList();
            }catch(e){
                alert("지원 중 오류가 발생했습니다.");
                console.error(e);
            }
        }
    }

  return (

    <div>
      <div className="page-header">
        <h3 className="page-title">공고 상세보기</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
          </ol>
        </nav>
      </div>

      <div className="auth-form-light text-left py-5 px-4 px-sm-5">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">지점명</h4>
            <form className="forms-sample">
              {/* 1. 점포명 (Form.Control 사용, readOnly) */}
              <Form.Group className="mb-3">
                {/* 지점 데이터가 존재하고, storeNm이 있을때만 표시 */}
                <Form.Control type="text" id="inputStoreName" value={hiring.storeNm??''} readOnly />
              </Form.Group>
                <h4 className="card-title">작성자</h4>
                <Form.Group className="mb-3">
                    <Form.Control type="text" id="inputWriterName" value={hiring.rgstId??''} readOnly />
                </Form.Group>
                <h4 className="card-title">확정여부</h4>
                <Form.Group className="mb-3">
                    <Form.Control type="text" id="inputWriterName" value={hiring.hiringStsNm??''} readOnly />
                </Form.Group>
                <h4 className="card-title">작성일</h4>
                <Form.Group className="mb-3">
                    <Form.Control type="text" id="inputWriterName" value={String(hiring.rgstDate).length > 18 ? hiring.rgstDate.substring(0,19):hiring.rgstDate} readOnly />
                </Form.Group>
              {/* 2. 제목 (Form.Control 사용, readOnly) */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="inputTitle">제목</Form.Label>
                <Form.Control type="text" id="inputTitle" value={hiring.hiringTitle || ''} readOnly />
              </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="inputTitle">근무시작일시</Form.Label>
                    <Form.Control type="text" id="inputTitle" value={hiring.workStartDate || ''} readOnly />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="inputTitle">근무마감일시</Form.Label>
                    <Form.Control type="text" id="inputTitle" value={hiring.workEndDate || ''} readOnly />
                </Form.Group>
              {/* 3. 내용 (Form.Control as="textarea" 사용, readOnly) */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="textareaResume">내용</Form.Label>
                <Form.Control as="textarea" id="textareaResume" rows={4} value={hiring.hiringText || ''} readOnly />
              </Form.Group>
                <div style={{ textAlign:'center'}}>
                    <Link to={`/hiringList`}>
                        <button type="button" className="btn btn-primary mr-2" style={{ marginTop: '20px'}}>목록</button>
                    </Link>
                </div>

                {!isOwner && (
                    <div style={{textAlign:'center'}}>
                    <button type="button" className="btn btn-primary mr-2"
                            onClick={goToApply}
                            disabled={hiring.hiringSts === '02' || isApplied}
                            style={{ marginTop: '20px'}}>지원하기
                    </button>

                    </div>
                )
                }
                <div>
                    {/* 로그인 유저와 공고 작성자 아이디가 일치하면 지원자목록 컴포넌트 보이기*/}
                    {isOwner && (
                        <ApplyList hiringNo={id} hiring={hiring} />
                    )}
                </div>
            </form>

          </div>
        </div>
      </div>
    </div>

  );
}

export default HiringDetail;
