import { gql } from "graphql-request";

export namespace UpdateCommentsMutation {
    export interface IVariable {
        [key: string]: any;
        id: number;
        contents: string;
    }

    export interface IResponse {
        update_comments_by_pk: {
            id: number;
        };
    }

    export const Document = gql`
        mutation updateCommentsMutation($id: Int!, $contents: String!) {
            update_comments_by_pk(
                pk_columns: { id: $id }
                _set: { contents: $contents, updated_at: "now()" }
            ) {
                id
            }
        }
    `;
}
