import { gql } from "graphql-request";
import {
    IEmployee_Bool_Exp,
    IProject_Employee_Bool_Exp,
} from "src/codegen/graphql";

export namespace GetProjectMembersQuery {
    export interface IVariable {
        [key: string]: any;
        where?: IProject_Employee_Bool_Exp;
    }

    export interface IResponse {
        project_employee: {
            employee: {
                id: number;
                name: string;
                email: string;
                contact: string;
                phone: string;
                position: string;
                company: {
                    id: number;
                    name: string;
                };
            };
            role: {
                code: number;
                value: string;
                special_role?: {
                    code: number;
                    value: string;
                    category: string;
                    is_used: boolean;
                };
                is_used: boolean;
            };
        }[];
    }

    export const Document = gql`
        query GetProjectMembersQuery($where: project_employee_bool_exp) {
            project_employee(where: $where) {
                employee {
                    id
                    name
                    email
                    contact
                    phone
                    position
                    company {
                        id
                        name
                    }
                }
                role {
                    value
                    code
                    special_role {
                        code
                        value
                        category
                        is_used
                    }
                    is_used
                }
            }
        }
    `;
}
