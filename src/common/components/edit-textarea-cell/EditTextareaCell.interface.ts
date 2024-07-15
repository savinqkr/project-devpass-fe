import { GridRenderEditCellParams } from "@mui/x-data-grid";
import { GridStateColDef } from "@mui/x-data-grid/internals";
import { ChangeEventHandler, Dispatch, SetStateAction } from "react";

export namespace IEditTextareaCell {
    export interface IProps extends GridRenderEditCellParams<any, string> {}
    export interface IVProps extends IProps {
        handleRef: (el: HTMLElement | null) => void;
        anchorEl: HTMLElement | null | undefined;
        colDef: GridStateColDef;
        valueState: string | undefined;
        handleChange: ChangeEventHandler<
            HTMLTextAreaElement | HTMLInputElement
        >;
        setInputRef: Dispatch<SetStateAction<HTMLInputElement | null>>;
    }
    export interface IForm {}
}
