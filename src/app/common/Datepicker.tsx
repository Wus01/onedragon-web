import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import {Dayjs} from "dayjs";

interface CustomInputProps {
  value? : string;
  onClick? : (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// 입력창을 커스텀하고 싶을 때 사용하는 내부 컴포넌트
const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => (
  <button className="custom-datepicker-button" onClick={onClick} ref={ref}>
    {value || "날짜를 선택하세요"}
  </button>
));

CustomInput.displayName = 'CustomInput'; //forwardRef 사용 시 에러 방지용 이름 지정

interface CustomDatePickerProps {
  selectedDate: Date | Dayjs | null;
  onChange: (date: Date | null, event: React.SyntheticEvent<any> | undefined) => void; //react-datepicker 전용 onChange 타입
  showTime?: boolean; // 있을 수도 없을 수도 있으니 ? 추가
  placeholder?: string;
}

const CustomDatePicker = ({ 
  selectedDate, 
  onChange, 
  showTime = true, 
  placeholder
}: CustomDatePickerProps) => {
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