import moneyToNumber from "@utils/moneyToNumber";
import dayjs from "dayjs";

const useAddSubtotals = (
    sales_claim_date_list: { date?: Date; amount?: string }[],
    selectedYear: number,
    subtotal: {
        month: number;
        total: number;
    }[],
    over: { value: number }
) => {
    sales_claim_date_list.forEach(item => {
        if (item.amount && item.amount) {
            //
            let month = dayjs(item.date).month();
            //
            if (dayjs(item.date).year() === selectedYear) {
                subtotal[month].total =
                    subtotal[month].total + moneyToNumber(item.amount);
                //
            } else if (dayjs(item.date).year() > selectedYear) {
                over.value += item.amount ? moneyToNumber(item.amount) : 0;
            }
        }
    });
};

export default useAddSubtotals;
