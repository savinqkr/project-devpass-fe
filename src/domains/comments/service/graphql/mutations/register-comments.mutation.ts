import { gql } from "graphql-request";

export namespace RegisterCommentsMutation {
    export interface IVariable {
        project_id: number;
        writer_id: number;
        writer_name: string;
        contents: string;
        [key: string]: any;
    }
    export interface IResponse {
        insert_comments_one: {
            id: number;
        };
    }

    export const Document = gql`
        mutation insert_comments_one(
            $project_id: Int!
            $writer_id: Int!
            $writer_name: String!
            $contents: String!
        ) {
            insert_comments_one(
                object: {
                    project_id: $project_id
                    writer_id: $writer_id
                    writer_name: $writer_name
                    contents: $contents
                }
            ) {
                id
            }
        }
    `;
}
