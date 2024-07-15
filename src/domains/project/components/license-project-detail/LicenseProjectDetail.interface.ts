import { IGetProjectByPkQuery } from "@domains/project/service/project.service.interface";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";

export namespace ILicenseProjectDetail {
    export interface IProps {
        projectData?: IGetProjectByPkQuery.IOutput;
        partnerRows: readonly GridValidRowModel[];
        employeeRows: readonly GridValidRowModel[];
        estimateRows: readonly GridValidRowModel[];
        contractRows: readonly GridValidRowModel[];
        salesRows: readonly GridValidRowModel[];
    }
    export interface IVProps extends IProps {
        partnerColumns: GridColDef[];
        employeeColumns: GridColDef[];
        estimateColumns: GridColDef[];
        contractColumns: GridColDef[];
        salesColumns: GridColDef[];
        onClickPartnerRow: (pk: string) => void;
        onClickEmployeeRow: (pk: string) => void;
        onClickEstimateRow: (pk: string) => void;
        onClickContractRow: (pk: string) => void;
        onClickSalesRow: (pk: string) => void;
        tabValue: number;
        handleChangeTab: (
            event: React.SyntheticEvent,
            newValue: number
        ) => void;
        onClickCancelProject: () => void;
    }
    export interface IForm {}
}
