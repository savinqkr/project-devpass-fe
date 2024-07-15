import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

export namespace IMuiDataGrid {
    export interface IProps {
        rows: readonly GridValidRowModel[];
        columns: GridColDef[];
        rowLimit?: number;
        onClickRow?: any;
        onRowSelectionModelChange?: any;
        initialPage?: number;
        checkboxSelection?: boolean;
        apiRef?: MutableRefObject<GridApiCommunity>;
        msg?: string;
    }
    export interface IVProps extends IProps {}
}
