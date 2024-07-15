import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

export namespace IUserList {
    export interface IProps {}
    export interface IVProps extends IProps {
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        onClickRow?: (id: number) => void;
        register: UseFormRegister<IUserList.ISearch>;
        setValue: UseFormSetValue<IUserList.ISearch>;
        onClickSearch: () => void;
        userOptions: string[];
        roleOptions: string[];
        showDeleted: boolean;
        handleChange: (event: any) => void;
    }
    export interface ISearch {
        role_name: string;
        user_name: string;
    }
}
