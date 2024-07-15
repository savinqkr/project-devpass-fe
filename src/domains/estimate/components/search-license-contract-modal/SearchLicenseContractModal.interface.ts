import {
    GridColDef,
    GridRowSelectionModel,
    GridValidRowModel,
} from "@mui/x-data-grid";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { MutableRefObject } from "react";
import { Control, UseFormRegister, UseFormSetValue } from "react-hook-form";

export namespace ISearchLicenseContractModal {
    export interface IProps {
        // register: UseFormRegister<ISearchLicenseContractModal.ISearch>;
        // control: Control<ISearchLicenseContractModal.ISearch, any>;
        // setValue: UseFormSetValue<ISearchLicenseContractModal.ISearch>;
        // // companyNameOptions: string[];
        // // projectNameOptions: string[];
        // onClickSearch: () => void;
        // // onClickRow: (pk: string) => void;
        // columns: GridColDef[];
        // rows: readonly GridValidRowModel[];
        // dataGridApiRef: MutableRefObject<GridApiCommunity>;
        // onClickApply: () => void;
    }
    export interface IVProps extends IProps {
        register: UseFormRegister<ISearchLicenseContractModal.ISearch>;
        control: Control<ISearchLicenseContractModal.ISearch, any>;
        setValue: UseFormSetValue<ISearchLicenseContractModal.ISearch>;
        // companyNameOptions: string[];
        // projectNameOptions: string[];
        // onClickSearch: () => void;
        // onClickRow: (pk: string) => void;
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        dataGridApiRef: MutableRefObject<GridApiCommunity>;
        onClickApply: () => void;
    }
    export interface ISearch {
        license_project_name: string;
    }
}
