import {
    DeleteCompanyByPkMutation,
    EditCompanyByPkMutation,
    RegisterCompanyMutation,
} from "./graphql/mutations";
import { GetCompanyByPkQuery } from "./graphql/queries";
import { GetCompanyByTypeQuery } from "./graphql/queries/get-company-by-type.query";

export namespace IGetCompanyByTypeQuery {
    export interface IInput extends GetCompanyByTypeQuery.IVariable {}
    // export interface IOutput extends GetCompanyByTypeQuery.IResponse {}
    export interface IOutput
        extends Array<
            | {
                  type: {
                      category: string;
                      code: number;
                      is_used: boolean;
                      value: string;
                  };
                  id: number;
                  name: string;
                  president: string;
                  busi_no: string;
                  regist_no: string;
                  address: string;
                  busi_state: string;
                  event: string;
                  billing_address: string;
                  contact: string;
                  fax: string;
                  note: string;
                  created_at: string;
                  updated_at: string;
                  deleted_at: string;
              }
            | undefined
        > {}
}
export namespace IGetCompanyByPkQuery {
    export interface IInput extends GetCompanyByPkQuery.IVariable {}
    export interface IOutput {
        type: {
            category: string;
            code: number;
            is_used: boolean;
            value: string;
        };
        id: number;
        name: string;
        president: string;
        busi_no: string;
        regist_no: string;
        address: string;
        busi_state: string;
        event: string;
        billing_address: string;
        note: string;
        created_at: string;
        updated_at: string;
        deleted_at: string;
    }
}
export namespace IRegisterCompanyMutation {
    export interface IInput extends RegisterCompanyMutation.IVariable {}
    export interface IOutput extends RegisterCompanyMutation.IResponse {}
}
export namespace IEditCompanyByPkMutation {
    export interface IInput extends EditCompanyByPkMutation.IVariable {}
    export interface IOutput extends EditCompanyByPkMutation.IResponse {}
}
export namespace IDeleteCompanyByPkMutation {
    export interface IInput extends DeleteCompanyByPkMutation.IVariable {}
    export interface IOutput extends DeleteCompanyByPkMutation.IResponse {}
}

export interface ICompanyService {
    getCompanies(
        where: IGetCompanyByTypeQuery.IInput
    ): Promise<IGetCompanyByTypeQuery.IOutput>;
    getCompanyByPk(
        where: IGetCompanyByPkQuery.IInput
    ): Promise<IGetCompanyByPkQuery.IOutput>;
    registerCompany(
        args: IRegisterCompanyMutation.IInput
    ): Promise<IRegisterCompanyMutation.IOutput>;
    editCompanyByPk(
        args: IEditCompanyByPkMutation.IInput
    ): Promise<IEditCompanyByPkMutation.IOutput>;
    deleteCompanyByPk(
        args: IDeleteCompanyByPkMutation.IInput
    ): Promise<IDeleteCompanyByPkMutation.IOutput>;
}
