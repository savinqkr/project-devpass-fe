import { gql } from "graphql-request";

export namespace RegisterRoleCodeMutation {
    export interface IVariable {
        [key: string]: any;
        value: string;
        special_role_code?: number;
    }
    export interface IResponse {
        insert_role_code_one: {
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
        mutation RegisterRoleCodeMutation(
            $value: String!
            $special_role_code: Int
        ) {
            insert_role_code_one(
                object: {
                    value: $value
                    special_role_code: $special_role_code
                    is_used: true
                }
            ) {
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
