import { GridRenderEditCellParams } from "@mui/x-data-grid";

export namespace IIntOnlyEditInputCell {
    export interface IProps extends GridRenderEditCellParams<any, string> {}
    export interface IVProps extends IProps {
        handleChange: (event: any) => void;
    }
    export interface IForm {}
}
