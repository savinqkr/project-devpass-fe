import { ReactNode } from "react";
import { ButtonType } from "src/enums/button-type.enum";

export namespace IBasicButton {
    export interface IProps {
        width: string;
        height?: string;
        type: ButtonType;
        title: string;
        color?: any; // theme.ts 에 정의된 컬러명. string 으로 작성 (Ex. color="oceanBlue")
        isDisabled?: boolean;
        isResponsive?: boolean;
        elevationDisabled?: boolean;
        borderRadius?: string;
        icon?: ReactNode;
        isSubmitBtn?: boolean;
        onClick?: () => void;
    }
    export interface IVProps extends IProps {}
    export interface IForm {}
}
