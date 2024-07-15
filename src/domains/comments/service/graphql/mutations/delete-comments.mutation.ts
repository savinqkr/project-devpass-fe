import { gql } from "graphql-request";

export namespace DeleteCommentsMutation {
    export interface IVariable {
        [key: string]: any;
        id: number;
    }

    export interface IResponse {
        update_comments_by_pk: {
            id: any;
        };
    }

    export const Document = gql`
        mutation deleteCommentsMutation($id: Int!) {
            update_comments_by_pk(
                pk_columns: { id: $id }
                _set: { deleted_at: "now()" }
            ) {
                id
            }
        }
    `;
}
