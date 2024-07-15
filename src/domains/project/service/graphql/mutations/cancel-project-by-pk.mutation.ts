import { gql } from "graphql-request";

export namespace CancelProjectByPkMutation {
    export interface IVariable {
        [key: string]: any;
        id: number; // 사업 ID
        updated_by: number; // 수정한 유저 ID
    }
    export interface IResponse {
        cancelProject: {
            id: number;
            name: string;
            is_canceled: boolean;
        };
    }

    export const Document = gql`
        mutation CancelProjectByPkMutation($id: Int!, $updated_by: Int!) {
            cancelProject(args: { project_id: $id, updated_by: $updated_by }) {
                id
                name
                is_canceled
                canceled_at
                created_at
                created_by
                updated_at
                updated_by
                deleted_at
                deleted_by
            }
        }
    `;
}
