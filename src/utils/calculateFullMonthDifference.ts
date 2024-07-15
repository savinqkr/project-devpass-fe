// dayjs diff 대체 함수, 두 날짜 본인을 포함한 개월 수 차이를 int로 반환함

import dayjs from "dayjs";

// [date1 : 2024/06/05], [date2 : 2024/08/17] => 3
const calculateFullMonthDifference = (date1: Date, date2: Date) => {
    // let startDate = dayjs(date1);
    // let endDate = dayjs(date2);

    // // 시작 날짜가 끝 날짜보다 크면 두 날짜를 교환
    // if (startDate.isAfter(endDate)) {
    //     const temp = startDate;
    //     startDate = endDate;
    //     endDate = temp;
    // }

    // const yearDiff = endDate.year() - startDate.year();
    // const monthDiff = endDate.month() - startDate.month();

    // // 전체 개월 수 계산 ( 양 끝의 월도 포함하기 위해 + 1 )
    // let totalMonths: number = yearDiff * 12 + monthDiff + 1;

    // -----------------------------------------------------------------------

    let startDate = dayjs(date1).set("date", 1);
    let endDate = dayjs(date2).set("date", 1);

    let totalMonths: number = endDate.diff(startDate, "month") + 1;

    // console.log(totalMonths);

    return totalMonths;
};

export default calculateFullMonthDifference;
