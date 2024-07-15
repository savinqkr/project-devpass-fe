import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { MutableRefObject } from "react";
import { Control, UseFormRegister, UseFormSetValue } from "react-hook-form";

export namespace ISearchEstimateModal {
    export interface IProps {}
    export interface IVProps extends IProps {
        register: UseFormRegister<ISearchEstimateModal.ISearch>;
        control: Control<ISearchEstimateModal.ISearch, any>;
        setValue: UseFormSetValue<ISearchEstimateModal.ISearch>;
        companyNameOptions: string[];
        projectNameOptions: string[];
        destinationOptions: string[];
        onClickSearch: () => void;
        onClickRow: (pk: string) => void;
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        dataGridApiRef: MutableRefObject<GridApiCommunity>;
        onClickApply: () => void;
    }
    export interface ISearch {
        project_name: string;
        destination: string;
        client_name: string;
    }
}
