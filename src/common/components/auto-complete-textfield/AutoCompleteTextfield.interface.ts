import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";

export namespace IAutoCompleteTextfield {
    export interface IProps {
        registerKey: string;
        control: Control<any, any>;
        watch: UseFormWatch<any>;
        msg?: string;
        options: Array<string>;
        label?: string;
        width?: string;
        height?: string;
        spaceWidth: string;
        placeholder?: string;
        isRequired: boolean;
        isDisabled?: boolean;
        noHeader?: boolean;
    }
    export interface IVProps extends IProps {}
}
