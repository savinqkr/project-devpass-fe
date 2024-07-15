import { gql } from "graphql-request";

export namespace CreateProductMutation {
    export interface IVariable {
        type: number;
        purpose: number;
        class: number;
        name: string;
        unit: number;
        price: number;
        note: string;
        created_by: number;
        updated_by: number;
        [key: string]: any;
    }
    export interface IResponse {
        insert_product_one: {
            id: number;
            name: string;
        };
    }

    export const Document = gql`
        mutation insert_product_one(
            $type: Int!
            $purpose: Int!
            $class: Int!
            $name: String!
            $unit: Int!
            $price: money!
            $note: String
            $created_by: Int!
            $updated_by: Int!
        ) {
            insert_product_one(
                object: {
                    type_code: $type
                    purpose_code: $purpose
                    class_code: $class
                    name: $name
                    unit_code: $unit
                    price: $price
                    note: $note
                    created_by: $created_by
                    updated_by: $updated_by
                }
            ) {
                id
                name
            }
        }
    `;
}
