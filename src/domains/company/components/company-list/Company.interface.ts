import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";
import { Control, UseFormRegister, UseFormSetValue } from "react-hook-form";

export namespace ICompanyList {
    export interface IProps {}
    export interface IVProps extends IProps {
        columns: GridColDef[];
        rows: readonly GridValidRowModel[];
        onClickRow?: (id: number) => void;
        control: Control<ICompanyList.ISearch, any>;
        register: UseFormRegister<ICompanyList.ISearch>;
        setValue: UseFormSetValue<ICompanyList.ISearch>;
        onClickSearch: () => void;
        companyNameOptions: string[];
        // companyTypeOptions: {
        //     value: string;
        //     label: string;
        // }[];
        showDeleted: boolean;
        handleChange: (event: any) => void;
    }
    export interface ISearch {
        company_name: string;
        company_type: string;
    }
}
