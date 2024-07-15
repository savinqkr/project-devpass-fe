import { gql } from "graphql-request";

export namespace GetEmployeeByPkQuery {
    export interface IVariable {
        [key: string]: any;
        id: number;
    }

    export interface IResponse {
        employee_by_pk: {
            id: number;
            name: string;
            account_id: string;
            account_pw: string;
            permission: {
                code: number;
                category: string;
                value: string;
                is_used: boolean;
            };
            company: {
                id: number;
                name: string;
            };
            department: string;
            position: string;
            contact: string;
            phone: string;
            email: string;
            roles: {
                role: {
                    code: number;
                    value: string;
                    special_role?: {
                        code: number;
                        value: string;
                        category: string;
                        is_used: boolean;
                    };
                    is_used: string;
                    created_at: string;
                    updated_at: string;
                    deleted_at: string;
                };
            }[];
            note: string;
            created_at: string;
            updated_at: string;
            deleted_at: string;
        };
    }
    export const Document = gql`
        query GetEmployeeByPkQuery($id: Int!) {
            employee_by_pk(id: $id) {
                id
                name
                account_id
                account_pw
                permission {
                    code
                    category
                    value
                    is_used
                }
                company {
                    id
                    name
                }
                department
                position
                contact
                phone
                email
                roles {
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
                        created_at
                        updated_at
                        deleted_at
                    }
                }
                note
                created_at
                updated_at
                deleted_at
            }
        }
    `;
}
