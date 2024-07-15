import {
    GridColDef,
    GridEventListener,
    GridValidRowModel,
} from "@mui/x-data-grid";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

export namespace IEditableMuiGird {
    export interface IProps {
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        setRows: Dispatch<SetStateAction<readonly GridValidRowModel[]>>;
        apiRef: MutableRefObject<GridApiCommunity>;
        handleClickAddRow: () => void;
        handleClickDeleteRow: () => void;
        onCellEditStart?: GridEventListener<"cellEditStart">;
    }
    export interface IVProps extends IProps {}

    export interface EditToolbarProps {
        handleClickAddRow: () => void;
        handleClickDeleteRow: () => void;
    }
}
