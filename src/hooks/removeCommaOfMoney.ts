/**
 * @description Input에서 입력된 금액에서 ,를 제거하여 반환합니다. (DB에 money 값 저장할 때 사용)
 * @example 123,456 => 123456
 */

const removeCommaOfMoney = (money: string | number) => {
    return parseInt(money?.toString().replace(/[₩\\,]/g, ""));
};

export default removeCommaOfMoney;
