import { gql } from "graphql-request";

export namespace GetTailByIdQuery {
    export interface IVariable {
        id: number;
        [key: string]: any;
    }

    export interface IResponse {
        tail_by_pk: {
            type: {
                code: number;
                value: string;
            };
            name: string;
            contents: string;
            deleted_at: Date;
        };
    }

    export const Document = gql`
        query getTailById($id: Int!) {
            tail_by_pk(id: $id) {
                type {
                    code
                    value
                }
                name
                contents
                deleted_at
            }
        }
    `;
}
