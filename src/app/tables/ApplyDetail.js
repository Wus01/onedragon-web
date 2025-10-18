import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
// ProgressBar는 코드에서 사용되지 않아 제거 가능하지만, 원본에 따라 남겨둡니다.
import { ProgressBar } from 'react-bootstrap';

// export const ApplyDetail = () => {
function ApplyDetail(){
  // 클래스 컴포넌트의 componentDidMount 역할을 useEffect로 대체
  useEffect(() => {
    // bsCustomFileInput 초기화는 필요한 경우에만 유지합니다.
    // 현재 코드에서는 파일 입력(file input)이 없지만, 만약 사용한다면 필요합니다.
    bsCustomFileInput.init();
  }, []); // 빈 배열은 컴포넌트가 마운트될 때 한 번만 실행됨을 의미합니다.

    function fn_confirm(){
        alert("확정하시겠습니까?");
    }
  // JSX 반환
  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> 내 공고 리스트 </h3>
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
            <h4 className="card-title">내 공고 리스트</h4>
            <form className="forms-sample">
              {/* 1. 점포명 (Form.Control 사용, readOnly) */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="inputStoreName">점포명</Form.Label>
                {/* type="selectBox" 대신 type="text"를 사용하고, id를 수정했습니다. */}
                <Form.Control type="text" id="inputStoreName" readOnly />
              </Form.Group>

              {/* 2. 제목 (Form.Control 사용, readOnly) */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="inputTitle">제목</Form.Label>
                {/* type="email" 대신 type="text"를 사용하는 것이 적절합니다. */}
                <Form.Control type="text" id="inputTitle" readOnly />
              </Form.Group>

              {/* 3. 지원자 (Form.Control 사용, readOnly) */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="inputApplicant">지원자</Form.Label>
                <Form.Control type="text" id="inputApplicant" readOnly />
              </Form.Group>

              {/* 4. 성별 (select 대신 Form.Control as="select" 사용, readOnly) */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="exampleSelectGender">성별</Form.Label>
                {/* Form.Control을 사용하고 as="select"로 지정하여 readOnly를 적용합니다. */}
                {/* select에 readOnly를 사용하면 UI적으로는 여전히 활성화된 것처럼 보일 수 있으나,
                    Bootstrap 스타일과 prop을 일관되게 적용하기 위함입니다.
                    사용자가 선택을 변경하지 못하게 하려면 'disabled'를 사용하는 것이 일반적입니다.
                    (여기서는 원본에 맞춰 readOnly 유지)
                */}
                <Form.Control as="select" id="exampleSelectGender" readOnly>
                  <option>여</option>
                  <option>남</option>
                </Form.Control>
              </Form.Group>

              {/* 5. 나이 (Form.Control 사용, readOnly) */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="inputAge">나이</Form.Label>
                <Form.Control type="text" id="inputAge" readOnly />
              </Form.Group>

              {/* 6. 이력사항 (Form.Control as="textarea" 사용, readOnly) */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="textareaResume">이력사항</Form.Label>
                {/* <textarea> 대신 Form.Control as="textarea"와 readOnly 사용 */}
                <Form.Control as="textarea" id="textareaResume" rows={4} readOnly />
              </Form.Group>

              <button type="button" className="btn btn-primary mr-2" onClick={fn_confirm}>확정</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyDetail;