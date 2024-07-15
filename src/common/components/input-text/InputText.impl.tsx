import { useEffect, useState } from "react";
import { IInputText } from "./InputText.interface";
import VInputText from "./InputText.view";

const InputText: React.FC<IInputText.IProps> = props => {
    const { defaultValue } = props;
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(defaultValue?.toString() ?? "");
    }, [defaultValue]);

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
        <VInputText
            inputPriceFormat={inputPriceFormat}
            value={value}
            setValue={setValue}
            {...props}
        />
    );
};

export default InputText;
