import { gql } from "graphql-request";

export namespace GetEstimateByPkQuery {
    export interface IVariable {
        [key: string]: any;
        id: number;
    }

    export interface IResponse {
        estimate_by_pk: {
            id: number;
            type: {
                code: number;
                value: string;
            };
            project: {
                id: number;
                name: string;
                is_canceled: boolean;
                canceled_at: Date;
                client: {
                    id: number;
                    name: string;
                };
                employees: {
                    employee: {
                        id: number;
                        name: string;
                    };
                    role: {
                        code: number;
                        value: string;
                    };
                }[];
                license_contract: {
                    project: {
                        id: number;
                        name: string;
                    };
                    contract: {
                        id: number;
                        name: string;
                    };
                }[];
            };
            employee_name: string;
            employee_email: string;
            employee_contact: string;
            employee_phone: string;
            head_employee_name: string;
            head_employee_email: string;
            head_employee_contact: string;
            destination: string;
            doc_num: string;
            case_name: string;
            estimate_date: string;
            validity: string;
            estimate_price: string;
            details: {
                row_index: number;
                license_project_name?: string;
                year?: string;
                type: string;
                purpose: string;
                class: string;
                product_type: string;
                product: string;
                unit: string;
                amount: number;
                price: string;
                details: string;
                standard_price?: string;
                supply_price: string;
                monthly_repair_price?: string;
                total_repair_price?: string;
                start_date?: string;
                end_date?: string;
                license_contract_id?: number;
                note: string;
            }[];
            vat_include: boolean;
            discount_rate: number;
            total_price: string;
            add_special_discount: boolean;
            special_discount_price: string;
            total_price_vat: string;
            tail: string;
            is_final: boolean;
            sequence: number;
            created_at: string;
            created_by: string;
            updated_at: string;
            updated_by: string;
            deleted_at: string;
            deleted_by: string;
        };
    }

    export const Document = gql`
        query GetEstimateByPkQuery($id: Int!) {
            estimate_by_pk(id: $id) {
                id
                type {
                    code
                    value
                }
                project {
                    id
                    name
                    is_canceled
                    canceled_at
                    client {
                        id
                        name
                    }
                    employees {
                        employee {
                            id
                            name
                        }
                        role {
                            code
                            value
                        }
                    }
                    license_contracts {
                        project {
                            id
                            name
                        }
                        contract {
                            id
                            name
                        }
                    }
                }
                employee_name
                employee_email
                employee_contact
                employee_phone
                head_employee_name
                head_employee_email
                head_employee_contact
                destination
                doc_num
                case_name
                estimate_date
                validity
                estimate_price
                details(order_by: { row_index: asc }) {
                    row_index
                    license_project_name
                    year
                    type
                    purpose
                    class
                    product_type
                    product
                    unit
                    amount
                    price
                    details
                    standard_price
                    supply_price
                    monthly_repair_price
                    total_repair_price
                    start_date
                    end_date
                    license_contract_id
                    note
                }
                vat_include
                discount_rate
                total_price
                add_special_discount
                special_discount_price
                total_price_vat
                tail
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
