import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
// ProgressBar는 코드에서 사용되지 않아 제거 가능하지만, 원본에 따라 남겨둡니다.
import { ProgressBar } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

// export const  = () => {
function ApplyList({hiringNo, hiring}){
//  // 클래스 컴포넌트의 componentDidMount 역할을 useEffect로 대체
//  useEffect(() => {
//    // bsCustomFileInput 초기화는 필요한 경우에만 유지합니다.
//    // 현재 코드에서는 파일 입력(file input)이 없지만, 만약 사용한다면 필요합니다.
//    bsCustomFileInput.init();
//  }, []); // 빈 배열은 컴포넌트가 마운트될 때 한 번만 실행됨을 의미합니다.
//



    const { id } = useParams(); // alt+enter
//    const navigate = useNavigate();

        let [applierList, setApplierList] = useState([]);

        // 게시글 가져오기 성공 후 상태 업데이트
        useEffect(() => {
            axios.get(`${process.env.REACT_APP_API_URL}/apply/list/${id}`)
                .then(response => {
                    console.log('지원자 목록 가져오기 성공:', response.data);

                    // 🌟 이 부분을 수정합니다. (반복문 제거)
                    // response.data가 이미 배열이므로, 배열 전체를 상태로 설정합니다.
                    setApplierList(response.data);

                })
                .catch(error => {
                    console.error('지원자 목록 가져오기 실패:', error);
                    alert("게시글을 불러오는 데 실패했습니다.");
                });
        }, [id]);



    // 지원자목록 불러오기
    // 1. 초기값 수정: 리스트(배열)를 받아야 하므로 []로 초기화하세요.
    const [applyList, setApplyList] = useState([]);

    useEffect(() => {
        // 2. URL의 id는 현재 페이지의 파라미터(id)를 그대로 쓰되,
        //    백엔드 컨트롤러 주소와 일치시키면 됩니다.
        axios.get(`${process.env.REACT_APP_API_URL}/apply/list/${id}`)
            .then(response => {
                console.log('지원자목록 가져오기 성공!:', response.data);

                setApplyList(response.data);
            })
            .catch(error => {
                console.error('지원자목록 가져오기 실패:', error);
                alert("지원자목록을 불러오는 데 실패했습니다.");
            });
    }, [id]); // id가 바뀔 때마다 다시 실행


    // 컴포넌트 내부 상단
    const [selectedApplyNos, setSelectedApplyNos] = useState([]);
    const handleCheck = (applyNo) => {

        setSelectedApplyNos((prev) =>
            prev.includes(applyNo)
                ? prev.filter((id) => id !== applyNo) // 이미 있으면 제거
                : [...prev, applyNo]                  // 없으면 추가
        );
    };
    const fn_confirm = () => {
        if (selectedApplyNos.length === 0) {
            alert("확정할 지원자를 선택해주세요.");
            return;
        }

        if (window.confirm("확정하시겠습니까?")) {
            const hiringNo = Number(hiring.hiringNo);
            console.log("백엔드로 보낼 applyNos:", selectedApplyNos);
//            컨트롤러단(백엔드) 호출
            const response = axios.post(`${process.env.REACT_APP_API_URL}/hiring/confirm`
                , { applyNos: selectedApplyNos
                    , hiringNo: hiringNo
                    , userId : localStorage.getItem("userId")
                    , applySts : '04' //확정
            }).then(response => {
                alert("성공적으로 확정되었습니다.");
                window.location.reload();
            })
                .catch(error => {
                    console.error("에러 발생:", error);
                    alert("확정처리 중 오류에 실패하였습니다.");
                });
        }
    };

    const calculateTotalExperience = (crrHstrList) => {
        if (!crrHstrList || crrHstrList.length === 0) return "신입";

        let totalDays = 0;

        crrHstrList.forEach((hstr) => {
            const start = new Date(hstr.crrStrtDate);
            const end = hstr.crrEndDate ? new Date(hstr.crrEndDate) : new Date(); // 종료일 없으면 오늘 기준

            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 밀리초를 일 단위로 변환
            totalDays += diffDays;
        });

        const years = Math.floor(totalDays / 365);
        const months = Math.floor((totalDays % 365) / 30);

        let result = "";
        if (years > 0) result += `${years}년 `;
        if (months > 0) result += `${months}개월`;

        return result || "1개월 미만";
    };
  return (
    <div>

        <h4 style={{fontWeight:'bold', fontSize:'30', textAlign:'center', marginTop:'30px'}}>지원자 목록({applyList.length}명)</h4>
          <div className="" style={{marginTop:'20px'}}>
            <table className="table">
              <thead>
                <tr style={{textAlign:'center'}}>
                  <th style={{fontWeight:'bold', fontSize:'25'}}><input type="checkbox" /></th>
                  <th>번호</th>
                  <th>이름</th>
                  <th>지점명</th>
                  <th>경력</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {applyList && applyList.length > 0 ? (
                  applyList.map((apply, index) => (
                    <tr key={apply.applyNo || index} style={{textAlign:'center'}}>
                      <td><input type="checkbox" checked={selectedApplyNos.includes(apply.applyNo)} onChange={() => handleCheck(apply.applyNo)}/></td>
                      <td>{index + 1}</td>
                      <td>{apply.userInfo?.userNm || ''}</td>
                      <td>{apply.userInfo?.crrHstrList?.length > 0
                                      ? apply.userInfo.crrHstrList[0].storeInfo?.storeNm
                                      : ''}</td>
                      <td>{apply.userInfo?.crrHstrList?.length > 0
                                ? `총 ${calculateTotalExperience(apply.userInfo.crrHstrList)}`
                                : ''}</td>
                      <td>{apply.applySucYn === 'Y'?'확정':'미확정'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">지원자가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
            <div className="text-center">
            <button type="button" className="btn btn-primary mr-2"
                onClick={fn_confirm}
                disabled={hiring.hiringSts === '02'}
                style={{ marginTop: '20px', textAlign:'center' }}>확정</button>
            </div>
          {/*</div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}

export default ApplyList;