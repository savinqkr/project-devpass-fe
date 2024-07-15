/**
 * @description money type의 통화 표시를 제거하여 string type으로 반환합니다. (detail 페이지에 금액을 표시할 때 사용합니다.)
 * @example //123,456 => 123,456
 */
const removeCurrencyOfMoney = (money: number | string) => {
    return money?.toString().replace(/[₩\\]/g, "");
};

export default removeCurrencyOfMoney;
