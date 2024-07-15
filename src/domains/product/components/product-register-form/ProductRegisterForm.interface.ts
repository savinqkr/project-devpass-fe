import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export namespace IProductRegisterForm {
    export interface IProps {}
    export interface IVProps extends IProps {
        onSubmit: () => void;
        register: UseFormRegister<IForm>;
        errors: FieldErrors<IForm>;
        control: Control<IForm, any>;
        typeOptions: { label: string; value: string }[];
        purposeOptions: { label: string; value: string }[];
        classOptions: { label: string; value: string }[];
        unitOptions: { label: string; value: string }[];
    }

    export interface IForm {
        type: number;
        purpose: number;
        class: number;
        name: string;
        unit: number;
        price: string;
        note: string;
    }
}
