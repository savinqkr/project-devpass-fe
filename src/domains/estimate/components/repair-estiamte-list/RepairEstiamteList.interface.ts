import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { Control, UseFormRegister, UseFormSetValue } from "react-hook-form";

export namespace IRepairEstiamteList {
    export interface IProps {}
    export interface IVProps extends IProps {
        isLoading: boolean;
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        onClickRow?: (pk: string) => void;
        register: UseFormRegister<IRepairEstiamteList.ISearch>;
        setValue: UseFormSetValue<IRepairEstiamteList.ISearch>;
        control: Control<IRepairEstiamteList.ISearch, any>;
        onClickSearch: () => void;
        clientOptions: string[];
        caseNameOptions: string[];
        projectOptions: string[];
        destinationOptions: string[];
        showDeleted: boolean;
        handleChange: (event: any) => void;
    }
    export interface ISearch {
        case_name: string; // 건명
        client_name: string; // 고객사명
        project_name: string; // 사업명
        destination: string; // 수신처
    }
}
