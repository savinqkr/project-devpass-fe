import { gql } from "graphql-request";

export namespace GetCodeByPkQuery {
    export interface IVariable {
        [key: string]: any;
        code: number;
    }
    export interface IResponse {
        common_code_by_pk: {
            code: string;
            value: string;
            category: string;
            is_used: boolean;
        };
    }

    export const Document = gql`
        query GetCodeByPkQuery($code: Int!) {
            common_code_by_pk(code: $code) {
                code
                value
                category
                is_used
            }
        }
    `;
}
