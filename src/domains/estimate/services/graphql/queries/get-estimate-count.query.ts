import { gql } from "graphql-request";

export namespace GetEstimateCountQuery {
    export interface IVariable {
        [key: string]: any;
    }

    export interface IResponse {
        estimate_aggregate: {
            aggregate: {
                count: number;
            };
        };
    }

    export const Document = gql`
        query GetEstimateCountQuery {
            estimate_aggregate {
                aggregate {
                    count
                }
            }
        }
    `;
}
