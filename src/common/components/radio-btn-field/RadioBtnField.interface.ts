import { Control, UseFormRegister } from "react-hook-form";

export namespace IRadioBtnField {
    export interface IProps {
        label: string;
        isRequired?: boolean;
        spaceWidth: string;
        options: { label: string; value: any }[];
        defaultValue?: any;
        control: Control<any>;
        registerKey: string;
    }
    export interface IVProps extends IProps {}
    export interface IForm {}
}
