import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { GridApiCommunity } from "@mui/x-data-grid/internals";
import { MutableRefObject } from "react";
import { Control, UseFormRegister, UseFormSetValue } from "react-hook-form";

export namespace ITechSupportProjectList {
    export interface IProps {}
    export interface IVProps extends IProps {
        isLoading: boolean;
        apiRef: MutableRefObject<GridApiCommunity>;
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        onClickRow?: (pk: string) => void;
        register: UseFormRegister<ITechSupportProjectList.ISearch>;
        setValue: UseFormSetValue<ITechSupportProjectList.ISearch>;
        control: Control<ITechSupportProjectList.ISearch, any>;
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
