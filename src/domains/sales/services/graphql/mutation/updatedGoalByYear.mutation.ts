import { gql } from "graphql-request";

export namespace UpdatedGoalMutation {
    export interface IVariable {
        year: number;
        goal: number;
        type_code: number;
        [key: string]: any;
    }
    export interface IResponse {
        update_sales_status_by_pk: {
            year: number;
            goal: number;
            type: {
                code: string;
                value: number;
            };
        };
    }

    export const Document = gql`
        mutation updatedGoal($year: Int!, $goal: money!, $type_code: Int!) {
            update_sales_status_by_pk(
                pk_columns: { year: $year, common_type_code: $type_code }
                _set: { goal: $goal }
            ) {
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
