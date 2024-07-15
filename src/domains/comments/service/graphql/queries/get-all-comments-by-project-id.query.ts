import { gql } from "graphql-request";
import { IComments_Order_By } from "src/codegen/graphql";

export namespace GetAllCommentsByProjectIdQuery {
    export interface IVariable {
        project_id: number;
        order_by?: [IComments_Order_By];
        [key: string]: any;
    }

    export interface IResponse {
        comments: {
            id: number;
            project_id: number;
            writer_id: number;
            writer_name: string;
            contents: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date;
        }[];
    }

    export const Document = gql`
        query getAllCommentsByProjectId(
            $project_id: Int!
            $order_by: [comments_order_by!]
        ) {
            comments(
                order_by: $order_by
                where: {
                    project_id: { _eq: $project_id }
                    deleted_at: { _is_null: true }
                }
            ) {
                id
                project_id
                writer_id
                writer_name
                contents
                created_at
                updated_at
                deleted_at
            }
        }
    `;
}
