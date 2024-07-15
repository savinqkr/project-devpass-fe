import {
    DeletedTailByIdMutation,
    RegisterTailOneMutation,
    UpdatedTailMutation,
} from "./graphql/mutation";
import {
    GetAllTailQuery,
    GetTailByIdQuery,
    GetAllTailByTypeQuery,
} from "./graphql/query";

// [ 전체 TAIL 조회: ( deleted_at: null ) ]
export namespace IGetAllTails {
    export interface IInput extends GetAllTailQuery.IVariable {}
    export interface IOutput extends GetAllTailQuery.IResponse {}
}

// [ TAIL 조회: ( type_code & deleted_at: null ) ]
export namespace IGetAllTailByType {
    export interface IInput extends GetAllTailByTypeQuery.IVariable {}
    export interface IOutput extends GetAllTailByTypeQuery.IResponse {}
}

// [ TAIL 조회: ( id ) ]
export namespace IGetTailById {
    export interface IInput extends GetTailByIdQuery.IVariable {}
    export interface IOutput extends GetTailByIdQuery.IResponse {}
}

// [ TAIL 생성 ]
export namespace IRegisterTailOne {
    export interface IInput extends RegisterTailOneMutation.IVariable {}
    export interface IOutput extends RegisterTailOneMutation.IResponse {}
}

// [ TAIL 수정 ]
export namespace IUpdatedTail {
    export interface IInput extends UpdatedTailMutation.IVariable {}
    export interface IOutput extends UpdatedTailMutation.IResponse {}
}

// [ TAIL 삭제: id ]
export namespace IDeletedTailById {
    export interface IInput extends DeletedTailByIdMutation.IVariable {}
    export interface IOutput extends DeletedTailByIdMutation.IResponse {}
}

// -------------------------------------------------------------------------------------------------
export interface ITailService {
    // [ 전체 TAIL 조회: ( deleted_at: null ) ]
    getAllTails(args: IGetAllTails.IInput): Promise<IGetAllTails.IOutput>;

    // [ TAIL 조회: ( type_code & deleted_at: null ) ]
    getAllTailByType(
        where: IGetAllTailByType.IInput
    ): Promise<IGetAllTailByType.IOutput>;

    // [ TAIL 조회: ( id ) ]
    getTailById(args: IGetTailById.IInput): Promise<IGetTailById.IOutput>;

    // [ TAIL 수정 ]
    updatedTail(args: IUpdatedTail.IInput): Promise<IUpdatedTail.IOutput>;

    // [ TAIL 삭제: id ]
    deletedTailById(
        args: IDeletedTailById.IInput
    ): Promise<IDeletedTailById.IOutput>;
}
