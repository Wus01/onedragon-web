import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
// ProgressBar는 코드에서 사용되지 않아 제거 가능하지만, 원본에 따라 남겨둡니다.
import { ProgressBar } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

// export const  = () => {
function ApplyList(){
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



    function fn_confirm(){
        alert("확정하시겠습니까?");
    }
  // JSX 반환
  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">지원자 리스트</h3>
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
            <h4 className="card-title">공고 지점명</h4>
            <form className="forms-sample">
              {/* 1. 점포명 (Form.Control 사용, readOnly) */}
              <Form.Group className="mb-3">
                {/*<Form.Label htmlFor="inputStoreName" value={hiring?.hiringTitle}>{hiring?.hiringTitle}</Form.Label>*/}
                {/* type="selectBox" 대신 type="text"를 사용하고, id를 수정했습니다. */}
                <Form.Control type="text" id="inputStoreName" value={ ''} readOnly />
              </Form.Group>

              {/* 2. 제목 (Form.Control 사용, readOnly) */}
              <h4 className="card-title">공고 제목</h4>
              <Form.Group className="mb-3">

                {/* type="email" 대신 type="text"를 사용하는 것이 적절합니다. */}
                <Form.Control type="text" id="inputTitle" value={''} readOnly />
              </Form.Group>

              {/* 3. 지원자 (Form.Control 사용, readOnly) */}
              <h4 className="card-title">지원자 목록</h4>
              <Form.Group className="mb-3">

              </Form.Group>

              <div className="">
                <table className="table">
                  <thead>
                    <tr>
                        <th></th>
                      <th style={{fontWeight:'bold', fontSize:'25'}}>성명</th>
                      <th style={{fontWeight:'bold', fontSize:'25'}}>점포</th>
                      <th style={{fontWeight:'bold', fontSize:'25'}}>경력</th>
                      {/*<th> 지원여부</th>*/}
                    </tr>
                  </thead>
                  <tbody>
                        {/* 🌟 map() 메서드를 사용하여 데이터 리스트를 순회합니다. */}
                          {applierList.map((applier, index) => (
                              // 💡 중요: 리스트를 렌더링할 때는 반드시 최상위 요소에 'key' prop을 부여해야 합니다.
                              <tr key={applier.applyNo || index}>

                                  {/* 1. 체크박스 TD (이전에 중앙 정렬을 논의했던 부분) */}
                                  <td className="align-middle">
                                      <input type="checkbox" className="form-check-input"/>
                                  </td>

                                  {/* 2. 지원자 이름 TD */}
                                  <td>{applier.userId}</td>

                                  {/* 3. 성별 TD */}
                                  {/*<td>{applier.gender}</td>*/}

                                  {/* 4. 나이 TD */}
                                  {/*<td>{applier.age}</td>*/}

                                  {/* 5. 상태 TD */}
                                  {/*<td>{applier.status}</td>*/}


                              </tr>
                          ))}
                          {/* 지원자 목록이 비어있을 경우 */}
                          {applierList.length === 0 && (
                              <tr>
                                  <td colSpan="5" className="text-center">해당 공고에 지원한 지원자가 없습니다.</td>
                              </tr>
                          )}
                    {/*<tr>
                        <td className="d-flex align-items-center justify-content-center" style={{ height: '30px' }}><input type="checkbox" className="form-check-input"/></td>
                      <td> 곽혜진</td>
                      <td><Link to={`/hiring/1`}>GS25<span className='text-danger'></span></Link></td>
                      <td>1년</td>

                    </tr>
                    <tr>
                    <td className="d-flex align-items-center justify-content-center" style={{ height: '30px' }}><input type="checkbox" className="form-check-input"/></td>
                      <td>황원정</td>
                      <td>세븐일레븐<span className='text-danger'></span></td>
                      <td >5개월 </td>


                    </tr>*/}


                  </tbody>
                </table>
              </div>
                <div className="text-center mt-3">
                    <button type="button" className="btn btn-primary mr-2" onClick={fn_confirm}>확정</button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyList;