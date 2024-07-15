import { gql } from "graphql-request";

export namespace UpdateRepairReportMutation {
    export interface IVariable {
        repair_report_id: number;
        repair_project_id: number;
        repair_date: Date;
        inspector_id: number;
        updated_by: number;
        [key: string]: any;
    }
    export interface IResponse {
        updateRepairReport: {
            id: number;
        };
    }

    export const Document = gql`
        mutation updateRepairReport(
            $repair_report_id: Int!
            $repair_project_id: Int!
            $repair_date: DateTime!
            $inspector_id: Int!
            $updated_by: Int!
        ) {
            updateRepairReport(
                args: {
                    repair_report_id: $repair_report_id
                    repair_project_id: $repair_project_id
                    repair_date: $repair_date
                    inspector_id: $inspector_id
                    updated_by: $updated_by
                }
            ) {
                id
            }
        }
    `;
}
