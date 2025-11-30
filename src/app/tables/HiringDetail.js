import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
// ProgressBar는 코드에서 사용되지 않아 제거 가능하지만, 원본에 따라 남겨둡니다.
import { ProgressBar } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
//import API_BASE_URL from '../../config/apiConfig';

console.log('***HiringDetail File is Loaded***');
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

    let [hiring,setHiring] = useState({
            hiringTitle:"",
            hiringText:""
        });

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



    function fn_confirm(){
        alert("확정하시겠습니까?");
    }
  // JSX 반환
  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">공고 상세보기</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#!" onClick={event => event.preventDefault()}>Tables</a></li>
            <li className="breadcrumb-item active" aria-current="page">Basic tables</li>
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
                <Form.Control type="text" id="inputStoreName" value={hiring.storeInfo.storeNm || ''} readOnly />
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



              <div className="">
                <table className="table">
                  <thead>
                  <p style={{fontWeight:'bold', fontSize:'30'}}>지원자 목록</p>
                    <tr>
                      <th style={{fontWeight:'bold', fontSize:'25'}}><input type="checkbox"/></th>
                      <th>이름</th>
                      <th>지점명</th>
                      <th>경력</th>

                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><input type="checkbox"/></td>
                      <td><Link to={`/hiring/1`}>곽혜진</Link></td>
                      <td>GS편의점</td>
                      <td>1년</td>
                    </tr>
                    <tr>
                        <td><input type="checkbox"/></td>
                        <td><Link to={`/hiring/1`}>김한희</Link></td>
                        <td>GS편의점, 세븐일레븐</td>
                        <td>2년 1개월</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"/></td>
                      <td><Link to={`/hiring/1`}>황지현</Link></td>
                      <td>GS편의점, 세븐일레븐</td>
                      <td>3년 5개월</td>
                    </tr>
                    <tr>
                      <td><input type="checkbox"/></td>
                      <td><Link to={`/hiring/1`}>황원정</Link></td>
                      <td>GS편의점, 세븐일레븐</td>
                      <td>3개월</td>
                    </tr>

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