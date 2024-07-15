const moneyFormat = (money: number | string) => {
    let str = money.toString();

    // 부호를 확인하여 저장
    const sign = str.charAt(0) === "-" ? "-" : "";

    // 숫자와 소수점 이외의 문자 제거
    str = str.replace(/[^\d.]/g, "");

    // 소수점 이하의 문자 제거
    const decimalPart = str.split(".")[1];
    str = str.split(".")[0];

    // 콤마 삽입
    str = str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // 소수점 이하 부분 추가
    if (decimalPart !== undefined) {
        str = `${str}.${decimalPart}`;
    }

    // 부호 추가
    return `${sign}${str}`;
};

export default moneyFormat;
