import { UseFormRegister } from "react-hook-form";

export namespace ILoginForm {
    export interface IProps {}
    export interface IVProps extends IProps {
        register: UseFormRegister<ILoginForm.IForm>;
        onClickLogin: () => void;
        isPwVisible: boolean;
        onClickShowPw: () => void;
    }
    export interface IForm {
        id: string;
        password: string;
    }
}
