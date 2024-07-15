import { gql } from "graphql-request";
import { AttachmentType } from "src/enums/attachment_types.enum";

export namespace GetAttachmentsByParentIdQuery {
    export interface IVariable {
        [key: string]: any;
        parent_id: number;
    }
    export interface IResponse {
        attachment: {
            id: number;
            parent_id: number;
            file_name: string;
            file_type: string;
            file_path: string;
            bank_name: string | null;
            bank_account: string | null;
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
        query GetAttachmentsByParentIdQuery($parent_id: Int!) {
            attachment(where: { parent_id: { _eq: $parent_id } }) {
                id
                parent_id
                file_name
                file_type
                file_path
                bank_name
                bank_account
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
