import { gql } from "graphql-request";

export namespace GetProjectByPkQuery {
    export interface IVariable {
        [key: string]: any;
        id: number;
    }

    export interface IResponse {
        project_by_pk: {
            id: number;
            name: string;
            type: {
                code: number;
                value: string;
                category: string;
            };
            client: {
                id: number;
                name: string;
                busi_no: string;
            };
            contractor?: {
                id: number;
                name: string;
                busi_no?: string;
            };
            start_date?: Date;
            end_date?: Date;
            optrans_date?: Date;
            inspect_date?: Date;
            free_start_date?: Date;
            free_end_date?: Date;
            participate_type?: string;
            note?: string;
            is_canceled: boolean;
            canceled_at: Date;
            partners: {
                company: {
                    id: number;
                    name: string;
                    type: {
                        category: string;
                        code: number;
                        value: string;
                        is_used: boolean;
                    };
                };
            }[];
            employees: {
                employee: {
                    id: number;
                    name: string;
                    email: string;
                    contact: string;
                    phone: string;
                    company: {
                        id: number;
                        name: string;
                        type: {
                            code: number;
                            value: string;
                            category: string;
                        };
                    };
                    deleted_at: Date;
                };
                role: {
                    code: number;
                    value: string;
                    is_used: boolean;
                    special_role?: {
                        code: number;
                        value: string;
                        category: string;
                        is_used: boolean;
                    };
                };
            }[];
            estimates: {
                id: number;
                doc_num: string;
                case_name: string;
                destination: string;
                project: {
                    client: {
                        id: number;
                        name: string;
                    };
                };
                order: number;
                is_final: boolean;
                estimate_date: string;
                updated_at: string;
                deleted_at: string;
            }[];
            contracts: {
                id: number;
                name: string;
                client: {
                    id: number;
                    name: string;
                };
                sales_representative: {
                    id: number;
                    name: string;
                };
                updated_at: string;
                deleted_at: string;
            }[];
            sales: {
                id: number;
                client: {
                    id: number;
                    name: string;
                };
                sales_representative: {
                    id: number;
                    name: string;
                };
                audit_date: string;
                updated_at: string;
                deleted_at: string;
            }[];
            license_contracts: {
                repair_project: {
                    id: number;
                    name: string;
                };
                contract: {
                    id: number;
                    name: string;
                    contract_period_start: string;
                    contract_period_end: string;
                    project: {
                        id: number;
                        name: string;
                    };
                };
            }[];
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
            sequence: number;
            created_at: string;
            created_by: number;
            updated_at: string;
            updated_by?: number;
            deleted_at?: string;
            deleted_by?: number;
        };
    }

    export const Document = gql`
        query GetProjectByPkQuery($id: Int!) {
            project_by_pk(id: $id) {
                id
                name
                type {
                    code
                    value
                    category
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
                canceled_at
                partners {
                    company {
                        id
                        name
                        type {
                            category
                            code
                            value
                            is_used
                        }
                    }
                }
                employees {
                    employee {
                        id
                        name
                        email
                        contact
                        phone
                        company {
                            id
                            name
                            type {
                                code
                                value
                                category
                            }
                        }
                        deleted_at
                    }
                    role {
                        code
                        value
                        special_role {
                            code
                            value
                            category
                            is_used
                        }
                        is_used
                    }
                }
                estimates(order_by: { order: asc }) {
                    id
                    doc_num
                    case_name
                    destination
                    project {
                        client {
                            id
                            name
                        }
                    }
                    order
                    is_final
                    estimate_date
                    updated_at
                    deleted_at
                }
                contracts {
                    id
                    name
                    client {
                        id
                        name
                    }
                    sales_representative {
                        id
                        name
                    }
                    updated_at
                    deleted_at
                }
                sales {
                    id
                    audit_date
                    client {
                        id
                        name
                    }
                    sales_representative {
                        id
                        name
                    }
                    updated_at
                    deleted_at
                }
                license_contracts(
                    order_by: [{ contract: { contract_period_start: asc } }]
                ) {
                    repair_project: project {
                        id
                        name
                    }
                    contract {
                        id
                        name
                        contract_period_start
                        contract_period_end
                        project {
                            id
                            name
                        }
                    }
                }
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
