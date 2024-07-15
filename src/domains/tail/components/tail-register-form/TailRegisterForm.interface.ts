import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export namespace ITailRegisterForm {
    export interface IProps {}
    export interface IVProps extends IProps {
        onSubmit: () => void;
        register: UseFormRegister<ITailRegisterForm.IForm>;
        errors: FieldErrors<ITailRegisterForm.IForm>;
        control: Control<IForm, any>;
        typeOptions: { label: string; value: string }[];
    }

    export interface IForm {
        type: number;
        name: string;
        contents: string;
    }
}
