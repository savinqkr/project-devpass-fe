import { Control } from "react-hook-form";

export namespace ISearchSelector {
    export interface IProps {
        control: Control<any>;
        registerKey: string;
        options: IOption[];
        width?: string;
        isDisabled?: boolean;
        placeholder?: string;
    }
    export interface IVProps extends IProps {}

    export interface IOption {
        value: any;
        label: any;
    }
}
