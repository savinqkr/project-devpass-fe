import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { Dayjs } from "dayjs";
import { Control } from "react-hook-form";

export namespace IRenewalTable {
    export interface IProps {}
    export interface IVProps extends IProps {
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        onClickRow: (id: number) => void; // 제품 id 상세 페이지로 이동
        onClickSearch: () => void;
        control: Control<IFilter, any>;
        types: { label: string; value: string }[];
        projects: { label: string; value: number | string }[];
        clients: { label: string; value: number | string }[];
    }
    export interface IFilter {
        type: string;
        project: { label: string; value: number };
        client: { label: string; value: number };
        start_date: Dayjs;
        end_date: Dayjs;
    }
}
