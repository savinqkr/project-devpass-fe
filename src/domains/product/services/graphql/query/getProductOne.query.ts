import { gql } from "graphql-request";

export namespace GetProductOneByIdQuery {
    export interface IVariable {
        id: number;
        [key: string]: any;
    }

    export interface IResponse {
        product_by_pk: {
            type: {
                code: number;
                value: string;
            };
            purpose: {
                code: number;
                value: string;
            };
            class: {
                code: number;
                value: string;
            };
            name: string;
            unit: {
                code: number;
                value: string;
            };
            price: string;
            note: string;
            created_at: string;
            updated_at: string;
            deleted_at: string;
        };
    }

    export const Document = gql`
        query getProductOneById($id: Int!) {
            product_by_pk(id: $id) {
                type {
                    code
                    value
                }
                purpose {
                    code
                    value
                }
                class {
                    code
                    value
                }
                name
                unit {
                    code
                    value
                }
                price
                note
                created_at
                updated_at
                deleted_at
            }
        }
    `;
}
