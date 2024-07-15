import dayjs, { Dayjs } from "dayjs";

/* 기간 계산하기
   - dayjs 의 diff 함수는 기본적으로 시작일을 포함하기 않고 계산되기 때문에
     2024년 7월 1일 ( 시작일 ) ~ 2024년 7월 31일 ( 종료일 ) 로 선택해도 0 개월로 계산

   - 일단위로 계산하고 "N 월 N 일" 형식으로 나타내기 
     ( 단, N 개월 0 일로 계산될 경우 "N 개월" 로만 표기 )
*/
const calculatePeriod = (
    startDate: Date | Dayjs,
    endDate: Date | Dayjs
): string => {
    // 문자열을 Day.js 객체로 변환
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    // 시작일까지 포함히기 위해 종료일에 1일 더하기
    const adjustedEndDate = end.add(1, "day");

    // 시작일과 종료일 사이의 전체 개월 수 계산
    const months = adjustedEndDate.diff(start, "month");

    // 계산된 개월 수를 제외한 나머지 일 수 계산
    // - startDate.add(months, "month") =  (시작일) + (시작일과 종료일 사이의 전체 개월 수)
    // - adjustedEndDate.diff(startDate.add(months, "month"), "day")
    //   = ( 계산된 개월 수를 제외한 나머지 일 수 )
    //   = ( 종료일 ) - { (시작일) + (시작일과 종료일 사이의 전체 개월 수) }
    const days = adjustedEndDate.diff(start.add(months, "month"), "day");

    if (days === 0) {
        return `${months}개월`; // N 개월 0 일
    } else {
        return `${months}개월 ${days}일`; // N 개월 N 일
    }
};

export default calculatePeriod;
