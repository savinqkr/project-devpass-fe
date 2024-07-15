import { IGetEstimateByPkQuery } from "@domains/estimate/services/estimate.service.interface";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";

export namespace IRepairEstiamteDetail {
    export interface IProps {
        estimateData?: IGetEstimateByPkQuery.IOutput;
        onClickSetFinalEstimateById: () => void;
        finalBtnDisabled: boolean;
    }
    export interface IVProps extends IProps {
        detailColumns: GridColDef[];
        detailRows: readonly GridValidRowModel[];
    }
    export interface IForm {}
}
