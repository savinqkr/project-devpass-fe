import { gql } from "graphql-request";

export namespace RegisterEmployeeMutation {
    export interface IVariable {
        [key: string]: any;
        company_id: number;
        name: string;
        department?: string;
        position?: string;
        role_codes?: { role_code: number }[];
        email?: string;
        contact?: string;
        phone?: string;
        note?: string;
    }

    export interface IResponse {
        insert_employee_one: {
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
        mutation RegisterEmployeeMutation(
            $company_id: Int!
            $name: String!
            $department: String
            $position: String
            $role_codes: [employee_role_insert_input!]!
            $email: String
            $contact: String
            $phone: String
            $note: String
        ) {
            insert_employee_one(
                object: {
                    company_id: $company_id
                    name: $name
                    department: $department
                    position: $position
                    roles: { data: $role_codes }
                    email: $email
                    contact: $contact
                    phone: $phone
                    note: $note
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
