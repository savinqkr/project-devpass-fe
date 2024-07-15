import { gql } from "graphql-request";

export namespace GetAllTailQuery {
    export interface IVariable {
        [key: string]: any;
    }

    export interface IResponse {
        tail: {
            id: number;
            type: {
                value: string;
            };
            name: string;
            updated_at: Date;
            deleted_at: Date;
        }[];
    }

    export const Document = gql`
        query GetAllTailQuery {
            tail(
                order_by: [
                    { deleted_at: asc_nulls_first }
                    { updated_at: desc }
                ]
            ) {
                id
                type {
                    value
                }
                name
                updated_at
                deleted_at
            }
        }
    `;
}
