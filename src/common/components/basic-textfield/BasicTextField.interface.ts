import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

export namespace IBasicTextField {
    export interface IProps {
        registerKey: string;
        register: UseFormRegister<any>;
        errors?: FieldErrors<any>;
        validate?: any;
        required?: any;
        onChange?: any;
        pattern?: any;
        minLength?: any;
        width?: string;
        height?: string;
        spaceWidth: string;
        label?: string;
        showMsg?: boolean | null;
        isErrMsg?: boolean;
        msg?: string;
        placeholder?: string;
        isRequired?: boolean | string;
        isPassword?: boolean;
        isDisabled?: boolean;
        isMultiline?: boolean;
        rows?: number;
        minRows?: number;
        maxRows?: number;
        isNumber?: boolean;
        noHeader?: boolean;
        noBorder?: boolean;
        startAdornment?: string; // Field 왼쪽에 단위 표시
        endAdornment?: string; // Field 오른쪽에 단위 표시
        allowedPattern?: RegExp;
    }
    export interface IVProps extends IProps {
        handleBeforeInput?: (event: any) => void;
    }
    export interface IForm {}
}
