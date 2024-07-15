import { Control } from "react-hook-form";

export namespace IBasicFromToDatePicker {
    export interface IProps {
        fromRegisterKey: string;
        toRegisterKey: string;
        control: Control<any>;
        width?: string;
        height?: string;
        fieldWidth?: string;
        spaceWidth: string;
        label?: string;
        errMsg?: {
            from?: string;
            to?: string;
        };

        fromPlaceholder?: string;
        toPlaceholder?: string;
        isRequired?: boolean;
        isDisabled?: boolean;
        iconColor?: any;
        icon?: any;
    }
    export interface IVProps extends IProps {}
    export interface IForm {}
}
