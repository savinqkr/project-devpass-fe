import { gql } from "graphql-request";

export namespace UpdateProductMutation {
    export interface IVariable {
        id: number;
        type: number;
        purpose: number;
        class: number;
        name: string;
        unit: number;
        price: number;
        note: string;
        updated_by: number;
        [key: string]: any;
    }
    export interface IResponse {
        update_product_by_pk: {
            id: number;
        };
    }

    export const Document = gql`
        mutation update_product_by_pk(
            $id: Int!
            $type: Int!
            $purpose: Int!
            $class: Int!
            $name: String!
            $unit: Int!
            $price: money!
            $note: String
            $updated_by: Int!
        ) {
            update_product_by_pk(
                pk_columns: { id: $id }
                _set: {
                    type_code: $type
                    purpose_code: $purpose
                    class_code: $class
                    name: $name
                    unit_code: $unit
                    price: $price
                    note: $note
                    updated_at: "now()"
                    updated_by: $updated_by
                }
            ) {
                id
            }
        }
    `;
}
