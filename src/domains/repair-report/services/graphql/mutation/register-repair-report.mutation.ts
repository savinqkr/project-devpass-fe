import { gql } from "graphql-request";

export namespace RegisterRepairReportMutation {
    export interface IVariable {
        repair_project_id: number;
        repair_date: Date;
        inspector_id: number;
        created_by: number;
        updated_by: number;
        [key: string]: any;
    }
    export interface IResponse {
        registerRepairReport: {
            id: number;
        };
    }

    export const Document = gql`
        mutation registerRepairReport(
            $repair_project_id: Int!
            $repair_date: DateTime!
            $inspector_id: Int!
            $created_by: Int!
            $updated_by: Int!
        ) {
            registerRepairReport(
                args: {
                    repair_project_id: $repair_project_id
                    repair_date: $repair_date
                    inspector_id: $inspector_id
                    created_by: $created_by
                    updated_by: $updated_by
                }
            ) {
                id
            }
        }
    `;
}
