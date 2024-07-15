import { gql } from "graphql-request";

export namespace DeleteRoleCodeMutation {
    export interface IVariable {
        [key: string]: any;
        code: number;
    }
    export interface IResponse {
        delete_role_code_by_pk: {
            code: number;
            value: string;
            special_role?: {
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
        mutation DeleteRoleCodeMutation($code: Int!) {
            delete_role_code_by_pk: update_role_code_by_pk(
                pk_columns: { code: $code }
                _set: { deleted_at: "now()", is_used: false }
            ) {
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
    `;
}
