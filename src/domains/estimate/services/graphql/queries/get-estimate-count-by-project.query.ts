import { gql } from "graphql-request";

export namespace GetEstimateCountByProjectQuery {
    export interface IVariable {
        [key: string]: any;
        project_id: number;
    }

    export interface IResponse {
        project_by_pk: {
            estimates_aggregate: {
                aggregate: {
                    count: number;
                };
            };
        };
    }

    export const Document = gql`
        query GetEstimateCountByProjectQuery($project_id: Int!) {
            project_by_pk(id: $project_id) {
                estimates_aggregate {
                    aggregate {
                        count(columns: id)
                    }
                }
            }
        }
    `;
}
