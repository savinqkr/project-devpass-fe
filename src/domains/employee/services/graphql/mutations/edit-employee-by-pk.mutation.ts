import { gql } from "graphql-request";

export namespace EditEmployeeByPkMutation {
    export interface IVariable {
        [key: string]: any;
        id: number;
        company_id?: number;
        account_id?: string;
        account_pw?: string;
        name: string;
        department?: string;
        position?: string;
        role_codes?: { employee_id: number; role_code: number }[];
        email?: string;
        contact?: string;
        phone?: string;
        note?: string;
    }

    export interface IResponse {
        delete_employee_role: {
            returning: {
                employee: {
                    id: number;
                    name: string;
                };
                role: {
                    code: number;
                    value: string;
                };
            };
        };
        insert_employee_role: {
            returning: {
                employee: {
                    id: number;
                    name: string;
                };
                role: {
                    code: number;
                    value: string;
                };
            };
        };
        update_employee_by_pk: {
            id: number;
            name: string;
            company: {
                id: number;
                name: string;
            };
            department: string;
            position: string;
            roles: {
                role: {
                    code: number;
                    value: string;
                };
            }[];
            email: string;
            contact: string;
            phone: string;
            note: string;
        };
    }
    export const Document = gql`
        mutation EditEmployeeByPkMutation(
            $id: Int!
            $company_id: Int
            $account_id: String
            $account_pw: String
            $name: String!
            $department: String
            $position: String
            $email: String
            $contact: String
            $phone: String
            $note: String
            $role_codes: [employee_role_insert_input!]!
        ) {
            delete_employee_role(where: { employee_id: { _eq: $id } }) {
                returning {
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
            insert_employee_role(objects: $role_codes) {
                returning {
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
            update_employee_by_pk(
                pk_columns: { id: $id }
                _set: {
                    company_id: $company_id
                    account_id: $account_id
                    account_pw: $account_pw
                    name: $name
                    department: $department
                    position: $position
                    email: $email
                    contact: $contact
                    phone: $phone
                    note: $note
                    updated_at: "now()"
                }
            ) {
                id
                name
                company {
                    id
                    name
                }
                department
                position
                roles {
                    role {
                        code
                        value
                    }
                }
                email
                contact
                phone
                note
            }
        }
    `;
}
