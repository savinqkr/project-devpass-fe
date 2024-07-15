import { gql } from "graphql-request";
import { AttachmentType } from "src/enums/attachment_types.enum";

export namespace GetAttachmentsByTypeQuery {
    export interface IVariable {
        [key: string]: any;
        types: AttachmentType[];
    }
    export interface IResponse {
        attachment: {
            id: number;
            parent_id: number;
            file_name: string;
            file_type: string;
            file_path: string;
            type: {
                code: number;
                category: string;
                is_used: boolean;
                value: string;
            };
            created_at: string;
            created_by: number;
            deleted_at: string;
            deleted_by: number | null;
        }[];
    }

    export const Document = gql`
        query GetAttachmentsByTypeQuery($types: [String!]) {
            attachment(where: { type: { value: { _in: $types } } }) {
                id
                parent_id
                file_name
                file_type
                file_path
                type {
                    category
                    code
                    is_used
                    value
                }
                created_at
                created_by
                deleted_at
                deleted_by
            }
        }
    `;
}
