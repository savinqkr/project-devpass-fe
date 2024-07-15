import {
    DeleteSalesByIdMutation,
    GetAllSalesQuery,
    GetGoalByYearQuery,
    GetOneSalesByIdQuery,
    GetSalesStatusQuery,
    GetUniqueYearsQuery,
    RegisterGoalMutation,
    RegisterSalesMutation,
    UpdatedGoalMutation,
    UpdatedSalesByIdMutation,
} from "./graphql";

// [ Sales 생성 ]
export namespace IRegisterSales {
    export interface IInput extends RegisterSalesMutation.IVariable {}
    export interface IOutput extends RegisterSalesMutation.IResponse {}
}

// [ 모든 Sale 조회 ]
export namespace IGetAllSales {
    export interface IInput extends GetAllSalesQuery.IVariable {}
    // export interface IOutput extends GetAllSalesQuery.IResponse {}
    export interface IOutput
        extends Array<
            | {
                  id: number;
                  client: {
                      name: string;
                  };
                  project: {
                      id: string;
                      name: string;
                      is_canceled: boolean;
                  };
                  sales_representative: {
                      name: string;
                  };
                  first_sales: string;
                  first_sales_claim_date: Date;
                  second_sales: string;
                  second_sales_claim_date: Date;
                  last_sales: string;
                  last_sales_claim_date: Date;
                  updated_at: Date;
                  deleted_at: Date;
              }
            | undefined
        > {}
}

// [ Sales 조회: id ]
export namespace IGetOneSalesById {
    export interface IInput extends GetOneSalesByIdQuery.IVariable {}
    export interface IOutput extends GetOneSalesByIdQuery.IResponse {}
}

// [ Sales 수정: id ]
export namespace IUpdatedSalesById {
    export interface IInput extends UpdatedSalesByIdMutation.IVariable {}
    export interface IOutput extends UpdatedSalesByIdMutation.IResponse {}
}

// [ Sales 삭제: id ]
export namespace IDeleteSalesById {
    export interface IInput extends DeleteSalesByIdMutation.IVariable {}
    export interface IOutput extends DeleteSalesByIdMutation.IResponse {}
}

// [ Sales Status Goal 생성 ]
export namespace IRegisterGoal {
    export interface IInput extends RegisterGoalMutation.IVariable {}
    export interface IOutput extends RegisterGoalMutation.IResponse {}
}

// [ Sales Status Goal 수정 ]
export namespace IUpdatedGoal {
    export interface IInput extends UpdatedGoalMutation.IVariable {}
    export interface IOutput extends UpdatedGoalMutation.IResponse {}
}

// [ Sales Status Goal 조회: year ]
export namespace IGetGoalByYear {
    export interface IInput extends GetGoalByYearQuery.IVariable {}
    export interface IOutput extends GetGoalByYearQuery.IResponse {}
}

// [ Sales Status 데이터 조회: year ]
export namespace IGetSalesStatus {
    export interface IInput extends GetSalesStatusQuery.IVariable {}
    export interface IOutput extends GetSalesStatusQuery.IResponse {}
}

// [ Unique Years 조회 ]
export namespace IGetUniqueYears {
    export interface IInput extends GetUniqueYearsQuery.IVariable {}
    export interface IOutput extends GetUniqueYearsQuery.IResponse {}
}

// -------------------------------------------------------------------------------------------------
export interface ISalesService {
    // [ Sales 생성 ]
    registerSales(args: IRegisterSales.IInput): Promise<IRegisterSales.IOutput>;

    // [ 모든 Sale 조회: Filter ( client_id | project_id)  ]
    getAllSales(
        args: IGetAllSales.IInput,
        client_id?: number,
        project_id?: string,
        sales_representative_id?: number
    ): Promise<IGetAllSales.IOutput>;

    // [ Sales 조회: id ]
    getOneSalesById(
        args: IGetOneSalesById.IInput
    ): Promise<IGetOneSalesById.IOutput>;

    // [ Sales 수정: id ]
    updatedSalesById(
        args: IUpdatedSalesById.IInput
    ): Promise<IUpdatedSalesById.IOutput>;

    // [ Sales 삭제: id ]
    deleteSalesById(
        args: IDeleteSalesById.IInput
    ): Promise<IDeleteSalesById.IOutput>;

    // [ Sales Status Goal 생성 ]
    registerGoal(args: IRegisterGoal.IInput): Promise<IRegisterGoal.IOutput>;

    // [ Sales Status Goal 수정 ]
    updatedGoal(args: IUpdatedGoal.IInput): Promise<IUpdatedGoal.IOutput>;

    // [ Sales Status Goal 조회: year ]
    getGoalByYear(args: IGetGoalByYear.IInput): Promise<IGetGoalByYear.IOutput>;

    // [ Sales Status 데이터 조회: year ]
    getMonthlySalesData(
        args: IGetSalesStatus.IInput
    ): Promise<IGetSalesStatus.IOutput>;

    // [ Unique Years 조회 ]
    getUniqueYears(
        args: IGetUniqueYears.IInput
    ): Promise<IGetUniqueYears.IOutput>;
}
