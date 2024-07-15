import { gql } from "graphql-request";

export namespace DeleteRepairReportMutation {
    export interface IVariable {
        id: number;
        deleted_by_id: number;
        [key: string]: any;
    }
    export interface IResponse {
        deletedRepairReport: {
            id: number;
        };
    }

    export const Document = gql`
        mutation deletedRepairReport($id: Int!, $deleted_by_id: Int!) {
            deletedRepairReport(id: $id, deleted_by_id: $deleted_by_id) {
                id
            }
        }
    `;
}
