import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

export namespace ITableWithLabel {
    export interface IProps {
        label?: string;
        spaceWidth: string;
        isRequired?: boolean;
        apiRef: MutableRefObject<GridApiCommunity>;
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        setRows: Dispatch<SetStateAction<readonly GridValidRowModel[]>>;
        handleClickAddRow: () => void;
        handleClickDeleteRow: () => void;
    }
    export interface IVProps extends IProps {}
    export interface IForm {}
}
