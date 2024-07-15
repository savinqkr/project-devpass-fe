import { gql } from "graphql-request";

export namespace RegisterGoalMutation {
    export interface IVariable {
        year: number;
        goal: number;
        type_code: number;
        [key: string]: any;
    }
    export interface IResponse {
        insert_sales_status_one: {
            year: number;
            goal: number;
            type: {
                code: number;
                value: string;
            };
        };
    }

    export const Document = gql`
        mutation registerGoal($year: Int!, $goal: money!, $type_code: Int!) {
            insert_sales_status_one(
                object: {
                    year: $year
                    goal: $goal
                    common_type_code: $type_code
                }
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
