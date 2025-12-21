import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

// 입력창을 커스텀하고 싶을 때 사용하는 내부 컴포넌트
const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button className="custom-datepicker-button" onClick={onClick} ref={ref}>
    {value || "날짜를 선택하세요"}
  </button>
));
const CustomDatePicker = ({ 
  selectedDate, 
  onChange, 
  showTime = true, 
  placeholder
}) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      locale={ko}
      // 시간 선택 여부를 props로 조절
      showTimeSelect={showTime}
      timeIntervals={15}
      timeCaption="시간"
      dateFormat={showTime ? "yyyy-MM-dd HH:mm" : "yyyy-MM-dd"}
      placeholderText={placeholder}
      // 커스텀 입력창을 쓰고 싶다면 아래 주석을 해제하세요
      // customInput={<CustomInput />} 
      className="common-datepicker-input"
    />
  );
};

export default CustomDatePicker;