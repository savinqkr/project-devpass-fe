import { gql } from "graphql-request";

export namespace GetRoleCodeByPkQuery {
    export interface IVariable {
        [key: string]: any;
        code: number;
    }
    export interface IResponse {
        role_code_by_pk: {
            code: number;
            value: string;
            special_role: {
                code: number;
                category: string;
                value: string;
                is_used: boolean;
            };
            is_used: boolean;
            created_at: string;
            updated_at: string;
            deleted_at: string;
        };
    }

    export const Document = gql`
        query GetRoleCodeByPkQuery($code: Int!) {
            role_code_by_pk(code: $code) {
                code
                value
                special_role {
                    code
                    value
                    is_used
                    category
                }
                is_used
                created_at
                updated_at
                deleted_at
            }
        }
    `;
}
