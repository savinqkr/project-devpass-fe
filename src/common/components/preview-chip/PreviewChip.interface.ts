import { ReactNode } from "react";

export namespace IPreviewChip {
    export interface IProps {
        file: File;
        onDelete: () => void;
    }
    export interface IVProps extends IProps {
        preview: ReactNode;
    }
    export interface IForm {}
}
