import { UseFormRegister } from "react-hook-form";

export namespace IInputNote {
    export interface IProps {
        register: UseFormRegister<any>;
        defaultValue?: string;
    }
    export interface IVProps extends IProps {}
}
