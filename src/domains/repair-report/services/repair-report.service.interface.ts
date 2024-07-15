import {
    DeleteRepairReportMutation,
    GetAllRepairReportQuery,
    GetRepairReportOneByIdQuery,
    RegisterRepairReportMutation,
    UpdateRepairReportMutation,
} from "./graphql";

// [ RepairReport 생성 ]
export namespace IRegisterRepairReport {
    export interface IInput extends RegisterRepairReportMutation.IVariable {}
    export interface IOutput extends RegisterRepairReportMutation.IResponse {}
}

// [ RepairReport 조회 ]
export namespace IGetAllRepairReport {
    export interface IInput extends GetAllRepairReportQuery.IVariable {}
    // export interface IOutput extends GetAllRepairReportQuery.IResponse {}
    export interface IOutput
        extends Array<
            | {
                  id: number;
                  inspector_id: number;
                  inspector: {
                      id: number;
                      name: string;
                      deleted_at: Date;
                  };
                  repair_date: Date;
                  repair_project_id: number;
                  project: {
                      id: number;
                      name: string;
                      deleted_at: Date;
                  };
                  created_at: Date;
                  created_by: number;
                  updated_at: Date;
                  updated_by: number;
                  deleted_at: Date;
              }
            | undefined
        > {}
}

// [ RepairReport 조회: ID ]
export namespace IGetRepairReportOneById {
    export interface IInput extends GetRepairReportOneByIdQuery.IVariable {}
    export interface IOutput extends GetRepairReportOneByIdQuery.IResponse {}
}

// [ RepairReport 수정: ID ]
export namespace IUpdateRepairReport {
    export interface IInput extends UpdateRepairReportMutation.IVariable {}
    export interface IOutput extends UpdateRepairReportMutation.IResponse {}
}

// [ RepairReport 삭제: ID ]
export namespace IDeleteRepairReportById {
    export interface IInput extends DeleteRepairReportMutation.IVariable {}
    export interface IOutput extends DeleteRepairReportMutation.IResponse {}
}

// -------------------------------------------------------------------------------------------------
export interface IRepairReportService {
    // [ RepairReport 생성 ]
    registerRepairReport(
        args: IRegisterRepairReport.IInput
    ): Promise<IRegisterRepairReport.IOutput>;

    // [ RepairReport 조회 ]
    getAllRepairReport(
        args: IGetAllRepairReport.IInput
    ): Promise<IGetAllRepairReport.IOutput>;

    // [ RepairReport 조회: ID ]
    getRepairReportOneById(
        args: IGetRepairReportOneById.IInput
    ): Promise<IGetRepairReportOneById.IOutput>;

    // [ RepairReport 수정: ID ]
    updateRepairReport(
        args: IUpdateRepairReport.IInput
    ): Promise<IUpdateRepairReport.IOutput>;

    // [ RepairReport 삭제: ID ]
    deleteRepairReportOneById(
        args: IDeleteRepairReportById.IInput
    ): Promise<IDeleteRepairReportById.IOutput>;
}
