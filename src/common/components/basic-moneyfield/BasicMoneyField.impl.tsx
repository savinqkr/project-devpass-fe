import { IBasicMoneyField } from "./BasicMoneyField.interface";
import VBasicMoneyField from "./BasicMoneyField.view";

const BasicMoneyField: React.FC<IBasicMoneyField.IProps> = props => {
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
    return <VBasicMoneyField inputPriceFormat={inputPriceFormat} {...props} />;
};

export default BasicMoneyField;
