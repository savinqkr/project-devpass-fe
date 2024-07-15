import { gql } from "graphql-request";
import {
    IContract_Bool_Exp,
    IContract_Order_By,
    IEstimate_Bool_Exp,
    IEstimate_Order_By,
    IProject_Bool_Exp,
    IProject_Contract_Bool_Exp,
} from "src/codegen/graphql";

export namespace GetFinalEstimateDetailsBySelectedLicenseContractsQuery {
    export interface IVariable {
        [key: string]: any;
        project_contract_where?: IProject_Contract_Bool_Exp;
        project_where?: IProject_Bool_Exp;
        esitmate_where?: IEstimate_Bool_Exp;
        esitmate_order_by?: IEstimate_Order_By[];
        contract_where?: IContract_Bool_Exp;
        contract_order_by?: IContract_Order_By[];
    }
    export interface IResponse {
        project_contract: {
            repair_project: {
                id: number;
                name: string;
                type: {
                    code: number;
                    value: string;
                };
                client: {
                    id: number;
                    name: string;
                    busi_no: string;
                };
                contractor: {
                    id: number;
                    name: string;
                    busi_no: string;
                };
                start_date: string;
                end_date: string;
                optrans_date: string;
                inspect_date: string;
                free_start_date: string;
                free_end_date: string;
                participate_type: string;
                note: string;
                is_canceled: boolean;
                consultant_name?: string;
                consultant_email?: string;
                consultant_contact?: string;
                consultant_phone?: string;
                inspect_cycle?: string;
                inspect_method?: string;
                inspect_option?: string;
                inspect_note?: string;
                repair_rate?: number;
                repair_last_year_rate?: number;
            };
            license_contract: {
                id: number;
                name: string;
                contract_period_start: string;
                contract_period_end: string;
            };
        }[];
        repair_project: {
            id: number;
            name: string;
            start_date: string;
            end_date: string;
            repair_rate?: number;
            repair_last_year_rate?: number;
        }[];
        estimate: {
            id: number;
            case_name: string;
            is_final: boolean;
            details: {
                row_index: number;
                type: string;
                purpose: string;
                class: string;
                product_type: string;
                product: string;
                details: string;
                unit: string;
                amount: number;
                price: string;
                standard_price: string;
                supply_price: string;
                note: string;
            }[];
            license_project: {
                id: number;
                name: string;
                contracts: {
                    id: number;
                    name: string;
                    contract_period_start: string;
                    contract_period_end: string;
                }[];
            };
        }[];
    }

    export const Document = gql`
        query GetFinalEstimateDetailsBySelectedLicenseContractsQuery(
            $project_contract_where: project_contract_bool_exp
            $project_where: project_bool_exp
            $esitmate_where: estimate_bool_exp
            $esitmate_order_by: [estimate_order_by!]
            $contract_where: contract_bool_exp
            $contract_order_by: [contract_order_by!]
        ) {
            project_contract(where: $project_contract_where) {
                repair_project: project {
                    id
                    name
                    type {
                        code
                        value
                    }
                    client {
                        id
                        name
                        busi_no
                    }
                    contractor {
                        id
                        name
                        busi_no
                    }
                    start_date
                    end_date
                    optrans_date
                    inspect_date
                    free_start_date
                    free_end_date
                    participate_type
                    note
                    is_canceled
                    consultant_name
                    consultant_email
                    consultant_contact
                    consultant_phone
                    inspect_cycle
                    inspect_method
                    inspect_option
                    inspect_note
                    repair_rate
                    repair_last_year_rate
                }
                license_contract: contract {
                    id
                    name
                    contract_period_start
                    contract_period_end
                }
            }
            repair_project: project(where: $project_where) {
                id
                name
                start_date
                end_date
                repair_rate
                repair_last_year_rate
            }
            estimate(where: $esitmate_where) {
                id
                case_name
                is_final
                details {
                    row_index
                    type
                    purpose
                    class
                    product_type
                    product
                    details
                    unit
                    amount
                    price
                    supply_price
                    note
                }
                license_project: project {
                    id
                    name
                    contracts(
                        where: $contract_where
                        order_by: $contract_order_by
                    ) {
                        id
                        name
                        contract_period_start
                        contract_period_end
                    }
                }
            }
        }
    `;
}
