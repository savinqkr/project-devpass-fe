import { gql } from "graphql-request";
import { IEstimate_Bool_Exp, IEstimate_Order_By } from "src/codegen/graphql";

export namespace GetAllEstimatesQuery {
    export interface IVariable {
        [key: string]: any;
        where?: IEstimate_Bool_Exp;
        order_by?: IEstimate_Order_By[];
    }

    export interface IResponse {
        estimate: {
            id: number;
            type: {
                code: number;
                value: string;
            };
            order: number;
            project: {
                id: number;
                name: string;
                is_canceled: boolean;
                client: {
                    id: number;
                    name: string;
                };
                contractor?: {
                    id: number;
                    name: string;
                };
            };
            case_name: string;
            destination: string;
            estimate_date: string;
            is_final: boolean;
            sequence: number;
            created_at: string;
            created_by: number;
            updated_at: string;
            updated_by?: number;
            deleted_at?: string;
            deleted_by?: number;
        }[];
    }

    export const Document = gql`
        query GetAllEstimatesQuery(
            $where: estimate_bool_exp
            $order_by: [estimate_order_by!]
        ) {
            estimate(where: $where, order_by: $order_by) {
                id
                type {
                    code
                    value
                }
                order
                project {
                    id
                    name
                    is_canceled
                    client {
                        id
                        name
                    }
                    contractor {
                        id
                        name
                    }
                }
                destination
                case_name
                estimate_date
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
