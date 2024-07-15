import { gql } from "graphql-request";
import {
    IProject_Contract_Bool_Exp,
    IProject_Contract_Order_By,
} from "src/codegen/graphql";

export namespace GetFinalEstiamteDetailsQuery {
    export interface IVariable {
        [key: string]: any;
        where?: IProject_Contract_Bool_Exp;
        order_by?: IProject_Contract_Order_By[];
    }
    export interface IResponse {
        project_contract: {
            repair_project: {
                id: number;
                name: string;
                start_date: string;
                end_date: string;
                repair_rate: number;
                repair_last_year_rate: number;
            };
            license_contract: {
                id: number;
                name: string;
                contract_period_start: string;
                contract_period_end: string;
                license_project: {
                    id: number;
                    name: string;
                    estimates: {
                        id: number;
                        case_name: string;
                        is_final: boolean;
                        details: {
                            row_index: number;
                            type: string;
                            purpose: string;
                            class: string;
                            product: string;
                            details: string;
                            unit: string;
                            amount: number;
                            price: string;
                            standard_price: string;
                            supply_price: string;
                            note: string;
                        }[];
                    }[];
                };
            };
        }[];
    }

    export const Document = gql`
        query GetFinalEstiamteDetailsQuery(
            $where: project_contract_bool_exp
            $order_by: [project_contract_order_by!]
        ) {
            project_contract(where: $where, order_by: $order_by) {
                repair_project: project {
                    id
                    name
                    start_date
                    end_date
                    repair_rate
                    repair_last_year_rate
                }
                license_contract: contract {
                    id
                    name
                    contract_period_start
                    contract_period_end
                    license_project: project {
                        id
                        name
                        estimates(where: { is_final: { _eq: true } }) {
                            id
                            case_name
                            is_final
                            details {
                                row_index
                                type
                                purpose
                                class
                                product
                                details
                                unit
                                amount
                                price
                                standard_price
                                supply_price
                                note
                            }
                        }
                    }
                }
            }
        }
    `;
}
