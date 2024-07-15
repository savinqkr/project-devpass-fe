import { ModalMode } from "@enums";
import { Dispatch, SetStateAction } from "react";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export namespace IRoleForm {
    export interface IProps {
        isExecuted: boolean;
        setIsExecuted: Dispatch<SetStateAction<boolean>>;
        mode: ModalMode;
        code?: number;
        title: string;
        onClickClose: () => void;
    }
    export interface IVProps extends IProps {
        errors: FieldErrors<IRoleForm.IForm>;
        control: Control<IRoleForm.IForm, any>;
        register: UseFormRegister<IRoleForm.IForm>;
        onClickRegister: () => void;
        onClickEdit: () => void;
        specialRoleOptions: {
            label: string;
            value: number;
        }[];
    }
    export interface IForm {
        value: string;
        special_role_code: string;
    }
}
