import { IBasicMoneyDatePicker } from "./BasicMoneyDatePicker.interface";
import VBasicMoneyDatePicker from "./BasicMoneyDatePicker.view";

/**
 *
 * @param errMsg 값을 입력하지 않은 경우 보여지는 메세지.
 * @example errMsg= {{ money: "금액을 입력해주세요.", date: "날짜를 선택해주세요." }}
 */
const BasicMoneyDatePicker: React.FC<IBasicMoneyDatePicker.IProps> = props => {
    const inputPriceFormat = (str: string) => {
        const comma = (str: string) => {
            str = String(str);
            return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
        };
        const uncomma = (str: string) => {
            str = String(str);
            return str.replace(/[^\d]+/g, "");
        };
        return comma(uncomma(str));
    };

    return (
        <VBasicMoneyDatePicker inputPriceFormat={inputPriceFormat} {...props} />
    );
};

export default BasicMoneyDatePicker;
