import { gql } from "graphql-request";
import { IRepair_Report_Bool_Exp } from "src/codegen/graphql";

export namespace GetAllRepairReportQuery {
    export interface IVariable {
        where?: IRepair_Report_Bool_Exp;
        [key: string]: any;
    }

    export interface IResponse {
        repair_report: {
            id: number;
            inspector_id: number;
            inspector: {
                id: number;
                name: string;
                deleted_at: Date;
            };
            repair_date: Date;
            repair_project_id: number;
            project: {
                id: number;
                name: string;
                deleted_at: Date;
            };
            created_at: Date;
            created_by: number;
            updated_at: Date;
            updated_by: number;
            deleted_at: Date;
        }[];
    }

    export const Document = gql`
        query GetAllRepairReportQuery($where: repair_report_bool_exp) {
            repair_report(
                order_by: [
                    { deleted_at: asc_nulls_first }
                    { updated_at: desc }
                ]
                where: $where
            ) {
                id
                inspector_id
                inspector {
                    id
                    name
                    deleted_at
                }
                repair_date
                repair_project_id
                project {
                    id
                    name
                    deleted_at
                }
                created_at
                created_by
                updated_at
                updated_by
                deleted_at
            }
        }
    `;
}
