import { gql } from "graphql-request";
import {
    IAttachment_Bool_Exp,
    IAttachment_Order_By,
} from "src/codegen/graphql";

export namespace GetAllAttachmentsQuery {
    export interface IVariable {
        [key: string]: any;
        where?: IAttachment_Bool_Exp;
        order_by?: [IAttachment_Order_By];
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
        query GetAllAttachmentsQuery(
            $where: attachment_bool_exp
            $order_by: [attachment_order_by!]
        ) {
            attachment(order_by: $order_by, where: $where) {
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
