import { gql } from "graphql-request";

export namespace GetGoalByYearQuery {
    export interface IVariable {
        year: number;
        type_code: number;
        [key: string]: any;
    }

    export interface IResponse {
        sales_status_by_pk: {
            year: number;
            goal: number;
            type: {
                code: string;
                value: string;
            };
        } | null;
    }

    export const Document = gql`
        query getGoalByYear($year: Int!, $type_code: Int!) {
            sales_status_by_pk(year: $year, common_type_code: $type_code) {
                year
                goal
                type {
                    code
                    value
                }
            }
        }
    `;
}
