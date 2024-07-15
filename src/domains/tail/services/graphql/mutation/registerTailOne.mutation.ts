import { gql } from "graphql-request";

export namespace RegisterTailOneMutation {
    export interface IVariable {
        type_code: number;
        name: string;
        contents: string;
        created_by: number;
        updated_by: number;
        [key: string]: any;
    }
    export interface IResponse {
        insert_tail_one: {
            id: number;
        };
    }

    export const Document = gql`
        mutation insert_tail_one(
            $type_code: Int!
            $name: String!
            $contents: String!
            $created_by: Int!
            $updated_by: Int!
        ) {
            insert_tail_one(
                object: {
                    type_code: $type_code
                    name: $name
                    contents: $contents
                    created_by: $created_by
                    updated_by: $updated_by
                }
            ) {
                id
            }
        }
    `;
}
