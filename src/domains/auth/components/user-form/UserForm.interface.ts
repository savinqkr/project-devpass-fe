import { Dispatch, SetStateAction } from "react";
import {
    Control,
    FieldErrors,
    UseFormGetValues,
    UseFormRegister,
    UseFormWatch,
} from "react-hook-form";

export namespace IUserForm {
    export interface IProps {}
    export interface IVProps extends IProps {
        // useForm
        register: UseFormRegister<IUserForm.IForm>;
        control: Control<IUserForm.IForm, any>;
        errors: FieldErrors<IUserForm.IForm>;
        watch: UseFormWatch<IUserForm.IForm>;
        getValues: UseFormGetValues<IUserForm.IForm>;
        onClickSubmit: () => void;
        // ID & PW check
        idAvailable: boolean | null;
        checkIdAvailable: () => void;
        isPwEqual: boolean | null;
        isPwFieldActive: boolean;
        handleToggleSwitch: () => void;
        // selector options
        roleOptions: { value: string; label: string }[];
        // role chips
        roles: {
            value: string;
            label: string;
        }[];
        onClickAddRoleChip: () => void;
        handleDeleteRoleChip: (role: { value: string; label: string }) => void;
    }
    export interface IForm {
        account_id: string;
        account_pw: string;
        account_pw_check: string;
        name: string;
        department: string;
        position: string;
        email: string;
        contact: string;
        phone: string;
        selectedRoleCode: string;
    }
}
