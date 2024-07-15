import { gql } from "graphql-request";

export namespace DeleteProductByIdMutation {
    export interface IVariable {
        id: number;
        [key: string]: any;
    }
    export interface IResponse {
        update_product_by_pk: { deleted_at: Date };
    }

    export const Document = gql`
        mutation deleteProductById($id: Int!) {
            update_product_by_pk(
                pk_columns: { id: $id }
                _set: { deleted_at: "now()" }
            ) {
                deleted_at
            }
        }
    `;
}
