import React from "react";
import { ButtonType } from "src/enums/button-type.enum";

export namespace IBasicIconButton {
    export interface IProps {
        width: string;
        height?: string;
        type: ButtonType;
        color?: any; // theme.ts 에 정의된 컬러명. string 으로 작성 (Ex. color="oceanBlue")
        isDisabled?: boolean;
        isSubmitBtn?: boolean;
        onClick?: () => void;
        icon: React.ReactNode;
        borderRadius?: string;
    }
    export interface IVProps extends IProps {}
    export interface IForm {}
}
