import { Control } from "react-hook-form";

export namespace IBasicSelector {
    export interface IProps {
        control: Control<any>;
        registerKey: string;
        options: { value: any; label: string }[];
        width?: string;
        height?: string;
        spaceWidth: string;
        label?: string;
        isRequired?: boolean;
        isDisabled?: boolean;
        placeholder?: string;
        borderRadius?: string;
        msg?: string;
    }
    export interface IVProps extends IProps {}
    export interface IForm {}
}
