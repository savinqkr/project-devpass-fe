const numberToMoney = (money: number) => {
    // 숫자를 돈의 형식으로 변환하여 반환
    return money.toLocaleString("en-US");
};

export default numberToMoney;
