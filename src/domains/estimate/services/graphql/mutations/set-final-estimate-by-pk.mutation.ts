import { gql } from "graphql-request";

export namespace SetFinalEstimateByPkMutation {
    export interface IVariable {
        [key: string]: any;
        id: number;
    }

    export interface IResponse {
        update_estimate_by_pk: {
            id: number;
            is_final: boolean;
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
        mutation SetFinalEstimateByPkMutation($id: Int!) {
            update_estimate_by_pk(
                pk_columns: { id: $id }
                _set: { is_final: true }
            ) {
                id
                is_final
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
