import { UseFormRegister, UseFormSetValue } from "react-hook-form";

export namespace ISearchAutoComplete {
    export interface IProps {
        width?: string;
        placeholder?: string;
        options: Array<string>;
        registerKey: string;
        register: UseFormRegister<any>;
        setValue: UseFormSetValue<any>;
    }
    export interface IVProps extends IProps {}
}
