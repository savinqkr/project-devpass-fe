import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";

const useAddYearOptions = (
    sales_claim_date_list: (Date | undefined)[],
    setYearOptions: Dispatch<SetStateAction<Set<number>>>,
    yearOptions: Set<number>
) => {
    sales_claim_date_list.forEach(date => {
        date && setYearOptions(yearOptions.add(dayjs(date).get("year")));
    });
};

export default useAddYearOptions;
