/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { putZero, getValueType } from './shared/generalUtils';
import { Calendar } from './Calendar';
import DatePickerInput from './DatePickerInput';
import { useLocaleUtils } from './shared/hooks';
import { TYPE_SINGLE_DATE, TYPE_MUTLI_DATE, TYPE_RANGE } from './shared/constants';
const DatePicker = ({
  value,
  onChange,
  formatInputText,
  inputPlaceholder,
  inputClassName,
  inputName,
  renderInput,
  wrapperClassName,
  calendarClassName,
  calendarTodayClassName,
  calendarSelectedDayClassName,
  calendarRangeStartClassName,
  calendarRangeBetweenClassName,
  calendarRangeEndClassName,
  calendarPopperPosition,
  disabledDays,
  onDisabledDayError,
  colorPrimary,
  colorPrimaryLight,
  slideAnimationDuration,
  minimumDate,
  maximumDate,
  selectorStartingYear,
  selectorEndingYear,
  locale,
  shouldHighlightWeekends,
  renderFooter,
  customDaysClassName,
  parentId = '',
  parentClassName = '',
  showTime = false,
  showSecond = false,
}) => {
  const calendarContainerElement = useRef(null);
  const inputElement = useRef(null);
  const shouldPreventToggle = useRef(false);
  const [isCalendarOpen, setCalendarVisiblity] = useState(false);
  const date = new Date();
  const { getLanguageDigits } = useLocaleUtils(locale);
  const [time, setTime] = useState({
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  });

  useEffect(() => {
    const handleBlur = () => {
      setCalendarVisiblity(false);
    };
    window.addEventListener('blur', handleBlur, false);
    return () => {
      window.removeEventListener('blur', handleBlur, false);
    };
  }, []);

  useEffect(() => {
    if (value && showTime) {
      const date_temp = new Date();
      const tmp = {
        hour: value.hour ? value.hour : date_temp.getHours(),
        minute: value.minute ? value.minute : date_temp.getMinutes(),
        second: value.second ? value.second : date_temp.getSeconds(),
      };
      if (!showSecond) delete tmp.second;
      setTime(tmp);
      onChange({ ...value, ...tmp });
    }
  }, []);

  // handle input focus/blur
  useEffect(() => {
    const valueType = getValueType(value);
    if (valueType === TYPE_MUTLI_DATE) return; // no need to close the calendar
    const shouldCloseCalendar =
      valueType === TYPE_SINGLE_DATE ? !isCalendarOpen : !isCalendarOpen && value.from && value.to;
    if (shouldCloseCalendar) inputElement.current.blur();
  }, [value, isCalendarOpen]);

  const handleBlur = e => {
    e.persist();
    if (!isCalendarOpen) return;
    const isInnerElementFocused = calendarContainerElement.current.contains(e.relatedTarget);
    if (shouldPreventToggle.current) {
      shouldPreventToggle.current = false;
      inputElement.current.focus();
    } else if (isInnerElementFocused && e.relatedTarget) {
      e.relatedTarget.focus();
    } else {
      setCalendarVisiblity(false);
    }
  };

  const openCalendar = e => {
    if (!shouldPreventToggle.current) setCalendarVisiblity(true);
  };

  // Keep the calendar in the screen bounds if input is near the window edges
  useLayoutEffect(() => {
    if (!isCalendarOpen) return;
    const { left, width, height, top } = calendarContainerElement.current.getBoundingClientRect();
    const { clientWidth, clientHeight } = document.getElementById(parentId)
      ? document.getElementById(parentId)
      : document.getElementsByClassName(parentClassName) &&
        document.getElementsByClassName(parentClassName).length
      ? document.getElementsByClassName(parentClassName)[0]
      : document.documentElement;
    const isOverflowingFromRight = left + width > clientWidth;
    const isOverflowingFromLeft = left < 0;
    const isOverflowingFromBottom = top + height > clientHeight;
    const getLeftStyle = () => {
      const overflowFromRightDistance = left + width - clientWidth;

      if (!isOverflowingFromRight && !isOverflowingFromLeft) return;
      const overflowFromLeftDistance = Math.abs(left);
      const rightPosition = isOverflowingFromLeft ? overflowFromLeftDistance : 0;
      const leftStyle = isOverflowingFromRight
        ? `calc(${parentId || parentClassName ? '100%' : '50%'} - ${
            parentId || parentClassName ? width : overflowFromRightDistance
          }px)`
        : `calc(50% + ${rightPosition}px)`;
      return leftStyle;
    };

    calendarContainerElement.current.style.left = getLeftStyle();
    if (
      // (calendarPopperPosition === 'auto' && isOverflowingFromBottom&&top>height) ||
      calendarPopperPosition === 'top'
    ) {
      calendarContainerElement.current.classList.add('-top');
    }
  }, [isCalendarOpen]);

  const handleCalendarChange = newValue => {
    const valueType = getValueType(value);
    if (showTime) {
      if (!showSecond) delete time.second;
      onChange({ ...newValue, ...time });
    } else onChange(newValue);
    if (valueType === TYPE_SINGLE_DATE) setCalendarVisiblity(false);
    else if (valueType === TYPE_RANGE && newValue.from && newValue.to) setCalendarVisiblity(false);
  };

  const handleKeyUp = ({ key }) => {
    switch (key) {
      case 'Enter':
        setCalendarVisiblity(true);
        break;
      case 'Escape':
        setCalendarVisiblity(false);
        shouldPreventToggle.current = true;
        break;
    }
  };

  useEffect(() => {
    if (!isCalendarOpen && shouldPreventToggle.current) {
      inputElement.current.focus();
      shouldPreventToggle.current = false;
    }
  }, [shouldPreventToggle, isCalendarOpen]);
  const handleChange = e => {
    let tenp_time = { ...time };
    switch (e) {
      case 'h-up':
        tenp_time = { ...time, hour: time.hour + 1 > 23 ? 0 : time.hour + 1 };
        break;
      case 'h-down':
        tenp_time = { ...time, hour: time.hour - 1 < 0 ? 23 : time.hour - 1 };
        break;
      case 'm-up':
        tenp_time = { ...time, minute: time.minute + 1 > 59 ? 0 : time.minute + 1 };
        break;
      case 'm-down':
        tenp_time = { ...time, minute: time.minute - 1 < 0 ? 59 : time.minute - 1 };
        break;
      case 's-up':
        tenp_time = { ...time, second: time.second + 1 > 59 ? 0 : time.second + 1 };
        break;
      case 's-down':
        tenp_time = { ...time, second: time.second - 1 < 0 ? 59 : time.second - 1 };
        break;
      default:
        break;
    }
    const tmp_date = new Date();
    const val = value
      ? value
      : {
          year: tmp_date.getFullYear(),
          month: tmp_date.getMonth() + 1,
          day: tmp_date.getDate(),
        };
    if (!showSecond) delete tenp_time.second;
    onChange({ ...val, ...tenp_time });
    setTime(tenp_time);
  };
  const temp = () => {
    if (showTime)
      return (
        <>
          <div className="flex-center w-100 font-size-20  border-top">
            <div className="mx-2 item-center flex-column ">
              <span
                onClick={() => {
                  handleChange('h-up');
                }}
                className={`font-bolder font-size-35 flex-center pointer rotate-${
                  locale === 'en' ? 'ltr' : 'rtl'
                }`}
                style={{ paddingBlockEnd: locale === 'en' ? 10 : -10 }}
              >
                &#8250;
              </span>
              <span className="flex-center w-22px ">{getLanguageDigits(putZero(time?.hour))}</span>
              <span
                style={{ paddingBlockEnd: locale === 'en' ? 10 : -10 }}
                onClick={() => {
                  handleChange('h-down');
                }}
                className={`font-bolder flex-center pointer  font-size-35 rotate-${
                  locale === 'en' ? 'ltr' : 'rtl'
                }`}
              >
                &#8249;
              </span>
            </div>
            <span>:</span>
            <div className="mx-2 item-center flex-column ">
              <span
                style={{ paddingBlockEnd: locale === 'en' ? 10 : -10 }}
                onClick={() => {
                  handleChange('m-up');
                }}
                className={`font-bolder font-size-35 flex-center pointer   rotate-${
                  locale === 'en' ? 'ltr' : 'rtl'
                }`}
              >
                &#8250;
              </span>
              <div className="flex-center w-22px">{getLanguageDigits(putZero(time.minute))}</div>
              <span
                style={{ paddingBlockEnd: locale === 'en' ? 10 : -10 }}
                onClick={() => {
                  handleChange('m-down');
                }}
                className={`font-bolder flex-center pointer  font-size-35 rotate-${
                  locale === 'en' ? 'ltr' : 'rtl'
                }`}
              >
                &#8249;
              </span>
            </div>
            {showSecond ? (
              <>
                <span>:</span>
                <div className="mx-2 item-center flex-column">
                  <span
                    style={{ paddingBlockEnd: locale === 'en' ? 10 : -10 }}
                    onClick={() => {
                      handleChange('s-up');
                    }}
                    className={`font-bolder flex-center  pointer font-size-35 rotate-${
                      locale === 'en' ? 'ltr' : 'rtl'
                    }`}
                  >
                    &#8250;
                  </span>
                  <span className=" flex-center w-22px">
                    {getLanguageDigits(putZero(time.second))}
                  </span>
                  <span
                    style={{ paddingBlockEnd: locale === 'en' ? 10 : -10 }}
                    onClick={() => {
                      handleChange('s-down');
                    }}
                    className={`font-bolder flex-center pointer  font-size-35 rotate-${
                      locale === 'en' ? 'ltr' : 'rtl'
                    }`}
                  >
                    &#8249;
                  </span>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      );
    else return <></>;
  };
  return (
    <div
      onFocus={openCalendar}
      onBlur={handleBlur}
      onKeyUp={handleKeyUp}
      className={`DatePicker ${wrapperClassName}  ${
        locale === 'en' ? 'gregorian' : 'jalali'
      }-font-family`}
      role="presentation"
    >
      <DatePickerInput
        ref={inputElement}
        formatInputText={formatInputText}
        value={value}
        inputPlaceholder={inputPlaceholder}
        inputClassName={inputClassName}
        renderInput={renderInput}
        inputName={inputName}
        locale={locale}
        showTime={showTime}
        showSecond={showSecond}
      />
      {isCalendarOpen && (
        <>
          <div
            ref={calendarContainerElement}
            className="DatePicker__calendarContainer"
            data-testid="calendar-container"
            role="presentation"
            onMouseDown={() => {
              shouldPreventToggle.current = true;
            }}
          >
            <Calendar
              value={value}
              onChange={handleCalendarChange}
              calendarClassName={calendarClassName}
              calendarTodayClassName={calendarTodayClassName}
              calendarSelectedDayClassName={calendarSelectedDayClassName}
              calendarRangeStartClassName={calendarRangeStartClassName}
              calendarRangeBetweenClassName={calendarRangeBetweenClassName}
              calendarRangeEndClassName={calendarRangeEndClassName}
              disabledDays={disabledDays}
              colorPrimary={colorPrimary}
              colorPrimaryLight={colorPrimaryLight}
              slideAnimationDuration={slideAnimationDuration}
              onDisabledDayError={onDisabledDayError}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              selectorStartingYear={selectorStartingYear}
              selectorEndingYear={selectorEndingYear}
              locale={locale}
              shouldHighlightWeekends={shouldHighlightWeekends}
              renderFooter={renderFooter}
              customDaysClassName={customDaysClassName}
              time={temp}
            />
          </div>
          <div className="DatePicker__calendarArrow" />
        </>
      )}
    </div>
  );
};

DatePicker.defaultProps = {
  wrapperClassName: '',
  locale: 'en',
  calendarPopperPosition: 'auto',
  parentClassName: 'p-dialog',
};

export default DatePicker;
