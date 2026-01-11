import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
// ProgressBar는 코드에서 사용되지 않아 제거 가능하지만, 원본에 따라 남겨둡니다.
import { ProgressBar } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
//import API_BASE_URL from '../../config/apiConfig';


console.log("API URL:", process.env.REACT_APP_API_URL);
// export const  = () => {
function HiringDetail(){
//  // 클래스 컴포넌트의 componentDidMount 역할을 useEffect로 대체
//  useEffect(() => {
//    // bsCustomFileInput 초기화는 필요한 경우에만 유지합니다.
//    // 현재 코드에서는 파일 입력(file input)이 없지만, 만약 사용한다면 필요합니다.
//    bsCustomFileInput.init();
//  }, []); // 빈 배열은 컴포넌트가 마운트될 때 한 번만 실행됨을 의미합니다.
//



    const { id } = useParams(); // alt+enter
//    const navigate = useNavigate();

    const [hiring,setHiring] = useState({});

        // 게시글 불러오기
        useEffect(() => {
            axios.get(`${process.env.REACT_APP_API_URL}/hiring/${id}`)
                .then(response => {
                    console.log('게시글 가져오기 성공:', response.data);
                    setHiring(response.data);
                })
                .catch(error => {
                    console.error('게시글 가져오기 실패:', error);
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
    const [selectedIds, setSelectedIds] = useState([]);
    const handleCheck = (applyNo) => {
        console.log("1");
      setSelectedIds((prev) =>
        prev.includes(applyNo)
          ? prev.filter((id) => id !== applyNo) // 이미 있으면 제거
          : [...prev, applyNo]                  // 없으면 추가
      );
    };
    const fn_confirm = () => {
      if (selectedIds.length === 0) {
        alert("확정할 지원자를 선택해주세요.");
        return;
      }

      alert(`선택된 지원자 번호: ${selectedIds.join(", ")} \n총 ${selectedIds.length}명을 확정하시겠습니까?`);

      // 여기서 서버로 selectedIds를 보내는 axios 요청을 하면 됩니다!
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
  // JSX 반환
  return (

    <div>
      <div className="page-header">
        <h3 className="page-title">공고 상세보기</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            {/*<li className="breadcrumb-item"><a href="#!" onClick={event => event.preventDefault()}>Tables</a></li>
            <li className="breadcrumb-item active" aria-current="page">Basic tables</li>*/}
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
                {/*<Form.Label htmlFor="inputStoreName" value={hiring?.hiringTitle}>{hiring?.hiringTitle}</Form.Label>*/}
                {/* type="selectBox" 대신 type="text"를 사용하고, id를 수정했습니다. */}

                {/* 지점 데이터가 존재하고, storeNm이 있을때만 표시 */}
                <Form.Control type="text" id="inputStoreName" value={hiring.storeInfo?.storeNm??''} readOnly />
              </Form.Group>

              {/* 2. 제목 (Form.Control 사용, readOnly) */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="inputTitle">제목</Form.Label>
                {/* type="email" 대신 type="text"를 사용하는 것이 적절합니다. */}
                <Form.Control type="text" id="inputTitle" value={hiring.hiringTitle || ''} readOnly />
              </Form.Group>



              {/* 3. 내용 (Form.Control as="textarea" 사용, readOnly) */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="textareaResume">내용</Form.Label>
                {/* <textarea> 대신 Form.Control as="textarea"와 readOnly 사용 */}
                <Form.Control as="textarea" id="textareaResume" rows={4} value={hiring.hiringText || ''} readOnly />
              </Form.Group>


<p style={{fontWeight:'bold', fontSize:'30'}}>지원자 목록({applyList.length}명)</p>
              <div className="">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{fontWeight:'bold', fontSize:'25'}}><input type="checkbox" /></th>
                      <th>번호</th>
                      <th>이름</th>
                      <th>지점명</th>
                      <th>경력</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applyList && applyList.length > 0 ? (
                      applyList.map((apply, index) => (
                        <tr key={apply.applyNo || index}>
                          <td><input type="checkbox" checked={selectedIds.includes(apply.applyNo)} onChange={() => handleCheck(apply.applyNo)}/></td>
                          <td>{index + 1}</td>
                          <td>{apply.userInfo?.userNm || ''}</td>
                          <td>{apply.userInfo?.crrHstrList?.length > 0
                                          ? apply.userInfo.crrHstrList[0].storeInfo?.storeNm
                                          : ''}</td>
                          <td>{apply.userInfo?.crrHstrList?.length > 0
                                    ? `총 ${calculateTotalExperience(apply.userInfo.crrHstrList)}`
                                    : ''}</td>
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

              <button type="button" className="btn btn-primary mr-2" onClick={fn_confirm}>확정</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HiringDetail;