import { gql } from "graphql-request";

export namespace EditUserMutation {
    export interface IVariable {
        [key: string]: any;
        id: number;
        account_pw?: string;
        name?: string;
        department?: string;
        position?: string;
        email?: string;
        contact?: string;
        phone?: string;
        roleCodes?: number[];
    }

    export interface IResponse {
        editUser: {
            id: number;
            permission: {
                code: number;
                value: string;
                is_used: boolean;
                category: string;
            };
            company: {
                id: number;
                name: string;
            };
            name: string;
            account_id: string;
            account_pw: string;
            department: string;
            position: string;
            email: string;
            contact: string;
            phone: string;
        };
    }
    export const Document = gql`
        mutation EditUserMutation(
            $id: Int!
            $account_pw: String
            $name: String
            $department: String
            $position: String
            $email: String
            $contact: String
            $phone: String
            $roleCodes: [Int!]
        ) {
            editUser(
                args: {
                    id: $id
                    account_pw: $account_pw
                    name: $name
                    department: $department
                    position: $position
                    email: $email
                    contact: $contact
                    phone: $phone
                    roleCodes: $roleCodes
                }
            ) {
                id
                permission {
                    code
                    value
                    is_used
                    category
                }
                company {
                    id
                    name
                }
                name
                account_id
                account_pw
                department
                position
                email
                contact
                phone
            }
        }
    `;
}
