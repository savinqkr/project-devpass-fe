const moneyToNumber = (money: string) => {
    // 1. currency 제거
    const moneyWithoutCurrency = money.replace(/[^\d.-]/g, "");

    // 2. number type으로 변환
    const parsedNumber = parseFloat(moneyWithoutCurrency);

    // 3. Int 타입으로 변환
    const integerNumber = parseInt(parsedNumber.toString());

    return integerNumber;
};

export default moneyToNumber;
