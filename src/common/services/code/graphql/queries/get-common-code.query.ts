import { gql } from "graphql-request";
import {
    ICommon_Code_Bool_Exp,
    ICommon_Code_Order_By,
} from "src/codegen/graphql";

export namespace GetCommonCodeQuery {
    export interface IVariable {
        [key: string]: any;
        where?: ICommon_Code_Bool_Exp;
        order_by?: ICommon_Code_Order_By[];
    }
    export interface IResponse {
        common_code: {
            code: number;
            value: string;
            category: string;
            is_used: boolean;
        }[];
    }

    export const Document = gql`
        query GetCommonCodeQuery(
            $where: common_code_bool_exp
            $order_by: [common_code_order_by!]
        ) {
            common_code(where: $where, order_by: $order_by) {
                category
                code
                value
                is_used
            }
        }
    `;
}
