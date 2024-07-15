import { Control } from "react-hook-form";

export namespace IBasicMarkdown {
    export interface IProps {
        control: Control<any>;
        registerKey: string;
        label?: string;
        isRequired?: boolean;
        width?: string;
        height?: string;
        spaceWidth: string;
        errMsg?: string;
    }
    export interface IVProps extends IProps {}
}
