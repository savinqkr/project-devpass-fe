import { gql } from "graphql-request";
import { ICommon_Code_Bool_Exp } from "src/codegen/graphql";

export namespace GetCommonCodeQuery {
    export interface IVariable {
        [key: string]: any;
        where?: ICommon_Code_Bool_Exp;
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
        query GetCommonCodeQuery($where: common_code_bool_exp) {
            common_code(where: $where) {
                category
                code
                value
                is_used
            }
        }
    `;
}
