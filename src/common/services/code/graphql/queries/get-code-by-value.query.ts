import { gql } from "graphql-request";

export namespace GetCodeByValueQuery {
    export interface IVariable {
        [key: string]: any;
        value: string;
        category: string;
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
        query GetCodeByValueQuery($category: String!, $value: String!) {
            common_code(
                where: {
                    _and: {
                        category: { _eq: $category }
                        value: { _eq: $value }
                        is_used: { _eq: true }
                    }
                }
            ) {
                category
                code
                is_used
                value
            }
        }
    `;
}
