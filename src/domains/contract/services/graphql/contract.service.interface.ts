import {
    DeleteContractByIdMutation,
    RegisterContractOneMutation,
    UpdateContractByIdMutation,
} from "./mutation";
import { GetAllContractQuery, GetContractOneByIdQuery } from "./query";
import { GetMonthlyContractAmount } from "./query/getMonthlyContractAmount.query";

// [ Contract 생성 ]
export namespace IRegisterContractOne {
    export interface IInput extends RegisterContractOneMutation.IVariable {}
    export interface IOutput extends RegisterContractOneMutation.IResponse {}
}

// [ Contract 전체 조회 ]
export namespace IGetAllContract {
    export interface IInput extends GetAllContractQuery.IVariable {}
    // export interface IOutput extends GetAllContractQuery.IResponse {}
    export interface IOutput
        extends Array<
            | {
                  id: number;
                  client: {
                      name: string;
                  };
                  sales_representative: {
                      id: number;
                      name: string;
                      deleted_at: Date;
                  };
                  contractor: {
                      id: number;
                      name: string;
                  };
                  project: {
                      id: number;
                      name: string;
                      free_start_date: Date;
                      free_end_date: Date;
                      is_canceled: boolean;
                      canceled_at: Date;
                  };
                  contract_date: Date;
                  contract_amount: string;
                  contract_period_start: Date;
                  contract_period_end: Date;
                  name: string;
                  updated_at: Date;
                  deleted_at: Date;
              }
            | undefined
        > {}
}

// [ Contract 조회: id ]
export namespace IGetContractOneById {
    export interface IInput extends GetContractOneByIdQuery.IVariable {}
    export interface IOutput extends GetContractOneByIdQuery.IResponse {}
}

// [ Contract 수정: id ]
export namespace IUpdateContractById {
    export interface IInput extends UpdateContractByIdMutation.IVariable {}
    export interface IOutput extends UpdateContractByIdMutation.IResponse {}
}

// [ Contract 삭제: id ]
export namespace IDeleteContractById {
    export interface IInput extends DeleteContractByIdMutation.IVariable {}
    export interface IOutput extends DeleteContractByIdMutation.IResponse {}
}

// [ 월 별 계약금 ( 수주금액 ) 조회 : year ]
export namespace IGetMonthlyContractAmount {
    export interface IInput extends GetMonthlyContractAmount.IVariable {}
    export interface IOutput extends GetMonthlyContractAmount.IResponse {}
}

// -------------------------------------------------------------------------------------------------
export interface IContractService {
    // [ Contract 생성 ]
    registerContractOne(
        args: IRegisterContractOne.IInput
    ): Promise<IRegisterContractOne.IOutput>;

    // [ Contract 전체 조회 ]
    getAllContract(
        args: IGetAllContract.IInput,
        variables: {
            common_type_code: number;
            client_id?: number;
            project_id?: number;
        }
    ): Promise<IGetAllContract.IOutput>;

    // [ Contract 조회: id ]
    getContractOneById(
        args: IGetContractOneById.IInput
    ): Promise<IGetContractOneById.IOutput>;

    // [ Contract 수정: id ]
    updateContractById(
        args: IUpdateContractById.IInput
    ): Promise<IUpdateContractById.IOutput>;

    // [ Contract 삭제: id ]
    deleteContractById(
        args: IDeleteContractById.IInput
    ): Promise<IDeleteContractById.IOutput>;

    // [ 월 별 계약금 ( 수주금액 ) 조회 : year ]
    getMonthlyContractAmount(
        args: IGetMonthlyContractAmount.IInput
    ): Promise<IGetMonthlyContractAmount.IOutput>;
}
