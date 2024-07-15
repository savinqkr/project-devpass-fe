import { gql } from "graphql-request";

export namespace EditRoleCodeMutation {
    export interface IVariable {
        [key: string]: any;
        code: number;
        value: string;
        special_role_code?: number;
    }
    export interface IResponse {
        update_role_code_by_pk: {
            code: number;
            value: string;
            special_role: {
                code: number;
                value: string;
                category: string;
                is_used: boolean;
            };
            is_used: boolean;
            created_at: string;
            updated_at: string;
            deleted_at: string;
        };
    }

    export const Document = gql`
        mutation EditRoleCodeMutation(
            $code: Int!
            $value: String!
            $special_role_code: Int
        ) {
            update_role_code_by_pk(
                pk_columns: { code: $code }
                _set: { special_role_code: $special_role_code, value: $value }
            ) {
                code
                created_at
                deleted_at
                special_role {
                    code
                    value
                    category
                    is_used
                }
                is_used
                updated_at
                value
            }
        }
    `;
}
