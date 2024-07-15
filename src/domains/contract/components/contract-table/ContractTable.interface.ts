import { ProductType } from "@enums";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { Control, UseFormSetValue } from "react-hook-form";

export namespace IContractTable {
    export interface IProps {
        type: ProductType;
        routePath: string;
    }
    export interface IVProps extends IProps {
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        onClickRow: (id: number) => void;
        control: Control<IContractTable.IFilter>;
        setValue: UseFormSetValue<IContractTable.IFilter>;
        clientOptions: { label: string; value: number | string }[];
        projectOptions: { label: string; value: number | string }[];
        onClickSearchBtn: () => void;
        showDeleted: boolean;
        handleShowDeleted: (newState: boolean) => void;
    }

    export interface IFilter {
        client: {
            label: string;
            value: number;
        };
        project: {
            label: string;
            value: number;
        };
    }
}
