import { Control } from "react-hook-form";

export namespace IBasicDatePicker {
    export interface IProps {
        control: Control<any>;
        registerKey: string;
        width?: string;
        height?: string;
        spaceWidth: string;
        label?: string;
        errMsg?: string;
        placeholder?: string;
        isRequired?: boolean;
        isDisabled?: boolean;
    }
    export interface IVProps extends IProps {}
    export interface IForm {}
}
