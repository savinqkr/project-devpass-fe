import { gql } from "graphql-request";
import { IRole_Code_Bool_Exp, IRole_Code_Order_By } from "src/codegen/graphql";

export namespace GetAllRoleCodeQuery {
    export interface IVariable {
        [key: string]: any;
        where?: IRole_Code_Bool_Exp;
        order_by?: IRole_Code_Order_By[];
    }
    export interface IResponse {
        role_code: {
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
        }[];
    }

    export const Document = gql`
        query GetAllRoleCodeQuery(
            $where: role_code_bool_exp
            $order_by: [role_code_order_by!]
        ) {
            role_code(where: $where, order_by: $order_by) {
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
