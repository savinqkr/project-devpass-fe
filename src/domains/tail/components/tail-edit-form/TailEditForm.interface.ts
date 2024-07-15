import { Dispatch, SetStateAction } from "react";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export namespace ITailEditForm {
    export interface IProps {}
    export interface IVProps extends IProps {
        onClickUpdate: () => void;
        onClickCancel: () => void;
        register: UseFormRegister<IForm>;
        errors: FieldErrors<IForm>;
        control: Control<IForm, any>;
        typeOptions: { label: string; value: string }[];
    }

    export interface IForm {
        type: number;
        name: string;
        contents: string;
    }
}
