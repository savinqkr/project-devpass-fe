import { GridRenderCellParams } from "@mui/x-data-grid";

export namespace ITextareaCell {
    export interface IProps extends GridRenderCellParams<any, string> {}
    export interface IVProps extends IProps {
        numberOfLines: number;
        anchorEl: HTMLElement | null | undefined;
        handleMouseEnter: (event: React.MouseEvent<HTMLElement>) => void;
        handleMouseLeave: () => void;
    }
    export interface IForm {}
}
