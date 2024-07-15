import { gql } from "graphql-request";

export namespace GetRecentEstimateQuery {
    export interface IVariable {
        [key: string]: any;
        project_id: number;
        type_code: number;
    }

    export interface IResponse {
        estimate: {
            id: number;
            project: {
                id: number;
                name: string;
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
            };
            employee_name: string;
            employee_email: string;
            employee_contact: string;
            employee_phone: string;
            destination: string;
            doc_num: string;
            case_name: string;
            estimate_date: string;
            validity: string;
            estimate_price: string;
            details: {
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
        }[];
    }

    export const Document = gql`
        query GetRecentEstimateQuery($type_code: Int!, $project_id: Int!) {
            estimate(
                where: {
                    type_code: { _eq: $type_code }
                    project_id: { _eq: $project_id }
                    deleted_at: { _is_null: true }
                }
                order_by: { created_at: desc }
            ) {
                id
                project {
                    id
                    name
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
                }
                employee_name
                employee_email
                employee_contact
                employee_phone
                destination
                doc_num
                case_name
                estimate_date
                validity
                estimate_price
                details {
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
