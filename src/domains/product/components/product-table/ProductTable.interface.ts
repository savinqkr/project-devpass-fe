import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { Control } from "react-hook-form";

export namespace IProductTable {
    export interface IProps {}
    export interface IVProps extends IProps {
        header: GridColDef[];
        productsData: readonly GridValidRowModel[];
        typeOptions: { label: string; value: string }[];
        control: Control<IProductTable.IFilter>;
        onClickRow: (id: number) => void; // 제품 id 상세 페이지로 이동
        showDeleted: boolean;
        handleShowDeleted: (newState: boolean) => void;
    }

    export interface IProduct {
        no: number;
        id: number;
        name: string;
        unit: string;
        // edition: string;
        updated_at: string;
    }

    export interface IFilter {
        type: string;
    }
}
