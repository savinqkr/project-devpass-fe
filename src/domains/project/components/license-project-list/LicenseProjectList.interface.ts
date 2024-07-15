import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { Control, UseFormRegister, UseFormSetValue } from "react-hook-form";

export namespace ILicenseProjectList {
    export interface IProps {}
    export interface IVProps extends IProps {
        isLoading: boolean;
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        onClickRow?: (pk: string) => void;
        control: Control<ILicenseProjectList.ISearch, any>;
        register: UseFormRegister<ILicenseProjectList.ISearch>;
        setValue: UseFormSetValue<ILicenseProjectList.ISearch>;
        onClickSearch: () => void;
        projectNameOptions: string[];
        clientOptions: string[];
        contractorOptions: string[];
        showDeleted: boolean;
        handleChange: (event: any) => void;
    }
    export interface ISearch {
        project_name: string; // 사업명
        client_name: string; // 고객사명
        contractor_name: string; // 계약사명
    }
}
