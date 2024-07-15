import {
    CheckAccountIdAvailableMutation,
    EditUserMutation,
    LoginMutation,
    RefreshJwtMutation,
    RegisterUserMutation,
} from "./graphql";

export namespace ILogin {
    export interface IInput extends LoginMutation.IVariable {}
    export interface IOutput extends LoginMutation.IResponse {}
}
export namespace IRefreshJwt {
    export interface IInput extends RefreshJwtMutation.IVariable {}
    export interface IOutput extends RefreshJwtMutation.IResponse {}
}
export namespace ICheckAccountIdAvailable {
    export interface IInput extends CheckAccountIdAvailableMutation.IVariable {}
}

export namespace IRegisterUser {
    export interface IInput extends RegisterUserMutation.IVariable {}
    export interface IOutput extends RegisterUserMutation.IResponse {}
}

export namespace IEditUser {
    export interface IInput extends EditUserMutation.IVariable {}
    export interface IOutput extends EditUserMutation.IResponse {}
}
export interface IAuthService {
    login(args: ILogin.IInput): Promise<ILogin.IOutput>;
    refreshJwt(args: IRefreshJwt.IInput): Promise<IRefreshJwt.IOutput>;
    checkAccountIdAvailable(
        args: ICheckAccountIdAvailable.IInput
    ): Promise<boolean>;
    registerUser(args: IRegisterUser.IInput): Promise<IRegisterUser.IOutput>;
    editUser(args: IEditUser.IInput): Promise<IEditUser.IOutput>;
}
