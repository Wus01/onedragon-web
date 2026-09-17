import React, {forwardRef, useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import {ko} from 'date-fns/locale';
import dayjs, {Dayjs} from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css';

interface CalendarInputProps {
  value?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

const CalendarInput = forwardRef<HTMLButtonElement, CalendarInputProps>(({
  value,
  onClick,
  placeholder,
  disabled
}, ref) => (
  <button
    className={`onedragon-date-input ${value ? 'has-value' : ''}`}
    type="button"
    onClick={onClick}
    ref={ref}
    disabled={disabled}
  >
    <i className="mdi mdi-calendar" aria-hidden="true" />
    <span>{value || placeholder || '날짜를 선택하세요'}</span>
    <i className="mdi mdi-chevron-down" aria-hidden="true" />
  </button>
));

CalendarInput.displayName = 'CalendarInput';

interface CustomDatePickerProps {
  selectedDate: Date | Dayjs | null;
  onChange: (date: Date | null, event?: React.SyntheticEvent<any>) => void;
  showTime?: boolean;
  placeholder?: string;
  placement?: string;
  disabled?: boolean;
  minDate?: Date;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  onChange,
  showTime = true,
  placeholder,
  placement,
  disabled = false,
  minDate
}) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const normalizedDate = selectedDate
    ? dayjs.isDayjs(selectedDate) ? selectedDate.toDate() : selectedDate
    : null;

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const getNativeValue = (date: Date | null) => {
    if (!date) return '';
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    return showTime ? localISOTime : localISOTime.split('T')[0];
  };

  if (isMobile) {
    return (
      <div className={`onedragon-native-date ${normalizedDate ? 'has-value' : ''}`}>
        <i className="mdi mdi-calendar" aria-hidden="true" />
        <input
          type={showTime ? 'datetime-local' : 'date'}
          value={getNativeValue(normalizedDate)}
          min={minDate ? getNativeValue(minDate) : undefined}
          onChange={(event) => onChange(event.target.value ? new Date(event.target.value) : null, event)}
          disabled={disabled}
          aria-label={placeholder || '날짜 선택'}
        />
      </div>
    );
  }

  return (
    <DatePicker
      selected={normalizedDate}
      onChange={onChange}
      locale={ko}
      showTimeSelect={showTime}
      timeIntervals={15}
      timeCaption="시간"
      dateFormat={showTime ? 'yyyy.MM.dd HH:mm' : 'yyyy.MM.dd'}
      placeholderText={placeholder}
      popperPlacement={placement || 'bottom-start'}
      popperClassName="onedragon-calendar-popper"
      calendarClassName="onedragon-calendar"
      showPopperArrow={false}
      todayButton="오늘"
      minDate={minDate}
      disabled={disabled}
      customInput={<CalendarInput placeholder={placeholder} disabled={disabled} />}
    />
  );
};

export default CustomDatePicker;
