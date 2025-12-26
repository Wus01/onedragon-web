import React, {useState} from 'react';
import CustomDatePicker from './Datepicker';
import { ko } from 'date-fns/esm/locale';
import styled from '@emotion/styled';
import '../../assets/css/modal.css';
import dayjs from 'dayjs';


const CustModal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, header} = props;
  const [selected, setSelected] = useState("토픽 선택");

  const handleSelect = (e) => {
    setSelected(e.target.value);
  };

  // 1. State 선언 (타입 지정 부분 삭제)
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [startDate, setStartDate] = useState(undefined);

  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [endDate, setEndDate] = useState(undefined);

  const [dateBtn, setDateBtn] = useState('전체');
  const [isDateDisabled, setIsDateDisabled] = useState(false);

  const [appointmentDate, setAppointmentDate] = useState(null);

  // 2. 시작 날짜 변경 핸들러
  const handleStartDateChange = (date) => {
    setDateBtn('');
    if (date) {
      setSelectedStartDate(date);
      setStartDate(dayjs(date).format('YYYY-MM-DD')); // String()으로 감싸지 않아도 format은 문자열을 반환합니다.
    }
  };

  // 3. 종료 날짜 변경 핸들러
  const handleEndDateChange = (date) => {
    setDateBtn('');
    if (date) {
      setSelectedEndDate(date);
      setEndDate(dayjs(date).format('YYYY-MM-DD'));
    }
  };

  // 점포 등록 개수에 따라 달라지게 !!
  const list = [{value:'1',name:'석호중앙점'}];
  // const list = [{value:'1',name:'석호중앙점'}, {value:'2', name:'고잔중앙점'}];

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? 'openModal modal' : 'modal'}>
      {open ? (
        <section>
          <header>
            {header}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          {/* <main>{props.children}</main> */}
          <main>
            <div>
              <label style={{margin:15}}>지점</label>
              <select style={{marginLeft:30}} name="지점" onChange={handleSelect} >
                {list.length > 1 ? 
                  <>
                    <option value="" selected disabled>선택</option>
                    {
                      list.map((item) => (
                        <option key={item.value} value={item.value}>{item.name}</option>
                      ))
                    }
                  </>
                :
                (
                  <>
                    <option key={list[0].value} value={list[0].value}>{list[0].name}</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label style={{margin:15}}>업무</label>
              <label style={{marginLeft:30}}>
                <input
                  type="radio"
                  value="1"
                  name="업무"
                  checked
                />
                편의점
              </label>
              <label style={{marginLeft:10}}>
                <input
                  type="radio"
                  value="2"
                  name="업무"
                />
                카페
              </label>
            </div>
            <div>
              <label style={{margin:15}}>근무 일자</label>
              <CustomDatePicker 
                selectedDate={selectedStartDate} 
                onChange={(date) => handleStartDateChange(date)} 
                placeholder="시작일자"
              />
              <div style={{marginLeft:92}}>
                <CustomDatePicker 
                  selectedDate={selectedEndDate} 
                  onChange={(date) => handleEndDateChange(date)} 
                  placeholder="종료일자"
                />
              </div>
              
              <div style={{margin:15}}>
                <label>
                  <input style={{marginLeft:75}} type='checkbox' />
                  협의가능
                </label>
              </div>              
            </div>
            <div>
              <label style={{margin:15}}>긴급성</label>
              <label style={{margin:15}}>
                <input
                  type="radio"
                  value="1"
                  name="긴급성"
                  checked
                />
                일반
              </label>
              <label>
                <input
                  type="radio"
                  value="2"
                  name="긴급성"
                />
                급구
              </label>
            </div>
            <div>
              <label style={{marginLeft:15, marginTop:15}}>
                제목
                <textarea 
                  style={{marginLeft:45, width:250, height:30, verticalAlign: 'top'}}
                  type='text'
                  placeholder='지점 + 업무 + 주/야간 + 긴급성'
                />
              </label>
            </div>
            <div>
              <label style={{marginLeft:15, marginTop:5}}>
                내용
                <textarea
                  style={{marginLeft:45, width:250, height:150, verticalAlign: 'top'}}
                  multiple={true}
                  type='text'
                  placeholder='업무 내용 및 원하는 인재상??'
                />
              </label>
            </div>
          </main>
          <footer>
            <button onClick={close}>
              close
            </button>
            <button onClick={close} style={{marginLeft:10, backgroundColor:'#1388f6ff'}}>
              save
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

export default CustModal;