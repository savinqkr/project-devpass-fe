import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { Control } from "react-hook-form";

export namespace IRepairReportTable {
    export interface IProps {}
    export interface IVProps extends IProps {
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        onClickRow: (id: number) => void; // 제품 id 상세 페이지로 이동
        onClickSearch: () => void;
        control: Control<IFilter, any>;
        projects: { label: string; value: number | string }[];
        clients: { label: string; value: number | string }[];
        showDeleted: boolean;
        handleShowDeleted: (newState: boolean) => void;
    }

    export interface IFilter {
        project: { label: string; value: number };
        client: { label: string; value: number };
    }
}
