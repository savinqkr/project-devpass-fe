import { gql } from "graphql-request";
import { IEmployee_Bool_Exp, IEmployee_Order_By } from "src/codegen/graphql";

export namespace GetAllUsersQuery {
    export interface IVariable {
        [key: string]: any;
        where?: IEmployee_Bool_Exp;
        order_by?: IEmployee_Order_By[];
    }

    export interface IResponse {
        employee: {
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
                    created_at: string;
                    updated_at: string;
                    deleted_at: string;
                };
            }[];
            created_at: string;
            updated_at: string;
            deleted_at: string;
        }[];
    }
    export const Document = gql`
        query GetAllUsersQuery(
            $where: employee_bool_exp
            $order_by: [employee_order_by!]
        ) {
            employee(where: $where, order_by: $order_by) {
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
                    }
                }
                created_at
                updated_at
                deleted_at
            }
        }
    `;
}
