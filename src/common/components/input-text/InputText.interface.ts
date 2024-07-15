import { Dispatch, SetStateAction } from "react";
import { UseFormRegister } from "react-hook-form";

export namespace IInputText {
    export interface IProps {
        label: string;
        type: string; // Form Interface에서 할당할 대상 ex) name, class...
        isRequired: boolean;
        isText: boolean; // Input Type => true: text | false: number
        register: UseFormRegister<any>;
        defaultValue?: string;
    }
    export interface IVProps extends IProps {
        inputPriceFormat: (str: string) => string;
        value: string;
        setValue: Dispatch<SetStateAction<string>>;
    }
}
