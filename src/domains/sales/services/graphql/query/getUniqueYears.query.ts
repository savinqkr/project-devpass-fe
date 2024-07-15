import { gql } from "graphql-request";

export namespace GetUniqueYearsQuery {
    export interface IVariable {
        common_type: string;
        [key: string]: any;
    }

    export interface IResponse {
        getUniqueYears: number[];
    }

    export const Document = gql`
        query getUniqueYears($common_type: String!) {
            getUniqueYears(common_type: $common_type)
        }
    `;
}
