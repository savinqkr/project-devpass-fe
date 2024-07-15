import { Control } from "react-hook-form";

export namespace IBasicMoneyDatePicker {
    export interface IProps {
        moneyRegisterKey: string;
        dateRegisterKey: string;
        control: Control<any>;
        width?: string;
        height?: string;
        spaceWidth: string;
        label?: string;
        errMsg?: {
            money?: string;
            date?: string;
        };
        placeholder?: string;
        isRequired?: boolean;
        isDisabled?: boolean;
        startAdornment?: string;
        endAdornment?: string;
    }
    export interface IVProps extends IProps {
        inputPriceFormat: (str: string) => string;
    }
    export interface IForm {}
}
