import {
    DeleteEstimateMutation,
    EditEstimateMutation,
    GetAllEstimatesQuery,
    GetEstimateByPkQuery,
    GetEstimateCountByProjectQuery,
    GetFinalEstiamteDetailsQuery,
    GetFinalEstimateByProjectQuery,
    GetFinalEstimateDetailsBySelectedLicenseContractsQuery,
    GetRecentEstimateQuery,
    RegisterEstimateMutation,
    SetFinalEstimateByPkMutation,
} from "./graphql";
import { GetEstimateCountQuery } from "./graphql/queries/get-estimate-count.query";

export namespace IGetAllEstimatesQuery {
    export interface IInput extends GetAllEstimatesQuery.IVariable {}
    export interface IOutput extends GetAllEstimatesQuery.IResponse {}
}
export namespace IGetEstimateByPkQuery {
    export interface IInput extends GetEstimateByPkQuery.IVariable {}
    export interface IOutput extends GetEstimateByPkQuery.IResponse {}
}

export namespace IGetEstimateCountByProjectQuery {
    export interface IInput extends GetEstimateCountByProjectQuery.IVariable {}
    export interface IOutput {
        count: number;
    }
}
export namespace IGetEstimateCountQuery {
    export interface IInput extends GetEstimateCountQuery.IVariable {}
    export interface IOutput {
        count: number;
    }
}
export namespace IGetRecentEstimateQuery {
    export interface IInput extends GetRecentEstimateQuery.IVariable {}
    export interface IOutput extends GetRecentEstimateQuery.IResponse {}
}

export namespace IGetFinalEstimateByProjectQuery {
    export interface IInput extends GetFinalEstimateByProjectQuery.IVariable {}
    export interface IOutput extends GetFinalEstimateByProjectQuery.IResponse {}
}

export namespace IGetFinalEstiamteDetailsQuery {
    export interface IInput extends GetFinalEstiamteDetailsQuery.IVariable {}
    // export interface IOutput extends GetFinalEstiamteDetailsQuery.IResponse {}
    export interface IOutput {
        details: {
            license_project_id: number;
            license_project_name: string;
            contract_id: number;
            contract_period_start: string; // 라이선스 계약 시작일 ( 도입년도 )
            contract_period_end: string; // 라이선스 계약 종료일
            type: string;
            purpose: string;
            class: string;
            product: string;
            details: string;
            unit: string;
            amount: number;
            price: string;
            standard_price: string;
            supply_price: string;
            repair_project_start_date: string; // 유지보수 사업 시작일 ( 시작일 )
            repair_project_end_date: string; // 유지보수 사업 종료일 ( 종료일 )
            note: string;
        }[];
    }
}
export namespace IGetFinalEstimateDetailsBySelectedLicenseContracts {
    export interface IInput
        extends GetFinalEstimateDetailsBySelectedLicenseContractsQuery.IVariable {}
    // export interface IOutput
    //     extends GetFinalEstimateDetailsBySelectedLicenseContractsQuery.IResponse {}

    export interface IOutput {
        details: {
            repair_rate: number | undefined;
            repair_last_year_rate: number | undefined;
            repair_project_start_date: string; // 유지보수 사업 시작일 ( 시작일 )
            repair_project_end_date: string; //
            license_project_id: number;
            license_project_name: string;
            license_contract_id: number;
            contract_period_start: string; // 라이선스 계약 시작일 ( 도입년도 )
            contract_period_end: string; // 라이선스 계약 종료일
            type: string;
            purpose: string;
            class: string;
            product_type: string;
            product: string;
            details: string;
            unit: string;
            amount: number;
            price: string;
            standard_price: string;
            supply_price: string;
            note: string;
        }[];
    }
}
export namespace IEditEstimateMutation {
    export interface IInput extends EditEstimateMutation.IVariable {}
    export interface IOutput extends EditEstimateMutation.IResponse {}
}

export namespace IDeleteEstimateMutation {
    export interface IInput extends DeleteEstimateMutation.IVariable {}
    export interface IOutput extends DeleteEstimateMutation.IResponse {}
}

export namespace IRegisterEstimateMutation {
    export interface IInput extends RegisterEstimateMutation.IVariable {}
    export interface IOutput extends RegisterEstimateMutation.IResponse {}
}

export namespace ISetFinalEstimateByPkMutation {
    export interface IInput extends SetFinalEstimateByPkMutation.IVariable {}
    export interface IOutput extends SetFinalEstimateByPkMutation.IResponse {}
}

export interface IEstimateService {
    getAllEstimates(
        where: IGetAllEstimatesQuery.IInput
    ): Promise<IGetAllEstimatesQuery.IOutput>;
    getEstimateByPk(
        where: IGetEstimateByPkQuery.IInput
    ): Promise<IGetEstimateByPkQuery.IOutput>;
    getEstimateCountByProject(
        where: IGetEstimateCountByProjectQuery.IInput
    ): Promise<IGetEstimateCountByProjectQuery.IOutput>;
    getEstimateCount(): Promise<IGetEstimateCountQuery.IOutput>;
    getRecentEstimate(
        where: IGetRecentEstimateQuery.IInput
    ): Promise<IGetRecentEstimateQuery.IOutput>;
    getFinalEstimateByProject(
        where: IGetFinalEstimateByProjectQuery.IInput
    ): Promise<IGetFinalEstimateByProjectQuery.IOutput>;
    getFinalEstimateDetails(
        where: IGetFinalEstiamteDetailsQuery.IInput
    ): Promise<IGetFinalEstiamteDetailsQuery.IOutput>;
    getFinalEstimateDetailsBySelectedLicenseContracts(
        where: IGetFinalEstimateDetailsBySelectedLicenseContracts.IInput
    ): Promise<IGetFinalEstimateDetailsBySelectedLicenseContracts.IOutput>;
    registerEstimate(
        args: IRegisterEstimateMutation.IInput
    ): Promise<IRegisterEstimateMutation.IOutput>;
    editEstimate(
        args: IEditEstimateMutation.IInput
    ): Promise<IEditEstimateMutation.IOutput>;
    deleteEstimate(
        args: IDeleteEstimateMutation.IInput
    ): Promise<IDeleteEstimateMutation.IOutput>;
    setFinalEstimateByPkMutation(
        args: ISetFinalEstimateByPkMutation.IInput
    ): Promise<ISetFinalEstimateByPkMutation.IOutput>;
}
