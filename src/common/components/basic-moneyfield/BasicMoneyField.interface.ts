import { Control } from "react-hook-form";

export namespace IBasicMoneyField {
    export interface IProps {
        control: Control<any>;
        registerKey: string;
        width?: string;
        height?: string;
        spaceWidth: string;
        label?: string;
        placeholder?: string;
        isRequired?: boolean;
        isDisabled?: boolean;
        isMultiline?: boolean;
        noHeader?: boolean;
        rows?: number;
        minRows?: number;
        maxRows?: number;
        defaultValue?: string;
        startAdornment?: string;
        endAdornment?: string;
        errMsg?: string;
    }
    export interface IVProps extends IProps {
        inputPriceFormat: (str: string) => string;
    }
    export interface IForm {}
}
