import {
    DeleteRoleCodeMutation,
    EditRoleCodeMutation,
    GetAllRoleCodeQuery,
    GetRoleCodeByPkQuery,
    RegisterRoleCodeMutation,
} from "./graphql";

export namespace IGetAllRoleCodeQuery {
    export interface IInput extends GetAllRoleCodeQuery.IVariable {}
    export interface IOutput extends GetAllRoleCodeQuery.IResponse {}
}
export namespace IGetRoleCodeByPkQuery {
    export interface IInput extends GetRoleCodeByPkQuery.IVariable {}
    export interface IOutput extends GetRoleCodeByPkQuery.IResponse {}
}

export namespace IRegisterRoleCodeMutation {
    export interface IInput extends RegisterRoleCodeMutation.IVariable {}
    export interface IOutput extends RegisterRoleCodeMutation.IResponse {}
}
export namespace IEditRoleCodeMutation {
    export interface IInput extends EditRoleCodeMutation.IVariable {}
    export interface IOutput extends EditRoleCodeMutation.IResponse {}
}
export namespace IDeleteRoleCodeMutation {
    export interface IInput extends DeleteRoleCodeMutation.IVariable {}
    export interface IOutput extends DeleteRoleCodeMutation.IResponse {}
}

export interface IRoleService {
    getAllRoleCode(
        where: IGetAllRoleCodeQuery.IInput
    ): Promise<IGetAllRoleCodeQuery.IOutput>;
    getRoleCodeByPk(
        args: IGetRoleCodeByPkQuery.IInput
    ): Promise<IGetRoleCodeByPkQuery.IOutput>;
    registerRoleCode(
        args: IRegisterRoleCodeMutation.IInput
    ): Promise<IRegisterRoleCodeMutation.IOutput>;
    editRoleCode(
        args: IEditRoleCodeMutation.IInput
    ): Promise<IEditRoleCodeMutation.IOutput>;
    deleteRoleCode(
        args: IDeleteRoleCodeMutation.IInput
    ): Promise<IDeleteRoleCodeMutation.IOutput>;
}
