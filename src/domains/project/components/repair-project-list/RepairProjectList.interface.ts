import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { Control, UseFormRegister, UseFormSetValue } from "react-hook-form";

export namespace IRepairProjectList {
    export interface IProps {}
    export interface IVProps extends IProps {
        isLoading: boolean;
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        onClickRow?: (pk: string) => void;
        control: Control<IRepairProjectList.ISearch, any>;
        register: UseFormRegister<IRepairProjectList.ISearch>;
        setValue: UseFormSetValue<IRepairProjectList.ISearch>;
        onClickSearch: () => void;
        clientOptions: string[];
        projectNameOptions: string[];
        contractorOptions: string[];
        consultantOptions: string[];
        showDeleted: boolean;
        handleChange: (event: any) => void;
    }
    export interface ISearch {
        project_name: string; // 사업명
        client_name: string; // 고객사명
        contractor_name: string; // 계약사명
        consultant_name: string; // 엔지니어(컨설턴트)명
    }
}
