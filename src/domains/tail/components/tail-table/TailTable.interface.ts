import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { Control } from "react-hook-form";

export namespace ITailTable {
    export interface IProps {}
    export interface IVProps extends IProps {
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        allTailLength: number;
        control: Control<IFilter, any>;
        typeOptions: {
            label: string;
            value: string;
        }[];
        onClickRow: (id: number) => void; // 제품 id 상세 페이지로 이동
        showDeleted: boolean;
        handleShowDeleted: (newState: boolean) => void;
    }

    export interface ITail {
        no: number;
        id: number;
        type: string;
        name: string;
        updated_at: string;
    }

    export interface IFilter {
        type: number | string;
    }
}
