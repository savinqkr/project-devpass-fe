import { gql } from "graphql-request";

export namespace GetCodesByCategoryQuery {
    export interface IVariable {
        [key: string]: any;
        category: string;
        is_used: boolean;
    }
    export interface IResponse {
        common_code: {
            code: string;
            value: string;
            category: string;
            is_used: boolean;
        }[];
    }

    export const Document = gql`
        query GetCodesByCategoryQuery($category: String!, $is_used: Boolean!) {
            common_code(
                where: {
                    category: { _eq: $category }
                    is_used: { _eq: $is_used }
                }
            ) {
                code
                value
                category
                is_used
            }
        }
    `;
}
