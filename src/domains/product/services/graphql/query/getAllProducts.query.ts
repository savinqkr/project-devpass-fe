import { gql } from "graphql-request";
import { IProduct_Bool_Exp } from "src/codegen/graphql";

export namespace GetAllProductsQuery {
    export interface IVariable {
        [key: string]: any;
        where?: IProduct_Bool_Exp;
    }

    export interface IResponse {
        product: {
            id: number;
            name: string;
            price: string;
            type: {
                category: string;
                code: number;
                value: string;
                is_used: boolean;
            };
            purpose: {
                category: string;
                code: number;
                value: string;
                is_used: boolean;
            };
            class: {
                category: string;
                code: number;
                value: string;
                is_used: boolean;
            };
            unit: {
                category: string;
                code: number;
                value: string;
                is_used: boolean;
            };
            note: string;
            updated_at: Date;
            deleted_at: Date;
        }[];
    }

    export const Document = gql`
        query GetAllProductsQuery($where: product_bool_exp) {
            product(
                order_by: [
                    { deleted_at: asc_nulls_first }
                    { updated_at: desc }
                ]
                where: $where
            ) {
                id
                name
                price
                type {
                    category
                    code
                    value
                    is_used
                }
                purpose {
                    category
                    code
                    value
                    is_used
                }
                class {
                    category
                    code
                    value
                    is_used
                }
                unit {
                    category
                    code
                    value
                    is_used
                }
                note
                updated_at
                deleted_at
            }
        }
    `;
}
