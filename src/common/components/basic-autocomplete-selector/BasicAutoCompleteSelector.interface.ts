import { Control } from "react-hook-form";

export namespace IBasicAutoCompleteSelector {
    export interface IProps {
        control: Control<any>;
        registerKey: string;
        options: { value: string | number; label: string }[];
        size?: "small" | "medium";
        width?: string;
        height?: string;
        spaceWidth: string;
        label?: string;
        isRequired?: boolean;
        isDisabled?: boolean;
        placeholder?: string;
        errMsg?: string;
    }
    export interface IVProps extends IProps {}
    export interface IForm {}
}
