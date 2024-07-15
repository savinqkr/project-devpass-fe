import { gql } from "graphql-request";

export namespace DeleteProjectByIdMutation {
    export interface IVariable {
        [key: string]: any;
        id: number; // 사업 ID
        deleted_by: number; // 삭제한 유저 ID
    }

    export interface IResponse {
        deleteProject: {
            id: number;
            name: string;
            sequence: number;
            created_at: string;
            created_by: number;
            updated_at: string;
            updated_by?: number;
            deleted_at?: string;
            deleted_by?: number;
        };
    }

    export const Document = gql`
        mutation DeleteProjectByIdMutation($id: Int!, $deleted_by: Int!) {
            deleteProject(args: { project_id: $id, deleted_by: $deleted_by }) {
                id
                name
                sequence
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
