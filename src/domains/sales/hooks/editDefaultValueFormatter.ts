import removeCurrencyOfMoney from "@hooks/removeCurrencyOfMoney";
import dayjs from "dayjs";
import { UseFormSetValue } from "react-hook-form";

const editDefaultValueFormatter = (
    value: {
        key: string;
        value: any;
        type: "str" | "num" | "date" | "money";
    }[],
    setValue: UseFormSetValue<any>
) => {
    value.map(item => {
        if (item.type === "date" && item.value) {
            return setValue(item.key, dayjs(item.value));
        } else if (item.type === "money" && item.value) {
            return setValue(item.key, removeCurrencyOfMoney(item.value));
        } else if (item.type === "num" || item.type === "str") {
            return setValue(item.key, item.value);
        }
        return;
    });
};

export default editDefaultValueFormatter;
