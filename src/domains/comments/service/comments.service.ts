import { GraphQLClient } from "graphql-request";
import getToken from "@utils/getToken";
import {
    ICommentsService,
    IDeleteCommentsById,
    IGetAllCommentsByProjectId,
    IRegisterComments,
    IUpdateCommentsById,
} from "./comments.interface";
import { GetAllCommentsByProjectIdQuery } from "./graphql/queries/get-all-comments-by-project-id.query";
import {
    DeleteCommentsMutation,
    RegisterCommentsMutation,
    UpdateCommentsMutation,
} from "./graphql";

class CommentsService implements ICommentsService {
    private static instance: CommentsService;

    private client = new GraphQLClient(
        process.env.NEXT_PUBLIC_HASURA_ENDPOINT ?? ""
        // {
        //     headers: {
        //         Authorization: `Bearer ${getToken()}`,
        //     },
        // }
    );

    public static get Instance(): CommentsService {
        return this.instance || (this.instance = new this());
    }

    // [ Comments 전체 조회: project_id ]
    public async getAllCommentsByProjectId(
        where: IGetAllCommentsByProjectId.IInput
    ): Promise<IGetAllCommentsByProjectId.IOutput> {
        // console.log(where);
        try {
            const { comments } = await this.client.request<
                GetAllCommentsByProjectIdQuery.IResponse,
                GetAllCommentsByProjectIdQuery.IVariable
            >(GetAllCommentsByProjectIdQuery.Document, where, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { comments };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // [ Comments 생성 ]
    public async registerComments(
        object: IRegisterComments.IInput
    ): Promise<IRegisterComments.IOutput> {
        try {
            const { insert_comments_one } = await this.client.request<
                RegisterCommentsMutation.IResponse,
                RegisterCommentsMutation.IVariable
            >(RegisterCommentsMutation.Document, object, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { insert_comments_one };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // [ Comments 수정 ]
    public async updateCommentsById(
        object: IUpdateCommentsById.IInput
    ): Promise<IUpdateCommentsById.IOutput> {
        try {
            const { update_comments_by_pk } = await this.client.request<
                UpdateCommentsMutation.IResponse,
                UpdateCommentsMutation.IVariable
            >(UpdateCommentsMutation.Document, object, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { update_comments_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // [ Comments 삭제 ]
    public async deleteCommentsById(
        object: IDeleteCommentsById.IInput
    ): Promise<IDeleteCommentsById.IOutput> {
        try {
            const { update_comments_by_pk } = await this.client.request<
                DeleteCommentsMutation.IResponse,
                DeleteCommentsMutation.IVariable
            >(DeleteCommentsMutation.Document, object, {
                Authorization: `Bearer ${window.localStorage.getItem(
                    "accessToken"
                )}`,
            });

            return { update_comments_by_pk };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
}

export default CommentsService.Instance;
