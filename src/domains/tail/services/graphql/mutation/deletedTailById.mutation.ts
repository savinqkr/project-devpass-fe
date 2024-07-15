import { gql } from "graphql-request";

export namespace DeletedTailByIdMutation {
    export interface IVariable {
        id: number;
        [key: string]: any;
    }
    export interface IResponse {
        update_tail_by_pk: { deleted_at: Date };
    }

    export const Document = gql`
        mutation deletedTailById($id: Int!) {
            update_tail_by_pk(
                pk_columns: { id: $id }
                _set: { deleted_at: "now()" }
            ) {
                deleted_at
            }
        }
    `;
}
