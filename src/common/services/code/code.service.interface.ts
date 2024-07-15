import {
    GetCodesByCategoryQuery,
    GetCodeByValueQuery,
    GetCodeByPkQuery,
    GetCommonCodeQuery,
} from "./graphql";

export namespace IGetCodeByCategory {
    export interface IInput extends GetCodesByCategoryQuery.IVariable {}
    export interface IOutput extends GetCodesByCategoryQuery.IResponse {}
}
export namespace IGetCodeByValue {
    export interface IInput extends GetCodeByValueQuery.IVariable {}
    export interface IOutput extends GetCodeByValueQuery.IResponse {}
}
export namespace IGetCodeByPk {
    export interface IInput extends GetCodeByPkQuery.IVariable {}
    export interface IOutput extends GetCodeByPkQuery.IResponse {}
}
export namespace IGetCommonCode {
    export interface IInput extends GetCommonCodeQuery.IVariable {}
    export interface IOutput extends GetCommonCodeQuery.IResponse {}
}
export interface ICodeService {
    getCommonCode(
        where: IGetCommonCode.IInput
    ): Promise<IGetCommonCode.IOutput>;
    getCodeByCategory(
        where: IGetCodeByCategory.IInput
    ): Promise<IGetCodeByCategory.IOutput>;
    getCodeByValue(
        where: IGetCodeByValue.IInput
    ): Promise<IGetCodeByValue.IOutput>;
    getCodeBypk(where: IGetCodeByPk.IInput): Promise<IGetCodeByPk.IOutput>;
}
