import { gql } from "graphql-request";
import { IProject_Bool_Exp, IProject_Order_By } from "src/codegen/graphql";

export namespace GetAllProjectsByTypeQuery {
    export interface IVariable {
        [key: string]: any;
        where?: IProject_Bool_Exp;
        order_by?: IProject_Order_By[];
    }

    export interface IResponse {
        project: {
            id: number;
            name: string;
            client: {
                name: string;
            };
            contractor?: {
                name: string;
            };
            contracts: {
                id: number;
                contract_amount: string;
                deleted_at: Date;
            }[];
            sales: {
                id: number;
                deleted_at: Date;
            }[];
            type: {
                code: number;
                value: string;
            };
            is_canceled: boolean;
            start_date: string;
            end_date: string;
            free_start_date: Date;
            free_end_date: Date;
            consultant_name?: string;
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
        query GetAllProjectsByTypeQuery(
            $where: project_bool_exp
            $order_by: [project_order_by!]
        ) {
            project(where: $where, order_by: $order_by) {
                id
                name
                client {
                    name
                }
                contractor {
                    name
                }
                contracts {
                    id
                    contract_amount
                    deleted_at
                }
                sales {
                    id
                    deleted_at
                }
                type {
                    code
                    value
                }
                is_canceled
                start_date
                end_date
                free_start_date
                free_end_date
                consultant_name
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
