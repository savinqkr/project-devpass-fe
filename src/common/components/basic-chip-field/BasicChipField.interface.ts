import { Control } from "react-hook-form";

export namespace IBasicChipField {
    export interface IProps {
        width?: string;
        height?: string;
        spaceWidth: string;
        label?: string;
        chipLabel?: string;
        chipStyle?: "outlined" | "filled";
        chipWidth?: string;
        color?: any; // Theme에 정의된 색상명 Ex) "oceanBlue"
        errMsg?: string;
        isCompleted: boolean;
        isRequired?: boolean;
        isDisabled?: boolean;
    }
    export interface IVProps extends IProps {}
    export interface IForm {}
}
