import { gql } from "graphql-request";
import { IContract_Bool_Exp, IContract_Order_By } from "src/codegen/graphql";

export namespace GetAllContractQuery {
    export interface IVariable {
        [key: string]: any;
        where?: IContract_Bool_Exp;
        order_by?: IContract_Order_By[];
    }

    export interface IResponse {
        contract: {
            id: number;
            client: {
                name: string;
            };
            sales_representative: {
                id: number;
                name: string;
                deleted_at: Date;
            };
            contractor: {
                id: number;
                name: string;
            };
            project: {
                id: number;
                name: string;
                free_start_date: Date;
                free_end_date: Date;
                is_canceled: boolean;
                canceled_at: Date;
            };
            contract_date: Date;
            contract_amount: string;
            contract_period_start: Date;
            contract_period_end: Date;
            name: string;
            updated_at: Date;
            deleted_at: Date;
        }[];
    }

    export const Document = gql`
        query GetAllContractQuery(
            $where: contract_bool_exp
            $order_by: [contract_order_by!]
        ) {
            contract(order_by: $order_by, where: $where) {
                id
                client {
                    name
                }
                project {
                    id
                    name
                    free_start_date
                    free_end_date
                    is_canceled
                    canceled_at
                }
                sales_representative {
                    id
                    name
                    deleted_at
                }
                contractor {
                    id
                    name
                }
                contract_date
                contract_amount
                contract_period_start
                contract_period_end
                name
                updated_at
                deleted_at
            }
        }
    `;
}
