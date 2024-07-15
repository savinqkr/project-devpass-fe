import {
    DeleteCommentsMutation,
    RegisterCommentsMutation,
    UpdateCommentsMutation,
} from "./graphql";
import { GetAllCommentsByProjectIdQuery } from "./graphql/queries/get-all-comments-by-project-id.query";

export namespace IGetAllCommentsByProjectId {
    export interface IInput extends GetAllCommentsByProjectIdQuery.IVariable {}
    export interface IOutput extends GetAllCommentsByProjectIdQuery.IResponse {}
}

export namespace IRegisterComments {
    export interface IInput extends RegisterCommentsMutation.IVariable {}
    export interface IOutput extends RegisterCommentsMutation.IResponse {}
}

export namespace IUpdateCommentsById {
    export interface IInput extends UpdateCommentsMutation.IVariable {}
    export interface IOutput extends UpdateCommentsMutation.IResponse {}
}

export namespace IDeleteCommentsById {
    export interface IInput extends DeleteCommentsMutation.IVariable {}
    export interface IOutput extends DeleteCommentsMutation.IResponse {}
}

export interface ICommentsService {
    getAllCommentsByProjectId(
        where: IGetAllCommentsByProjectId.IInput
    ): Promise<IGetAllCommentsByProjectId.IOutput>;

    registerComments(
        where: IRegisterComments.IInput
    ): Promise<IRegisterComments.IOutput>;

    updateCommentsById(
        where: IUpdateCommentsById.IInput
    ): Promise<IUpdateCommentsById.IOutput>;

    deleteCommentsById(
        where: IDeleteCommentsById.IInput
    ): Promise<IDeleteCommentsById.IOutput>;
}
