import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export namespace IFormattedTextfield {
    export interface IProps {
        control: Control<any>;
        registerKey: string;
        isDisabled?: boolean;
        isRequired?: boolean;
        label?: string;
        placeholder?: string;
        msg?: string;
        width?: string;
        height?: string;
        spaceWidth: string;
        defaultValue?: string;
        mask: {
            mask: string;
        }[];
        name: string;
    }
    export interface IVProps extends IProps {
        value: string;
        handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    }
    export interface IForm {}
}
