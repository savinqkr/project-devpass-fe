import { ProductType } from "@enums";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { Control } from "react-hook-form";

export namespace ISalesTable {
    export interface IProps {
        type: ProductType;
    }
    export interface IVProps extends IProps {
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        onClickRow: (id: number) => void; // 제품 id 상세 페이지로 이동
        onClickSearch: () => void;
        control: Control<IFilter, any>;
        clients: { label: string; value: number | string }[];
        projects: { label: string; value: number | string }[];
        employees: { label: string; value: number | string }[];
        showDeleted: boolean;
        handleShowDeleted: (newState: boolean) => void;
    }

    export interface IFilter {
        client: { label: string; value: number };
        project: { label: string; value: number };
        employee: { label: string; value: number };
    }
}
