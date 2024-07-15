import { gql } from "graphql-request";

export namespace GetRepairReportOneByIdQuery {
    export interface IVariable {
        id: number;
        [key: string]: any;
    }

    export interface IResponse {
        repair_report_by_pk: {
            project: {
                id: number;
                name: string;
                deleted_at: Date;
            };
            repair_date: Date;
            inspector: {
                id: number;
                name: string;
                deleted_at: Date;
            };
            created_at: Date;
            updated_at: Date;
            deleted_at: Date;
        };
    }

    export const Document = gql`
        query getRepairReportOneByIdQuery($id: Int!) {
            repair_report_by_pk(id: $id) {
                project {
                    id
                    name
                    deleted_at
                }
                repair_date
                inspector {
                    id
                    name
                    deleted_at
                }
                created_at
                updated_at
                deleted_at
            }
        }
    `;
}
