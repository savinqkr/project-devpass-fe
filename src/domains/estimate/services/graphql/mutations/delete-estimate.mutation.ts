import { gql } from "graphql-request";

export namespace DeleteEstimateMutation {
    export interface IVariable {
        [key: string]: any;
        id: number;
        deleted_by: number;
    }

    export interface IResponse {
        deleteEstimate: {
            id: number;
            sequence: number;
            created_at: string;
            created_by: string;
            updated_at: string;
            updated_by: string;
            deleted_at: string;
            deleted_by: string;
        };
    }

    export const Document = gql`
        mutation DeleteEstimateMutation($id: Int!, $deleted_by: Int!) {
            deleteEstimate(
                args: { estimate_id: $id, deleted_by: $deleted_by }
            ) {
                id
                sequence
                created_at
                created_by
                updated_at
                updated_by
                deleted_at
                deleted_by
            }
        }
    `;
}
