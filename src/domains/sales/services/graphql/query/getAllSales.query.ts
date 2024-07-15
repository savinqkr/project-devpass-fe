import { gql } from "graphql-request";
import { ISales_Bool_Exp } from "src/codegen/graphql";

export namespace GetAllSalesQuery {
    export interface IVariable {
        where?: ISales_Bool_Exp;
        [key: string]: any;
    }

    export interface IResponse {
        sales: {
            id: number;
            client: {
                name: string;
            };
            project: {
                id: string;
                name: string;
                is_canceled: boolean;
            };
            sales_representative: {
                name: string;
            };
            first_sales: string;
            first_sales_claim_date: Date;
            second_sales: string;
            second_sales_claim_date: Date;
            last_sales: string;
            last_sales_claim_date: Date;
            updated_at: Date;
            deleted_at: Date;
        }[];
    }

    export const Document = gql`
        query GetAllSalesQuery($where: sales_bool_exp) {
            sales(
                order_by: [
                    { deleted_at: asc_nulls_first }
                    { project: { is_canceled: asc } }
                    { updated_at: desc }
                ]
                where: $where
            ) {
                id
                client {
                    name
                }
                project {
                    id
                    name
                    is_canceled
                }
                sales_representative {
                    name
                }
                first_sales
                first_sales_claim_date
                second_sales
                second_sales_claim_date
                last_sales
                last_sales_claim_date
                updated_at
                deleted_at
            }
        }
    `;
}
