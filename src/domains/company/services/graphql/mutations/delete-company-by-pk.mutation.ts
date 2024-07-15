import { gql } from "graphql-request";

export namespace DeleteCompanyByPkMutation {
    export interface IVariable {
        [key: string]: any;
        id: number;
    }

    export interface IResponse {
        delete_company_by_pk: {
            id: number;
            name: string;
            type: {
                category: string;
                code: number;
                is_used: boolean;
                value: string;
            };
            deleted_at: string;
        };
        delete_employees: {
            returning: {
                id: number;
                name: string;
                roles: {
                    role: {
                        code: number;
                        value: string;
                    };
                }[];
            };
        };
    }
    export const Document = gql`
        mutation DeleteCompanyByPkMutation($id: Int!) {
            delete_company_by_pk: update_company_by_pk(
                pk_columns: { id: $id }
                _set: { deleted_at: "now()" }
            ) {
                id
                name
                type {
                    code
                    value
                    is_used
                    category
                }
                deleted_at
            }
            delete_employees: update_employee(
                where: { company_id: { _eq: $id } }
                _set: { deleted_at: "now()" }
            ) {
                returning {
                    id
                    name
                    roles {
                        role {
                            code
                            value
                        }
                    }
                }
            }
        }
    `;
}
