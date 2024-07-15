import { gql } from "graphql-request";
import { IEmployee_Bool_Exp } from "src/codegen/graphql";
import { IGetAllUserAndEmployeeQuery } from "../../employee.service.interface";
export namespace GetAllUserAndEmployeeQuery {
    export interface IVariable {
        [key: string]: any;
        where?: IEmployee_Bool_Exp;
    }

    export interface IResponse {
        employee: {
            id: number;
            name: string;
            company: {
                id: number;
                name: string;
            };
            department: string;
            position: string;
            email: string;
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
                    is_used: string;
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
        query GetAllUserAndEmployeeQuery($where: employee_bool_exp) {
            employee(where: $where) {
                id
                name
                company {
                    id
                    name
                }
                department
                position
                email
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
