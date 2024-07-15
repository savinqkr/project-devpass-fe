import { gql } from "graphql-request";

export namespace UpdatedTailMutation {
    export interface IVariable {
        id: number;
        type_code: number;
        name: string;
        contents: string;
        updated_by: number;
        [key: string]: any;
    }
    export interface IResponse {
        update_tail_by_pk: {
            id: number;
        };
    }

    export const Document = gql`
        mutation updatedTail(
            $id: Int!
            $type_code: Int!
            $name: String!
            $contents: String!
            $updated_by: Int!
        ) {
            update_tail_by_pk(
                pk_columns: { id: $id }
                _set: {
                    type_code: $type_code
                    name: $name
                    contents: $contents
                    updated_at: "now()"
                    updated_by: $updated_by
                }
            ) {
                id
            }
        }
    `;
}
