import { Control } from "react-hook-form";

export namespace ISearchTextfield {
    export interface IProps {
        control: Control<any>;
        registerKey: string;
        options: IOption[];
        size?: "small" | "medium";
        width?: string;
        height?: string;
        spaceWidth: string;
        label?: string;
        isRequired?: boolean;
        isDisabled?: boolean;
        placeholder?: string;
        isClearBtn?: boolean;
        isRoundStyle?: boolean;
        errMsg?: string;
    }
    export interface IVProps extends IProps {}
    export interface IOption {
        value: string | number;
        label: string;
    }
}
