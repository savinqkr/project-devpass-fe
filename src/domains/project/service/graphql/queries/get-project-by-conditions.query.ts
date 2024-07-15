import { gql } from "graphql-request";
import { IProject_Bool_Exp } from "src/codegen/graphql";

export namespace GetProjectByConditionsQuery {
    export interface IVariable {
        [key: string]: any;
        where?: IProject_Bool_Exp;
        // type_code: number;
    }

    export interface IResponse {
        project: {
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
            contractor: {
                id: number;
                name: string;
                busi_no: string;
            };
            start_date: Date;
            end_date: Date;
            optrans_date: Date;
            inspect_date: Date;
            free_start_date: Date;
            free_end_date: Date;
            participate_type: string;
            repair_rate: number;
            repair_last_year_rate: number;
            note: string;
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
                    company: {
                        id: number;
                        name: string;
                        type: {
                            code: number;
                            value: string;
                            category: string;
                        };
                    };
                    deleted_at: string | null;
                };
                role: {
                    code: number;
                    is_used: boolean;
                    special_role?: {
                        code: number;
                        value: string;
                        category: string;
                        is_used: boolean;
                    };
                    value: string;
                };
            }[];
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
        query GetProjectByClientIdAndTypeQuery($where: project_bool_exp) {
            project(where: $where) {
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
                repair_rate
                repair_last_year_rate
                note
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
